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

  async execute(id: string, userId: string, option: boolean): Promise<void> {
    const sharedItem: SharedItems = await this.sharedItemsRepository.findById(id);
    if (sharedItem && sharedItem.userId !== userId) {
      throw new AppError('Some of properties is incorrect. Check id the sharedWithUserId or userId', 404);
    }
    sharedItem.sharedStatus = option;

    await this.sharedItemsRepository.update(id, sharedItem);
  }
}
