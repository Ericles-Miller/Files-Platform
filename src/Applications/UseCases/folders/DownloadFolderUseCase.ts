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
    const folderPath = path.join(tempDir, folderBelongingUser.displayName);
    fs.mkdirSync(folderPath, { recursive: true });
    
    await this.downloadAndSaveFolder({ 
      userId, folderId, parentDir: `${tempDir}/${folderBelongingUser.displayName}`
    });
    
    const dirPath = fs.mkdtempSync(path.join(os.tmpdir(), 'download-'));
    const zipFilePath = path.join(dirPath, `${folderBelongingUser.displayName}.zip`);
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
        throw new AppError('Response body is empty', 404);
      }

      const fileStream = fs.createWriteStream(path.join(parentDir, file.fileName));
      await streamPipeline(response.Body as NodeJS.ReadableStream, fileStream);
    }

    for (const folder of folders) {
      const folderPath = path.join(parentDir, folder.displayName);
      fs.mkdirSync(folderPath, { recursive: true });

      await this.downloadAndSaveFolder({ 
        userId: folder.userId, folderId: folder.id, parentDir: folderPath 
      });
    }
  }

  private async createZip(sourceDir: string, outPath: string): Promise<void> {
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
