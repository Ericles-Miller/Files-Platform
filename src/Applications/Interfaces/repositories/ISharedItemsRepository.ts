import { SharedItems } from '@prisma/client';

import { IBaseRepository } from './shared/IBaseRepository';

export interface ISharedItemsRepository extends IBaseRepository<SharedItems> {
  alreadySharedFolder(folderId: string, sharedWithUserId: string): Promise<SharedItems| null>
  alreadySharedFile(fileId: string, sharedWithUserId: string): Promise<SharedItems| null>
  findBySharedUserId(sharedWithUserId: string): Promise<SharedItems[]>
}
