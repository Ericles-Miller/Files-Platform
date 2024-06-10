import { Folders } from ".prisma/client";
import { IBaseRepository } from "./shared/IBaseRepository";
import { ISearchFoldersDTO } from "@Infra/DTOs/folders/ISearchFoldersDTO";

export interface IFoldersRepository extends IBaseRepository<Folders> {
  checkNameFolderAlreadyExits(name: string): Promise<Folders | null>;
  findFoldersChildren(parentId: string, userId: string): Promise<Folders[]>;
  findFolderPath(folderPath: string, userId: string): Promise<Folders | null>;
  folderBelongingUser(userId: string, id: string) : Promise<Folders | null>;
  foldersByUsers(userId: string) : Promise<Folders[]>;
  listFoldersWithoutParent(userId: string) : Promise<Folders[]>;
  searchFolderByName({ displayName, userId, parentId }:ISearchFoldersDTO): Promise<Folders[]>
}