import { IUsersRepository } from "@Applications/Interfaces/repositories/IUsersRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { inject, injectable } from "inversify";
import { FindFoldersChildrenUseCase } from "./FindFoldersChildrenUseCase";
import { FindFilesChildrenUseCase } from "../files/FindFilesChildrenUseCase";
import { Users } from "@prisma/client";
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from "@Applications/Services/awsS3";
import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver'; 
import * as os from 'os'; 
import { promisify } from "util";
import { pipeline } from "stream";
import { ISaveFiles } from "@Applications/Interfaces/files/ISaveFiles";
import { IFoldersRepository } from "@Applications/Interfaces/repositories/IFoldersRepository";


const streamPipeline = promisify(pipeline);


@injectable()
export class DownloadFolderUseCase {
  constructor (
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("FoldersRepository")
    private foldersRepository: IFoldersRepository,
    @inject(FindFoldersChildrenUseCase)
    private findFoldersChildrenUseCase : FindFoldersChildrenUseCase,
    @inject(FindFilesChildrenUseCase)
    private findFilesChildrenUseCase : FindFilesChildrenUseCase,
  ) {}

  async execute(userId: string, folderId: string): Promise<string> {
    const user: Users = await this.usersRepository.findById(userId);
    if (!user) {
      throw new AppError('UserId does not exists!', 404);
    } 
    
    const folderBelongingUser = await this.foldersRepository.folderBelongingUser(userId, folderId);
    if (!folderBelongingUser) {
      throw new AppError('That folder does not belong this user or userId is incorrect', 400);
    }

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'download-'));
    await this.downloadAndSaveFolder({ userId, folderId, parentDir: tempDir });

    const zipFilePath = path.join(tempDir, 'folder.zip');
    await this.createZip(tempDir, zipFilePath);

    return zipFilePath;
  }

  private async downloadAndSaveFolder({ userId, folderId, parentDir } : ISaveFiles) {
    const folders = await this.findFoldersChildrenUseCase.execute({ userId, id: folderId });
    const files = await this.findFilesChildrenUseCase.execute({ userId, id: folderId });

    for (const file of files) {
      const getFile = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: file.fileName,
      });
  
      const response = await s3.send(getFile);
    
      if (!response.Body) {
        throw new Error('Response body is empty');
      }

      const filePath = path.join(parentDir, file.folderPath, file.fileName);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const fileStream = fs.createWriteStream(filePath);
      await streamPipeline(response.Body as NodeJS.ReadableStream, fileStream);
    }

    for (const folder of folders) {
      const folderPath = path.join(parentDir, folder.path);
      fs.mkdirSync(folderPath, { recursive: true });
      await this.downloadAndSaveFolder({ userId: folder.userId, folderId: folder.id, parentDir: folderPath });
    }
  }

  private createZip(sourceDir: string, outPath: string): Promise<void> {
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', resolve);
      archive.on('error', reject);
      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }
}
