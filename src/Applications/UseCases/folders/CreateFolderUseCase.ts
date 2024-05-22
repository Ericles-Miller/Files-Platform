import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { Folder } from "@Domain/Entities/Folder";
import { AppError } from "@Domain/Exceptions/AppError";
import { IRequestFoldersDTO } from "@Infra/DTOs/folders/IRequestFoldersDTO";
import { Folders } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export class CreateFolderUseCase {
  constructor (
    @inject("FoldersRepository")
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute({ displayName, parentId, userId }: IRequestFoldersDTO) : Promise<void> {
    const FindFolder = await this.foldersRepository.checkNameFolderAlreadyExits(displayName);
    // consertar excecao depois 
    if(FindFolder) {
      throw new AppError('Name of folder already exists!', 400);
    }
    const folder = new Folder({displayName, id: null, parentId, userId });    
    
    if(parentId) {
      folder.setParentFolder(parentId);
      await this.foldersRepository.create(folder);

      // buscar a pasta pai para atualizar o campo children com o id de folder
      const parentFolder  = await this.foldersRepository.findById(parentId);
      if (!parentFolder) {
        throw new AppError('Parent folder not found!', 404);
      }

      


    }


    await this.foldersRepository.create(folder);
  }
}