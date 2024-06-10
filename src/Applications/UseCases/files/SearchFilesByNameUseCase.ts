import { IListFiles } from '@Applications/Interfaces/files/IListFiles';
import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { AppError } from '@Domain/Exceptions/AppError';
import { Files } from '@prisma/client';
import {GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import { s3 } from '@Applications/Services/awsS3';
import { inject, injectable } from 'inversify';
import { ISearchFileDTO } from '@Infra/DTOs/Files/ISearchFilesDTO';
import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';

@injectable()
export class SearchFilesByNameUseCase {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
  ){ }

  async execute({ displayName, userId, parentId }: ISearchFileDTO): Promise<Files[]> {
    if(!parentId) {
      const files = await this.filesRepository.searchFilesByName({ displayName, userId });

      const listFiles = Promise.all(files.map(async (file) => {
        const getFile = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: file.displayName,
        });
        const url = await getSignedUrl(s3, getFile, { expiresIn : 3600 });
  
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

    const folder: Files = await this.foldersRepository.findById(parentId);
    if(!folder.id) {
      throw new AppError('folderId does not exists!', 404);
    }
    
    const files = await this.filesRepository.searchFilesByName({ displayName, userId, parentId });

    const listFiles = Promise.all(files.map(async (file) => {
      const getFile = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: file.displayName,
      });
      const url = await getSignedUrl(s3, getFile, { expiresIn : 3600 });

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