import { inject, injectable } from 'inversify';

import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { ISharedItemsRepository } from '@Applications/Interfaces/repositories/ISharedItemsRepository';
import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { SharedItems } from '@Domain/Entities/SharedItems';
import { AppError } from '@Domain/Exceptions/AppError';
import { ISharedFilesFoldersDTO } from '@Infra/DTOs/sharedItems/ISharedFilesFoldersDTO';
import { Users } from '@prisma/client';


@injectable()
export class SharedItemsBetweenUsersUseCase {
  constructor(
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('SharedItemsRepository')
    private sharedItemsRepository: ISharedItemsRepository,
  ) {}

  async execute({
    sharedWithUserId, userId, fileId, folderId,
  }: ISharedFilesFoldersDTO): Promise<void> {
    try {
      const findUser: Users = await this.usersRepository.findById(sharedWithUserId);
      if (!findUser) {
        throw new AppError('UserId to shared file or folder does not exists!', 404);
      }

      if (fileId && folderId) {
        throw new AppError('Some of properties should be true!', 400);
      }

      if (!fileId && !folderId) {
        throw new AppError('Some of properties should be true!', 400);
      }

      if (folderId) {
        const folderBelongUser = await this.foldersRepository.folderBelongingUser(userId, folderId);
        if (!folderBelongUser) {
          throw new AppError('Folder does not belong to user!', 404);
        }

        const alreadySharedFolder = await this.sharedItemsRepository.alreadySharedFolder(folderId, sharedWithUserId);
        if (alreadySharedFolder) {
          throw new AppError('The folder has already been shared with the user!', 400);
        }

        const sharedItems = new SharedItems(null, userId, sharedWithUserId);
        sharedItems.setFolderId(folderId);
        await this.sharedItemsRepository.create(sharedItems);
      }

      if (fileId) {
        const fileBelongUser = await this.filesRepository.filesBelongingUser(userId, fileId);
        if (!fileBelongUser) {
          throw new AppError('File does not belong to user!', 404);
        }

        const alreadySharedFile = await this.sharedItemsRepository.alreadySharedFile(fileId, sharedWithUserId);
        if (alreadySharedFile) {
          throw new AppError('The file has already been shared with the user!', 400);
        }

        const sharedItems = new SharedItems(null, userId, sharedWithUserId);
        sharedItems.setFileId(fileId);
        await this.sharedItemsRepository.create(sharedItems);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
