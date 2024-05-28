import { IFilesRepository } from "@Applications/Interfaces/IFilesRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { inject, injectable } from "inversify";
import {GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import { s3 } from "@Applications/Services/awsS3";
import { IListFiles } from "@Applications/Interfaces/files/IListFiles";
import { IFindFilesDTO } from "@Infra/DTOs/Files/IFindFilesDTO";

@injectable()
export class FindFilesChildrenUseCase {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ){}

  async execute({ id, userId }: IFindFilesDTO): Promise<IListFiles[]> {
    
    const filesBelongingUser = await this.filesRepository.filesBelongingUser(userId, id);
    if(!filesBelongingUser) {
      throw new AppError('that folder does not belong this user or userId is incorrect!', 400);
    }

    const files = await this.filesRepository.findFilesChildren({ userId, id });   
  
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
    }))

    return listFiles;
  }
}