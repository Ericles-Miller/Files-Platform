import { inject, injectable } from 'inversify';

import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { s3 } from '@Applications/Services/awsS3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { File } from '@Domain/Entities/File';
import { AppError } from '@Domain/Exceptions/AppError';
import { ICreateFileDTO } from '@Infra/DTOs/Files/ICreateFileDTO';

import { CalcSizeFoldersUseCase } from '../folders/CalcSizeFoldersUseCase';


@injectable()
export class CreateFilesUseCase {
  constructor(
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
    @inject(CalcSizeFoldersUseCase)
    private calcSizeFoldersUseCase : CalcSizeFoldersUseCase,
  ) {}

  async execute({ file, folderId, userId }: ICreateFileDTO) : Promise<void> {
    try {
      if (folderId && file) {
        const folderBelongingUser = await this.foldersRepository.folderBelongingUser(userId, folderId);
        if (!folderBelongingUser) {
          throw new AppError('That folder does not belong this user or userId is incorrect!', 400);
        }

        const newFile = new File({
          displayName: file.originalname, fileName: file.originalname, folderId, id: null, userId,
        });

        newFile.setSize(file.size);
        newFile.setType(file.mimetype);
        newFile.setPath(`${folderBelongingUser.path}`);

        const filePath = await this.filesRepository.findPathWitSameName(newFile.folderPath, userId);
        if (filePath) {
          throw new AppError('The file name already exists in dir. Please choose another name!', 400);
        }

        await s3.send(new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: `${folderBelongingUser.path}/${file.originalname}`,
          Body:file.buffer,
          ContentType: file.mimetype,
        }));

        await this.filesRepository.create(newFile);
        this.calcSizeFoldersUseCase.execute(folderId);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
