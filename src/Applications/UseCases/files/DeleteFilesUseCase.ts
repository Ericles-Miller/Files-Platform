import { IFilesRepository } from '@Applications/Interfaces/IFilesRepository';
import { AppError } from '@Domain/Exceptions/AppError';
import { Files } from '@prisma/client';
import { inject, injectable } from 'inversify';
import {DeleteObjectCommand} from '@aws-sdk/client-s3';
import { s3 } from '@Applications/Services/awsS3';

@injectable()
export class DeleteFilesUseCase {
  constructor (
    @inject('FilesRepository')
    private filesRepository: IFilesRepository
  ) {}

  async execute(userId: string, folderId: string): Promise<void> {
    try {
      const filesBelongingUser = await this.filesRepository.filesBelongingUser(userId, folderId);
      if(!filesBelongingUser) {
        throw new AppError('That folder does not belong this user or userId is incorrect!', 400);
      }

      if(filesBelongingUser.fileName) {
        try {
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: filesBelongingUser.fileName,
          }))
        } catch (error) {
          console.log('The image is not in the cloud');
        }
      }
      await this.filesRepository.delete(filesBelongingUser.id);
    } catch (error) {
      if(error instanceof AppError) {
        throw error;
      }
      console.log(error);      
      throw new AppError('Unexpected server error!', 500);
    }
  }
}