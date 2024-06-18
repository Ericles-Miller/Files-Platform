import { inject, injectable } from 'inversify';

import { IFileData } from '@Applications/Interfaces/files/IFileData';
import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { s3 } from '@Applications/Services/awsS3';
import { streamToBuffer } from '@Applications/Services/stream';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { AppError } from '@Domain/Exceptions/AppError';
import { Files } from '@prisma/client';

@injectable()
export class DownloadFilesUseCase {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) {}

  async execute(userId: string, fileId: string) : Promise<IFileData> {
    try {
      const file: Files = await this.filesRepository.findById(fileId);
      if (!file) {
        throw new AppError('UserId does not exists!', 404);
      }

      if (userId !== file.userId) {
        throw new AppError('That file does not belong this user or userId is incorrect!', 400);
      }

      const getFile = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: file.fileName,
      });

      const response = await s3.send(getFile);

      const fileData = {
        body: await streamToBuffer(response.Body),
        fileName: file.fileName,
        contentType: response.ContentType,
      };

      return fileData;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
