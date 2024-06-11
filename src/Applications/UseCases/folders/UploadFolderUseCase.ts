import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { Folder } from '@Domain/Entities/Folder';
import { AppError } from '@Domain/Exceptions/AppError';
import { Users } from '@prisma/client';
import { inject, injectable } from 'inversify';


@injectable()
export class UploadFolderUseCase {
  constructor(
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(displayName: string,  userId: string,  parentId?: string) : Promise<void> {
    const folderAlreadyExists = await this.foldersRepository.searchFolderByName({ 
      displayName, parentId, userId,
    });

    const userAlreadyExists: Users = await this.usersRepository.findById(userId);
    if(!userAlreadyExists) {
      throw new AppError('User does not exists!', 404);
    }

    if (folderAlreadyExists) { 
      throw new AppError('The displayName folder already exists in dir!', 400);
    }

    const folder = new Folder({ id: null, displayName, userId });
    if(parentId) {
      folder.setParentFolder(parentId);
    }

    const parentFolder = await this.foldersRepository.create(folder);

    /// comeco a ler os arquivos da pasta e salvalos 
  }
}