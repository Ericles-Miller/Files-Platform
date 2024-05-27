import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { IUsersRepository } from "@Applications/Interfaces/IUsersRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { IDeleteFolderDTO } from "@Infra/DTOs/folders/IDeleteFolderDTO";
import { inject, injectable } from "inversify";


@injectable()
export class DeleteFolderUseCase {
  constructor (
    @inject("FoldersRepository")
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute({ userId, folderId }:IDeleteFolderDTO): Promise<void> {
    const folderBelongingUser = await this.foldersRepository.folderBelongingUser(userId, folderId);
    if(!folderBelongingUser) {
      throw new AppError('that folder does not belong this user or userId is incorrect', 400);
    }
    
    await this.foldersRepository.delete(folderId);
  }
}