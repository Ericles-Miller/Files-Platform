import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { Folder } from '@Domain/Entities/Folder';
import { AppError } from '@Domain/Exceptions/AppError';
import { Folders } from '@prisma/client';
import { inject, injectable } from 'inversify';

@injectable()
export class CalcSizeFoldersUseCase {
  constructor(
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
    @inject('FilesRepository')
    private filesRepository: IFilesRepository
  ) {}

  async execute(id: string): Promise<void> {
    
    const findFolder: Folders = await this.foldersRepository.findById(id);
    if(!findFolder) {
      throw new AppError('id does not exists!', 404);
    }

    const folder = new Folder({
      id: findFolder.id, displayName: findFolder.displayName, userId: findFolder.userId 
    });

    const files = await this.filesRepository.findFilesChildren({ userId: findFolder.userId, id });
    const folders = await this.foldersRepository.findFoldersChildren(id, findFolder.userId);
    
    let sizeFiles = 0;
    let sizeFolders = 0;
    
    if(files.length !== 0) {
      files.map((file) => { sizeFiles += file.size });
    }

    if(folders.length !== 0) {
      folders.map((folder) => { sizeFolders += folder.size });
    }

    folder.setSize(sizeFiles + sizeFolders);
    folder.setUpdatedAt(new Date());
    
    await this.foldersRepository.update(id, folder);

    if(findFolder.parentId) {  
      return this.execute(findFolder.parentId);
    }
  }
}