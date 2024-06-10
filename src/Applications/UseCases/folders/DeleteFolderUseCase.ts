import { AppError } from '@Domain/Exceptions/AppError';
import { IDeleteFolderDTO } from '@Infra/DTOs/folders/IDeleteFolderDTO';
import { inject, injectable } from 'inversify';
import { CalcSizeFoldersUseCase } from './CalcSizeFoldersUseCase';
import { Folders } from '@prisma/client';
import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';


@injectable()
export class DeleteFolderUseCase {
  constructor (
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
    @inject(CalcSizeFoldersUseCase)
    private calcSizeFoldersUseCase : CalcSizeFoldersUseCase,
  ) {}

  async execute({ userId, folderId }:IDeleteFolderDTO): Promise<void> {
    try {     
      const folderBelongingUser = await this.foldersRepository.folderBelongingUser(userId, folderId);
      if(!folderBelongingUser) {
        throw new AppError('That folder does not belong this user or userId is incorrect!', 400);
      }
      
      await this.foldersRepository.delete(folderId);
      if(folderBelongingUser.parentId) {
        const parentFolder: Folders = await this.foldersRepository.findById(folderBelongingUser.parentId);
        this.calcSizeFoldersUseCase.execute(parentFolder.id);
      }
    } catch (error) {
      if(error instanceof AppError) {
        throw error
      }
      console.log(error);
      throw new AppError(`Unexpected server error!`, 500);
    }
  }
}