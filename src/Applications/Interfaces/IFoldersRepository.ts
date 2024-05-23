import { Folders } from ".prisma/client";
import { IBaseRepository } from "./shared/IBaseRepository";


export interface IFoldersRepository extends IBaseRepository<Folders> {
  checkNameFolderAlreadyExits(name: string): Promise<Folders | null>;
  findFolderPath(folderPath: string): Promise<Folders | null>;
}