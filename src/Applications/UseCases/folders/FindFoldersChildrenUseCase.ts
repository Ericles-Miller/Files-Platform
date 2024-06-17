import { inject, injectable } from 'inversify';

import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { AppError } from '@Domain/Exceptions/AppError';
import { IFindFoldersDTO } from '@Infra/DTOs/folders/IFindFoldersDTO';
import { Folders } from '@prisma/client';

@injectable()
export class FindFoldersChildrenUseCase {
  constructor(
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute({ userId, id }: IFindFoldersDTO): Promise<Folders[]> {
    if (id) {
      const folderBelongingUser = await this.foldersRepository.folderBelongingUser(userId, id);
      if (!folderBelongingUser) {
        throw new AppError('That folder does not belong this user or userId is incorrect!', 400);
      }

      const folders = await this.foldersRepository.findFoldersChildren(id, userId);
      return folders;
    }

    const folders = await this.foldersRepository.listFoldersWithoutParent(userId);
    return folders;
  }
}
