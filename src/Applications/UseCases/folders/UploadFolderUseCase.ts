import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { unzip } from '@Applications/Services/unzip';
import { inject, injectable } from 'inversify';
import { CreateFolderUseCase } from './CreateFolderUseCase';
import path from 'path';
import fs from 'fs';

@injectable()
export class UploadFolderUseCase {
  constructor(
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject(CreateFolderUseCase)
    private createFolderUseCase: CreateFolderUseCase
  ) {}

  async execute(displayName: string,  userId: string,  parentId?: string) : Promise<void> {
    // parentId ?  this.createFolderUseCase.execute({displayName, parentId, userId}) :
    // this.createFolderUseCase.execute({ displayName, parentId: null, userId });

    unzip(displayName);
    const [nameFolder, ] = displayName.split('.');
    
    const folderPath = path.join(__dirname, `../../../../tmp/unzipFolders/${nameFolder}`)
    const items = fs.readdirSync(folderPath);
    
    const folders = items.filter(item => fs.lstatSync(path.join(folderPath, item)).isDirectory());
    const files = items.filter(item => fs.lstatSync(path.join(folderPath, item)).isFile()); 


  }
}