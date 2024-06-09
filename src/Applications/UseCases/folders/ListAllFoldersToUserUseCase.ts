import { IFoldersRepository } from "@Applications/Interfaces/repositories/IFoldersRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { Folders } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export class ListAllFoldersToUserUseCase {
  constructor (
    @inject("FoldersRepository")
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute(userId: string) : Promise<Folders[]> {
    try {
      if(!userId) {
        throw new AppError('UserId is required!', 404);
      }
      const folders = await this.foldersRepository.foldersByUsers(userId);
      if(folders.length === 0) { 
        throw new AppError('does not exists folders to user', 404);
      }

      return folders;
    } catch (error) {
      if(error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('Unexpected server error!', 500);
    }
  }

}