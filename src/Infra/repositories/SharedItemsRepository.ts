import { inject, injectable } from 'inversify';

import { ISharedItemsRepository } from '@Applications/Interfaces/repositories/ISharedItemsRepository';
import { prisma } from '@Infra/Database/database';
import { PrismaClient, SharedItems } from '@prisma/client';

import { BaseRepository } from './shared/BaseRepository';

@injectable()
export class SharedItemsRepository extends BaseRepository<SharedItems> implements ISharedItemsRepository {
  constructor(
    @inject('PrismaClient')
      prisma: PrismaClient,
  ) { super(prisma.sharedItems); }


  async alreadySharedFolder(folderId: string, sharedWithUserId: string): Promise<SharedItems | null> {
    const sharedFolder = await prisma.sharedItems.findFirst({ where: { folderId, sharedWithUserId } });
    return sharedFolder;
  }
  async alreadySharedFile(fileId: string, sharedWithUserId: string): Promise<SharedItems | null> {
    const sharedFile = await prisma.sharedItems.findFirst({ where: { fileId, sharedWithUserId } });
    return sharedFile;
  }

  async findBySharedUserId(sharedWithUserId: string): Promise<SharedItems[]> {
    const sharedItems = await prisma.sharedItems.findMany({ where: { sharedWithUserId } });
    return sharedItems;
  }
}
