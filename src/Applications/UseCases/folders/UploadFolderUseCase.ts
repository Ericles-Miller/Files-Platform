import { unzip } from '@Applications/Services/unzip';
import { inject, injectable } from 'inversify';
import { CreateFolderUseCase } from './CreateFolderUseCase';
import path from 'path';
import fs from 'fs';
import { File } from '@Domain/Entities/File';
import { s3 } from '@Applications/Services/awsS3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { AppError } from '@Domain/Exceptions/AppError';
import { Folders } from '@prisma/client';
import { CalcSizeFoldersUseCase } from './CalcSizeFoldersUseCase';

@injectable()
export class UploadFolderUseCase {
  constructor(
    @inject(CalcSizeFoldersUseCase)
    private calcSizeFoldersUseCase : CalcSizeFoldersUseCase,
    @inject(CreateFolderUseCase)
    private createFolderUseCase: CreateFolderUseCase,
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) {}

  async execute(displayName: string, userId: string, parentId?: string): Promise<void> {
    try {
      await unzip(displayName);
      // deletar o arquivo zip
      const [nameFolder, ] = displayName.split('.');

      await this.uploadFoldersAndFiles(nameFolder, userId, parentId);
      // deletar a pasta 
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
      if (parentId) {
        folder = await this.createFolderUseCase.execute({ displayName, parentId, userId });
      } else {
        folder = await this.createFolderUseCase.execute({ displayName, userId, parentId: null });
      }

      const rootPath = '/root';
      let pathFolder = folder.path.replace(rootPath, '');
      pathFolder = path.join(__dirname, `../../../../tmp/unzipFolders/${pathFolder}`);
      
      const items = fs.readdirSync(pathFolder);

      const folders = items.filter(item => fs.lstatSync(path.join(pathFolder, item)).isDirectory());
      const files = items.filter(item => fs.lstatSync(path.join(pathFolder, item)).isFile());

      for (const file of files) {
        const filepath = path.join(pathFolder, file);
        const content = await fs.promises.readFile(filepath); // path folder + name
        const { size } = fs.statSync(filepath);

        const array = file.split('.');
        let type = array.pop();

        const createFile = new File({
          folderId: folder.id,
          userId,
          displayName: file,
          id: null,
          fileName: file
        });

        createFile.setPath(`${folder.path}/${file}`);
        createFile.setSize(size);
        createFile.setType(type as string);

        await s3.send(new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: `${folder.path}/${file}`,  
          Body: content,
          ContentType: `application/${type}`, //
        }));

        await this.filesRepository.create(createFile);
        this.calcSizeFoldersUseCase.execute(folder.id);
      }

      for (const subFolder of folders) {
        const subFolderName = path.basename(subFolder);
        await this.uploadFoldersAndFiles(subFolderName, userId, folder.id);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error the execute update folder:', error);
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
