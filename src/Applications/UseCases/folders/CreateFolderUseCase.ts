import { inject, injectable } from 'inversify';

import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { Folder } from '@Domain/Entities/Folder';
import { AppError } from '@Domain/Exceptions/AppError';
import { IRequestFoldersDTO } from '@Infra/DTOs/folders/IRequestFoldersDTO';
import { Folders } from '@prisma/client';

@injectable()
export class CreateFolderUseCase {
  constructor(
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute({ displayName, parentId, userId }: IRequestFoldersDTO) : Promise<Folders> {
    try {
      const folder = new Folder({ displayName, id: null, userId });

      if (parentId) {
        const folderBelongingUser = await this.foldersRepository.folderBelongingUser(userId, parentId);
        if (!folderBelongingUser) {
          throw new AppError('That folder does not belong this user or userId is incorrect!', 400);
        }

        const parentFolder: Folders = await this.foldersRepository.findById(parentId);
        if (!parentFolder) {
          throw new AppError('Parent folder not found!', 404);
        }

        const folderPath = await this.foldersRepository.findFolderPath(`${parentFolder.path}/${displayName}`, userId);
        if (folderPath) {
          throw new AppError('The folder name already exists in dir. Please choose another name!', 400);
        }

        folder.setParentFolder(parentId);
        folder.setPath(`${parentFolder.path}/${displayName}`);
        folder.setSize(0);

        const newFolder : Folders = await this.foldersRepository.create(folder);
        return newFolder;
      }
      const folderPath = await this.foldersRepository.findFolderPath(`/root/${userId}/${displayName}`, userId);
      if (folderPath) {
        throw new AppError('The folder name already exists in dir. Please choose another name!', 400);
      }

      folder.setParentFolder(null);
      folder.setPath(`/root/${userId}/${displayName}`);
      folder.setSize(0);

      const newFolder = await this.foldersRepository.create(folder);
      return newFolder;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError(`Unexpected server error!`, 500);
    }
  }
}
