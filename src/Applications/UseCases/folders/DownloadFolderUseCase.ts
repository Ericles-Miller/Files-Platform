import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { IUsersRepository } from "@Applications/Interfaces/IUsersRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { inject, injectable } from "inversify";
import { FindFoldersChildrenUseCase } from "./FindFoldersChildrenUseCase";
import { FindFilesChildrenUseCase } from "../files/FindFilesChildrenUseCase";
import { Files, Folders, Users } from "@prisma/client";
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from "@Applications/Services/awsS3";
import * as fs from 'fs';
import * as path from 'path';

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

  async execute(userId: string, folderId: string) : Promise<any> {
    const user: Users = await this.usersRepository.findById(userId);
    if (!user) {
      throw new AppError('UserId does not exists!', 404);
    } 
    
    const folderBelongingUser = await this.foldersRepository.folderBelongingUser(userId, folderId);
    if (!folderBelongingUser) {
      throw new AppError('That folder does not belong this user or userId is incorrect', 400);
    }

    const folders = await this.findFoldersChildrenUseCase.execute({ userId, id: folderId });
    const files = await this.findFilesChildrenUseCase.execute({ userId, id: folderId });

    files.map(async (file) => {
      await this.downloadAndSaveFile(folderId, file);
    });

    folders.map(async (folder) => {
      await this.downloadAndSaveFile(folder);
    })

  }

  private async downloadAndSaveFile(folder: Folders, file?: Files) {
    if(file) {
      const getFile = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: file.fileName,
      });
  
      const response = await s3.send(getFile);
  
      // Ensure the directory exists
      fs.mkdirSync(path.dirname(file.folderPath), { recursive: true });
  
      // Write file to the local file system
      const fileStream = fs.createWriteStream(file.folderPath);
      await new Promise((resolve, reject) => {
      if(response.Body) {
        response.Body.pipe(fileStream);
        response.Body.on('end', resolve);
        response.Body.on('error', reject);
      }
      });
    } else {
      const files = await this.findFilesChildrenUseCase.execute({ userId: folder.userId, id: folder.id });

      files.map(async (file) => {
        const getFile = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: file.fileName,
        });
    
        const response = await s3.send(getFile);
    
        // Ensure the directory exists
        fs.mkdirSync(path.dirname(file.folderPath), { recursive: true });
    
        // Write file to the local file system
        const fileStream = fs.createWriteStream(file.folderPath);
        await new Promise((resolve, reject) => {
          if(response.Body) {
            response.Body.pipe(fileStream);
            response.Body.on('end', resolve);
            response.Body.on('error', reject);
          }
        });
      })
    }
  }
}