import { inject, injectable } from 'inversify';

import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { IResponseSearchFilesFolders } from '@Applications/Interfaces/repositories/shared/IResponseSearchFilesFolders';
import { AppError } from '@Domain/Exceptions/AppError';
import { IRequestSearchFolderDTO } from '@Infra/DTOs/folders/IRequestSearchFolderDTO';
import { Folders } from '@prisma/client';

import { FindFilesChildrenUseCase } from '../files/FindFilesChildrenUseCase';
import { SearchFilesByNameUseCase } from '../files/SearchFilesByNameUseCase';
import { FindFoldersChildrenUseCase } from '../folders/FindFoldersChildrenUseCase';
import { SearchFolderByNameUseCase } from '../folders/SearchFolderByNameUseCase';


@injectable()
export class SearchFolderUseCase {
  constructor(
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
    @inject(FindFilesChildrenUseCase)
    private findFilesChildrenUseCase: FindFilesChildrenUseCase,
    @inject(FindFoldersChildrenUseCase)
    private findFoldersChildrenUseCase: FindFoldersChildrenUseCase,
    @inject(SearchFolderByNameUseCase)
    private searchFolderByNameUseCase: SearchFolderByNameUseCase,
    @inject(SearchFilesByNameUseCase)
    private searchFilesByNameUseCase: SearchFilesByNameUseCase,
  ) {}

  async execute({ displayName, folderId, userId }: IRequestSearchFolderDTO): Promise<Folders[] | IResponseSearchFilesFolders > {
    try {
      if (!displayName && !folderId) {
        const folders = await this.foldersRepository.listFoldersWithoutParent(userId);
        return folders;
      }

      if (!displayName && folderId) {
        const folder: Folders = await this.foldersRepository.findById(folderId);
        if (!folder.id) {
          throw new AppError('FolderId does not exists!', 404);
        }
        const folders = await this.findFoldersChildrenUseCase.execute({ userId, id: folderId });
        const files = await this.findFilesChildrenUseCase.execute({ userId, id: folderId });
        return { files, folders };
      }

      if (displayName && folderId) {
        const files = await this.searchFilesByNameUseCase.execute({ displayName, userId, parentId: folderId });
        const folders = await this.searchFolderByNameUseCase.execute({ displayName, userId, parentId: folderId });
        return { folders, files };
      }

      if (displayName && !folderId) {
        const folders = await this.searchFolderByNameUseCase.execute({ displayName, userId });
        const files = await this.searchFilesByNameUseCase.execute({ displayName, userId, parentId: folderId });

        return { folders, files };
      }

      return { folders: [], files: [] };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
