import { IUsersRepository } from "@Applications/Interfaces/IUsersRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { container } from "@IoC/index";
import { Folders, Users } from "@prisma/client";
import { inject, injectable } from "inversify";
import { FindFoldersChildrenUseCase } from "./FindFoldersChildrenUseCase";
import { SearchFolderByNameUseCase } from "./SearchFolderByNameUseCase";
import { IRequestSearchFolderDTO } from "@Infra/DTOs/folders/IRequestSearchFolderDTO";
import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { ListFilesChildrenUseCase } from "../files/ListFilesChildrenUseCase";
import { ListFilesByNameUseCase } from "../files/ListFilesByNameUseCase";
import { IResponseSearchFilesFolders } from "@Applications/Interfaces/shared/IResponseSearchFilesFolders";


@injectable()
export class SearchFolderUseCase {
  constructor (
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("FoldersRepository")
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute({ displayName, folderId, userId }: IRequestSearchFolderDTO): Promise<Folders[] | IResponseSearchFilesFolders > {
    const user: Users = await this.usersRepository.findById(userId);
    if(!user) {
      throw new AppError('userId does not exists!', 404);
    } 

    if(!displayName) {
      const findFoldersChildrenUseCase = container.get(FindFoldersChildrenUseCase);
      const listFilesChildrenUseCase = container.get(ListFilesChildrenUseCase);

      if(!folderId) {
        /// mostra a raiz
        const folders = await findFoldersChildrenUseCase.execute({userId, id: folderId});
        return folders;
      }  
      
      const folder: Folders = await this.foldersRepository.findById(folderId);
      if(!folder.id) {
        throw new AppError('folderId does not exists!', 404);
      }
      /// se o folderId e userId sao verdadeiros mostra as filhas dessa pasta e os arquivos
      const folders = await findFoldersChildrenUseCase.execute({userId, id: folderId});
      const files = await listFilesChildrenUseCase.execute(userId, folderId);
      
      return { files, folders };
     
    } else {
      const searchFolderByNameUseCase = container.get(SearchFolderByNameUseCase);
      const listFilesByNameUseCase = container.get(ListFilesByNameUseCase);

      if(displayName && !folderId) {
        /// se o display name for verdadeiro e folderid falso -- busco files e pastas na raiz
        const folders = await searchFolderByNameUseCase.execute({displayName,userId});
        
        return folders;
      }
      
      /// se todos foram verdadeiros mostro a busca do nome em determinada pasta ou file
      const files = await listFilesByNameUseCase.execute(displayName, userId, folderId);
      const folders = await searchFolderByNameUseCase.execute({ displayName,userId, parentId: folderId });
      return { folders, files };
    }
  }
}