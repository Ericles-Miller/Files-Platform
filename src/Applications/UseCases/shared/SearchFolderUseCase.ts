import { inject, injectable } from 'inversify';

import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { IResponseSearchFilesFolders } from '@Applications/Interfaces/repositories/shared/IResponseSearchFilesFolders';
import { AppError } from '@Domain/Exceptions/AppError';
import { IRequestSearchFolderDTO } from '@Infra/DTOs/folders/IRequestSearchFolderDTO';
import { container } from '@IoC/index';
import { Folders, Users } from '@prisma/client';

import { FindFilesChildrenUseCase } from '../files/FindFilesChildrenUseCase';
import { SearchFilesByNameUseCase } from '../files/SearchFilesByNameUseCase';
import { FindFoldersChildrenUseCase } from '../folders/FindFoldersChildrenUseCase';
import { SearchFolderByNameUseCase } from '../folders/SearchFolderByNameUseCase';


@injectable()
export class SearchFolderUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute({ displayName, folderId, userId }: IRequestSearchFolderDTO): Promise<Folders[] | IResponseSearchFilesFolders > {
    try {
      const user: Users = await this.usersRepository.findById(userId);
      if (!user) {
        throw new AppError('UserId does not exists!', 404);
      }

      if (!displayName) {
        const findFoldersChildrenUseCase = container.get(FindFoldersChildrenUseCase);
        const findFilesChildrenUseCase = container.get(FindFilesChildrenUseCase);

        if (!folderId) {
          /// mostra a raiz
          const folders = await findFoldersChildrenUseCase.execute({ userId, id: folderId });
          return folders;
        }

        const folder: Folders = await this.foldersRepository.findById(folderId);
        if (!folder.id) {
          throw new AppError('FolderId does not exists!', 404);
        }
        /// se o folderId e userId sao verdadeiros mostra as filhas dessa pasta e os arquivos
        const folders = await findFoldersChildrenUseCase.execute({ userId, id: folderId });
        const files = await findFilesChildrenUseCase.execute({ userId, id: folderId });
        return { files, folders };
      }
      const searchFolderByNameUseCase = container.get(SearchFolderByNameUseCase);
      const searchFilesByNameUseCase = container.get(SearchFilesByNameUseCase);

      if (displayName && !folderId) {
        /// se o display name for verdadeiro e folderid falso -- busco files e pastas na raiz
        const folders = await searchFolderByNameUseCase.execute({ displayName, userId });
        const files = await searchFilesByNameUseCase.execute({ displayName, userId, parentId: folderId });

        return { folders, files };
      }

      /// se todos foram verdadeiros mostro a busca do nome em determinada pasta ou file
      const files = await searchFilesByNameUseCase.execute({ displayName, userId, parentId: folderId });
      const folders = await searchFolderByNameUseCase.execute({ displayName, userId, parentId: folderId });
      return { folders, files };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
