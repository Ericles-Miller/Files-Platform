import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { ISearchFoldersDTO } from "@Infra/DTOs/folders/ISearchFoldersDTO";
import { Folders } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export class SearchFolderByNameUseCase {
  constructor (
    @inject("FoldersRepository")
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute({displayName, userId, parentId}: ISearchFoldersDTO): Promise<Folders[]> {    
    if(!parentId) {
      const folders = await this.foldersRepository.searchFolderByName({displayName, userId});
      return folders;
    }

    const folder: Folders = await this.foldersRepository.findById(parentId);
    if(!folder.id) {
      throw new AppError('folderId does not exists!', 404);
    }
    
    const folders = await this.foldersRepository.searchFolderByName({displayName, userId, parentId});
    return folders;
  }
}

