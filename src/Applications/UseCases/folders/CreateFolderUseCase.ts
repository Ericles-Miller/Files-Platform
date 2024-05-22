import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { Children } from "@Domain/Entities/Children";
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
    const folder = new Folder({displayName, id: null, parentId, userId });    
    
    if(parentId) {
      folder.setParentFolder(parentId);
      folder.setSize(10); // mudar
      folder.setPath('teste') // mudar 
      
      await this.foldersRepository.create(folder);

      // buscar a pasta pai para atualizar o campo children com o id de folder
      const parentFolder: Folders  = await this.foldersRepository.findById(parentId);
      if (!parentFolder) {
        throw new AppError('Parent folder not found!', 404);
      }

      const children = new Children(parentFolder.id, null);
      

    } else {
      folder.setSize(10); // mudar
      folder.setPath('teste') // mudar 
      await this.foldersRepository.create(folder);
    }


  }
}