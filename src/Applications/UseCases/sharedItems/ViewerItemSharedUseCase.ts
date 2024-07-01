import { inject, injectable } from 'inversify';

import { IListFiles } from '@Applications/Interfaces/files/IListFiles';
import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { ISharedItemsRepository } from '@Applications/Interfaces/repositories/ISharedItemsRepository';
import { AppError } from '@Domain/Exceptions/AppError';
import { Files, SharedItems } from '@prisma/client';

import { FindFilesChildrenUseCase } from '../files/FindFilesChildrenUseCase';

@injectable()
export class ViewerSharedItemsUseCase {
  constructor(
    @inject('SharedItemsRepository')
    private sharedItemsRepository: ISharedItemsRepository,
    @inject(FindFilesChildrenUseCase)
    private findFilesChildrenUseCase : FindFilesChildrenUseCase,
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) {}

  async execute(id: string, sharedWithUserId: string): Promise<IListFiles[]> {
    try {
      const sharedItem: SharedItems = await this.sharedItemsRepository.findById(id);
      if (sharedItem && sharedItem.sharedWithUserId !== sharedWithUserId) {
        throw new AppError('Some of properties is incorrect. Check id the sharedWithUserId or userId', 404);
      }

      if (sharedItem.fileId) {
        const file : Files = await this.filesRepository.findById(sharedItem.fileId);
        const filesToFolder = await this.findFilesChildrenUseCase.execute({ id: file.folderId, userId: sharedItem.userId });

        const findFile = filesToFolder.filter((file) => file.id === sharedItem.fileId);
        return findFile;
      }

      if (sharedItem.folderId) {
        const filesToFolder = await this.findFilesChildrenUseCase.execute({ id: sharedItem.folderId, userId: sharedItem.userId });
        return filesToFolder;
      }

      throw new AppError('FolderId and fileId properties are undefined', 404);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
