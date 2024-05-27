import { IListFiles } from "@Applications/Interfaces/files/IListFiles";
import { IFilesRepository } from "@Applications/Interfaces/IFilesRepository";
import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { Files } from "@prisma/client";
import {GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import { s3 } from "@Applications/Services/awsS3";
import { inject, injectable } from "inversify";

@injectable()
export class ListFilesByNameUseCase {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
    @inject("FoldersRepository")
    private foldersRepository: IFoldersRepository,
  ){ }

  async execute(displayName: string, userId:string, parentId?:string): Promise<Files[]> {
    if(!parentId) {
      throw new AppError('folderId is null!', 404);
    }

    const folder: Files = await this.foldersRepository.findById(parentId);
    if(!folder.id) {
      throw new AppError('folderId does not exists!', 404);
    }
    
    const files = await this.filesRepository.searchFilesByName(displayName, userId, parentId);

    const listFiles = Promise.all(files.map(async (file) => {
      const getFile = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: file.displayName,
      });
      const url = await getSignedUrl(s3, getFile, {expiresIn : 3600});

      const list : IListFiles = {
        id: file.id,
        createdAt: file.createdAt,
        displayName: url,
        fileName: file.fileName,
        folderId: file.folderId,
        folderPath: file.folderPath,
        size: file.size,
        type: file.type,
        updatedAt: file.updatedAt,
        userId: userId
      }
      return list;
  }));
  
    return listFiles;
  }
}