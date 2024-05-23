import { Folders } from ".prisma/client";
import { IBaseRepository } from "./shared/IBaseRepository";

export interface IFoldersRepository extends IBaseRepository<Folders> {
  checkNameFolderAlreadyExits(name: string): Promise<Folders | null>;
  findFolderPath(folderPath: string, userId: string): Promise<Folders | null>;
  folderBelongingUser(userId: string, id: string) : Promise<Folders | null>;
  foldersByUsers(userId: string) : Promise<Folders[]>;
  findFoldersChildren(parentId: string, userId: string): Promise<Folders[]>;
  listFoldersWithoutParent(userId: string) : Promise<Folders[]>;
}