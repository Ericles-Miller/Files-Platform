import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { AppError } from '@Domain/Exceptions/AppError';
import { Files } from '@prisma/client';
import { inject, injectable } from 'inversify';
import {DeleteObjectCommand} from '@aws-sdk/client-s3';
import { s3 } from '@Applications/Services/awsS3';
import { CalcSizeFoldersUseCase } from '../folders/CalcSizeFoldersUseCase';
import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';

@injectable()
export class DeleteFilesUseCase {
  constructor (
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
    @inject(CalcSizeFoldersUseCase)
    private calcSizeFoldersUseCase : CalcSizeFoldersUseCase
  ) {}

  async execute(userId: string, folderId: string, id: string): Promise<void> {
    try {
      const filesBelongingUser = await this.foldersRepository.folderBelongingUser(userId, folderId);
      if(!filesBelongingUser) {
        throw new AppError('That folder does not belong this user or userId is incorrect!', 400);
      }

      const file: Files = await this.filesRepository.findById(id);
      if(!file) {
        throw new AppError('Id the file does not exists!', 404);
      }

      if(file.fileName) {
        try {
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: file.fileName,
          }))
        } catch (error) {
          console.log('The image is not in the cloud');
        }
      }
      await this.filesRepository.delete(file.id);

      /// set size 
      await this.calcSizeFoldersUseCase.execute(folderId);

    } catch (error) {
      if(error instanceof AppError) {
        throw error;
      }
      console.log(error);      
      throw new AppError('Unexpected server error!', 500);
    }
  }
}