import { IFoldersRepository } from '@Applications/Interfaces/IFoldersRepository';
import { Folder } from '@Domain/Entities/Folder';
import { AppError } from '@Domain/Exceptions/AppError';
import { IUpdateFolderDTO } from '@Infra/DTOs/folders/IUpdateFoldersDTO';
import { Folders } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { CalcSizeFoldersUseCase } from './CalcSizeFoldersUseCase';

@injectable()
export class UpdateFolderUseCase {
  constructor (
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
    @inject(CalcSizeFoldersUseCase)
    private calcSizeFoldersUseCase : CalcSizeFoldersUseCase,
  ) {}

  async execute({ displayName, id, userId, parentId }: IUpdateFolderDTO): Promise<void> {
    try {
      const folderBelongingUser = await this.foldersRepository.folderBelongingUser(userId, id);
    if(!folderBelongingUser) {
      throw new AppError('That folder does not belong this user or userId is incorrect', 400);
    }

    const findFolder: Folders = await this.foldersRepository.findById(id);
    if(!findFolder) {
      throw new AppError('FolderId does not exists!', 404);
    }

    if(parentId) {
      const folderBelongingUser = await this.foldersRepository.folderBelongingUser(userId, parentId);
      if(!folderBelongingUser) {
        throw new AppError('That folder does not belong this user or userId is incorrect!', 400);
      }
      
      const folderParent: Folders = await this.foldersRepository.findById(parentId);
      if(!folderParent) {
        throw new AppError('FolderId does not exists!', 404);
      }
    
      const folderPath = await this.foldersRepository.findFolderPath(`${folderParent.path}/${displayName}`, userId);
      if(folderPath) {
        throw new AppError('The folder name already exists in dir. Please choose another name!', 400);
      }
      
      const folder = new Folder({id, displayName, userId });
      
      folder.setParentFolder(parentId);
      folder.setPath(`${folderParent.path}/${displayName}`);
      folder.setSize(findFolder.size);
      folder.setUpdatedAt(new Date());

      await this.foldersRepository.update(id, folder);
      this.calcSizeFoldersUseCase.execute(parentId);

    } else {
      const folderPath = await this.foldersRepository.findFolderPath(`root/${displayName}`, userId);
      if(folderPath) {
        throw new AppError('The folder name already exists in dir. Please choose another name!', 400);
      }

      const folder = new Folder({id, displayName, userId });
      
      folder.setParentFolder(null);
      folder.setPath(`root/${displayName}`);
      folder.setSize(findFolder.size);
      folder.setUpdatedAt(new Date());

      await this.foldersRepository.update(id, folder);
    }
    } catch (error) {
      if(error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('Unexpected server error!', 500);      
    }
  }
}