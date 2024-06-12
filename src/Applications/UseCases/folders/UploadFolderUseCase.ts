import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { unzip } from '@Applications/Services/unzip';
import { inject, injectable } from 'inversify';
import { CreateFolderUseCase } from './CreateFolderUseCase';
import path from 'path';
import fs from 'fs';
import { CreateFilesUseCase } from '../files/CreateFilesUseCase';
import { File } from '@Domain/Entities/File';
import { v4 as uuid } from 'uuid';
import { s3 } from '@Applications/Services/awsS3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { Folders } from '@prisma/client';


@injectable()
export class UploadFolderUseCase {
  constructor(
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
    @inject(CreateFolderUseCase)
    private createFolderUseCase: CreateFolderUseCase,
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) {}

  async execute(displayName: string, userId: string, parentId?: string): Promise<void> {
    unzip(displayName);
    const [nameFolder, ] = displayName.split('.');

    await this.uploadFoldersAndFiles(nameFolder, userId, parentId);
  }

  private async uploadFoldersAndFiles(displayName: string,  userId: string,  parentId?: string) : Promise<void> {
    const folderId = uuid()
    parentId ?  this.createFolderUseCase.execute({displayName, parentId, userId}) :
    this.createFolderUseCase.execute({ displayName, parentId: folderId, userId });

    const folderPath = path.join(__dirname, `../../../../tmp/unzipFolders/${displayName}`)
    const items = fs.readdirSync(folderPath);
    
    const folders = items.filter(item => fs.lstatSync(path.join(folderPath, item)).isDirectory());
    const files = items.filter(item => fs.lstatSync(path.join(folderPath, item)).isFile()); 

    // find folder by name
    const folder: Folders = await this.foldersRepository.findById(folderId);

    for(const file of files) {
      const filepath = path.join(folderPath, file);
      const content = await fs.promises.readFile(filepath);
      const size = fs.statSync(filepath).size;
      
      const array = file.split('.');
      let displayNameFile;
      let type;
      if(array) {
        displayNameFile = array.slice(0,-1);
        displayNameFile  = displayNameFile.toString();
        type = array.pop();
      }

      const createFile = new File({ 
        folderId, userId, displayName: displayNameFile as string, id: null, fileName: displayNameFile as string
      })

      createFile.setPath(`folderPath/${displayNameFile}`);
      createFile.setSize(size);
      createFile.setType(type as string);
      
      await s3.send(new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: displayNameFile,
        Body:content,
        ContentType: `application/${type}`,
      }));

      await this.filesRepository.create(createFile);
    }

    for(const index of folders) {
      await this.execute(index, userId, folder.id)
    }
  } 
}