import { inject, injectable } from 'inversify';

import { ISharedItemsRepository } from '@Applications/Interfaces/repositories/ISharedItemsRepository';
import { AppError } from '@Domain/Exceptions/AppError';
import { SharedItems } from '@prisma/client';

@injectable()

export class UpdateViewSharedItemsUseCase {
  constructor(
    @inject('SharedItemsRepository')
    private sharedItemsRepository: ISharedItemsRepository,
  ) {}

  async execute(id: string, userId: string, status: boolean): Promise<void> {
    try {
      const sharedItem: SharedItems = await this.sharedItemsRepository.findById(id);
      if (!sharedItem) {
        throw new AppError('Does not exists sharedItems with id', 404);
      }

      if (sharedItem.userId !== userId) {
        throw new AppError('Some of properties is incorrect. Check id the sharedWithUserId or userId!', 400);
      }

      sharedItem.sharedStatus = status;
      await this.sharedItemsRepository.update(id, sharedItem);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('Unexpected server error', 500);
    }
  }
}

