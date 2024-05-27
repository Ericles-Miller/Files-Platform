import { Files } from "@prisma/client";
import { IBaseRepository } from "./shared/IBaseRepository";

export interface IFilesRepository extends IBaseRepository<Files> {
  findPathWitSameName(path: string, userId: string): Promise<Files| null>
}