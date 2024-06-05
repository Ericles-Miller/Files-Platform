import { IFilesRepository } from '@Applications/Interfaces/IFilesRepository';
import { AppError } from '@Domain/Exceptions/AppError';
import { inject, injectable } from 'inversify';
import {GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import { s3 } from '@Applications/Services/awsS3';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Files } from '@prisma/client';

@injectable()
export class DownloadFilesUseCase {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) {}

  async execute(userId: string, fileId: string) : Promise<string> {
    
    const file: Files = await this.filesRepository.findById(fileId);
    if (!file) {
      throw new AppError('userId does not exists', 404);
    }

    if(userId !== file.userId) {
      throw new AppError('That folder does not belong this user or userId is incorrect!', 400);
    }

    const getFile = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: file.fileName,
    });
    const url = await getSignedUrl(s3, getFile, { expiresIn: 3600 });
    const filePath = await this.downloadFile(url, file.fileName);

    return filePath;
  }

  private async downloadFile(url: string, filename: string): Promise<string> {
    const filePath = path.join(__dirname, '../../../../assets/downloads', filename);

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const writer = fs.createWriteStream(filePath);

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  }
}