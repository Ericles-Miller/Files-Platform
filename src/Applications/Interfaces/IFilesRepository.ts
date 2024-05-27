import { Files } from "@prisma/client";
import { IBaseRepository } from "./shared/IBaseRepository";

export interface IFilesRepository extends IBaseRepository<Files> {
  findPathWitSameName(path: string, userId: string): Promise<Files| null>;
  filesBelongingUser(userId: string, id: string): Promise<Files|null>;
  findFilesChildren(userId: string, id: string): Promise<Files[]>;
  searchFilesByName(displayName: string, userId: string, parentId: string) : Promise<Files[]>
}