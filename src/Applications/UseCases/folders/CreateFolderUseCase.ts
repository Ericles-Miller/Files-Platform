import { IChildrenRepository } from "@Applications/Interfaces/IChildrenRepository";
import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { Child } from "@Domain/Entities/Child";
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
    @inject("ChildrenRepository")
    private childrenRepository: IChildrenRepository,
  ) {}

  async execute({ displayName, parentId, userId }: IRequestFoldersDTO) : Promise<void> {    
    const folder = new Folder({displayName, id: null, parentId, userId });    
       
    if(parentId) {
      const parentFolder: Folders  = await this.foldersRepository.findById(parentId);
      if (!parentFolder) {
        throw new AppError('Parent folder not found!', 404);
      }

      folder.setPath(`${parentFolder.path}/${displayName}`);

      const folderPath = await this.foldersRepository.findFolderPath(folder.path);
      if(folderPath) {
        throw new AppError('The folder name already exists in dir. Please choose another name!', 400);
      }

      folder.setSize(0);

      await this.foldersRepository.create(folder);      
      
      const children = new Child(parentFolder.id, null);
      await this.childrenRepository.create(children);

      // chamo o  update folder
    } else {
      folder.setSize(0);
      folder.setPath(`/root/${displayName}`);
     
      const folderPath = await this.foldersRepository.findFolderPath(folder.path);
      if(folderPath) {
        throw new AppError('The folder name already exists in dir. Please choose another name!', 400);
      }

      await this.foldersRepository.create(folder);
    }
  }
}