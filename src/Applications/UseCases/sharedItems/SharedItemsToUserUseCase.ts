import { inject, injectable } from 'inversify';

import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { ISharedItemsRepository } from '@Applications/Interfaces/repositories/ISharedItemsRepository';
import { AppError } from '@Domain/Exceptions/AppError';
import { ISharedWithUserDTO } from '@Infra/DTOs/sharedItems/ISharedWithUserDTO';

import { FindFilesChildrenUseCase } from '../files/FindFilesChildrenUseCase';


@injectable()
export class SharedItemsToUserUseCase {
  constructor(
    @inject('SharedItemsRepository')
    private sharedItemsRepository: ISharedItemsRepository,
    @inject(FindFilesChildrenUseCase)
    private findFilesChildrenUseCase : FindFilesChildrenUseCase,
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute(sharedWithUserId: string): Promise<ISharedWithUserDTO> {
    try {
      const responseItems: ISharedWithUserDTO = { files: [], folders: [] };

      const sharedItems = await this.sharedItemsRepository.findBySharedUserId(sharedWithUserId);
      if (!sharedItems) {
        throw new AppError('The sharedWithUserId does not exists!', 404);
      }

      await Promise.all(sharedItems.map(async (item) => {
        if (item.sharedStatus) {
          if (item.folderId) {
            const folder = await this.foldersRepository.findFoldersShared(item.folderId, item.userId);
            if (folder) {
              responseItems.folders.push(folder);
            }
            responseItems.files = await this.findFilesChildrenUseCase.execute({ id: item.folderId, userId: item.userId });
          }
        }
      }));

      return responseItems;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
