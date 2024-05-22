import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { Folder } from "@Domain/Entities/Folder";
import { AppError } from "@Domain/Exceptions/AppError";
import { IRequestFoldersDTO } from "@Infra/DTOs/folders/IRequestFoldersDTO";
import { inject, injectable } from "inversify";

@injectable()
export class CreateFolderUseCase {
  constructor (
    @inject("FoldersRepository")
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute({ children, displayName, parentId, size, userId }: IRequestFoldersDTO) : Promise<void> {
    const FindFolder = await this.foldersRepository.checkNameFolderAlreadyExits(displayName);
    if(FindFolder) {
      throw new AppError('Name of folder already exists!', 400);
    }

    const folder = new Folder({children, displayName, id: null, parentId, size, userId });    
    await this.foldersRepository.create(folder);
  }
}