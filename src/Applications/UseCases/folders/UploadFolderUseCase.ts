import fs from 'fs';
import { inject, injectable } from 'inversify';
import path from 'path';
import rimraf from 'rimraf';

import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { s3 } from '@Applications/Services/awsS3';
import { unzip } from '@Applications/Services/unzip';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { File } from '@Domain/Entities/File';
import { AppError } from '@Domain/Exceptions/AppError';
import { Folders } from '@prisma/client';

import { CalcSizeFoldersUseCase } from './CalcSizeFoldersUseCase';
import { CreateFolderUseCase } from './CreateFolderUseCase';


@injectable()
export class UploadFolderUseCase {
  constructor(
    @inject(CalcSizeFoldersUseCase)
    private calcSizeFoldersUseCase : CalcSizeFoldersUseCase,
    @inject(CreateFolderUseCase)
    private createFolderUseCase: CreateFolderUseCase,
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute(displayName: string, userId: string, parentId?: string): Promise<void> {
    try {
      await unzip(displayName, userId);
      const [nameFolder] = displayName.split('.');

      await this.uploadFoldersAndFiles(nameFolder, userId, parentId);

      const pathFolder = path.join(__dirname, `../../../../tmp/unzipFolders/${userId}/${nameFolder}`);
      rimraf.sync(pathFolder);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error the execute update folder:', error);
      throw new AppError('Unexpected server error!', 500);
    }
  }

  private async uploadFoldersAndFiles(displayName: string, userId: string, parentId?: string): Promise<void> {
    try {
      let folder : Folders;
      let rootPath;
      let pathFolder;

      if (parentId) {
        const parentFolder: Folders = await this.foldersRepository.findById(parentId);
        if (!parentFolder) {
          throw new AppError('The folderId does not exists', 404);
        }

        folder = await this.createFolderUseCase.execute({ displayName, parentId, userId });
        rootPath = `/root/${userId}/${parentFolder.displayName}`;
        pathFolder = folder.path.replace(rootPath, `/${userId}`);
        pathFolder = path.join(__dirname, `../../../../tmp/unzipFolders/${pathFolder}`);
      } else {
        folder = await this.createFolderUseCase.execute({ displayName, userId, parentId: null });
        rootPath = `/root`;
        pathFolder = folder.path.replace(rootPath, '');
        pathFolder = path.join(__dirname, `../../../../tmp/unzipFolders/${pathFolder}`);
      }


      const items = fs.readdirSync(pathFolder);

      const folders = items.filter((item) => fs.lstatSync(path.join(pathFolder, item)).isDirectory());
      const files = items.filter((item) => fs.lstatSync(path.join(pathFolder, item)).isFile());

      await Promise.all(files.map(async (file) => {
        const filepath = path.join(pathFolder, file);
        const content = await fs.promises.readFile(filepath);
        const { size } = fs.statSync(filepath);
        const type = path.extname(filepath);


        const createFile = new File({
          folderId: folder.id,
          userId,
          displayName: file,
          id: null,
          fileName: file,
        });

        createFile.setPath(`${folder.path}`);
        createFile.setSize(size);
        createFile.setType(type as string);

        await s3.send(new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: `${folder.path}/${file}`,
          Body: content,
          ContentType: file,
        }));

        await this.filesRepository.create(createFile);
        this.calcSizeFoldersUseCase.execute(folder.id);
      }));

      await Promise.all(folders.map(async (subFolder) => {
        const subFolderName = path.basename(subFolder);
        await this.uploadFoldersAndFiles(subFolderName, userId, folder.id);
      }));
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error the execute update folder:', error);
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
