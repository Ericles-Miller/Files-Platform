import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { IUsersRepository } from "@Applications/Interfaces/IUsersRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { Folders, Users } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export class FindFoldersChildrenUseCase {
  constructor (
    @inject("FoldersRepository")
    private foldersRepository: IFoldersRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute(userId: string, id?: string): Promise<Folders[]> {    
    const user: Users = await this.usersRepository.findById(userId);
    if(!user) {
      throw new AppError('userId does not exists!', 404);
    }

    if(id) {
      const folder: Folders = await this.foldersRepository.findById(id);
      if(!folder.id) {
        throw new AppError('folderId does not exists!', 404);
      } else {
        const folderBelongingUser = await this.foldersRepository.folderBelongingUser(userId, id);
        if(!folderBelongingUser) {
          throw new AppError('that folder does not belong this user or userId is incorrect', 400);
        }

        const folders = await this.foldersRepository.findFoldersChildren(id, userId);
        return folders;
      }
    }
    
    const folders = await this.foldersRepository.listFoldersWithoutParent(userId);
    return folders;
  }
}