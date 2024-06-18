import { IFindFilesDTO } from '@Infra/DTOs/Files/IFindFilesDTO';
import { ISearchFileDTO } from '@Infra/DTOs/Files/ISearchFilesDTO';
import { Files } from '@prisma/client';

import { IBaseRepository } from './shared/IBaseRepository';

export interface IFilesRepository extends IBaseRepository<Files> {
  findPathWitSameName(path: string, userId: string): Promise<Files| null>;
  filesBelongingUser(userId: string, folderId: string): Promise<Files|null>;
  findFilesChildren({ id, userId }: IFindFilesDTO): Promise<Files[]>;
  searchFilesByName({ displayName, userId, parentId }: ISearchFileDTO) : Promise<Files[]>
}
