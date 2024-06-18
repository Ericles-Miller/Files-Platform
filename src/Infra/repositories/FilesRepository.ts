import { inject, injectable } from 'inversify';

import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { prisma } from '@Infra/Database/database';
import { IFindFilesDTO } from '@Infra/DTOs/Files/IFindFilesDTO';
import { ISearchFileDTO } from '@Infra/DTOs/Files/ISearchFilesDTO';
import { Files, PrismaClient } from '@prisma/client';

import { BaseRepository } from './shared/BaseRepository';


@injectable()
export class FilesRepository extends BaseRepository<Files> implements IFilesRepository {
  constructor(
    @inject('PrismaClient')
      prisma: PrismaClient,
  ) {
    super(prisma.files);
  }

  async findPathWitSameName(folderPath: string, userId: string): Promise<Files | null> {
    const path = await prisma.files.findFirst({ where: { folderPath, userId } });
    return path;
  }

  async filesBelongingUser(userId: string, folderId: string): Promise<Files | null> {
    const file = await prisma.files.findFirst({ where: { userId, folderId } });
    return file;
  }

  async findFilesChildren({ id, userId }: IFindFilesDTO): Promise<Files[]> {
    const files = await prisma.files.findMany({ where: { userId, folderId: id } });
    return files;
  }

  async searchFilesByName(
    { displayName, userId, parentId }: ISearchFileDTO,
  ) : Promise<Files[]> {
    if (!parentId) {
      const files: Files[] = await prisma.$queryRaw`
        SELECT * FROM public.files
            WHERE 'displayName' ILIKE '%' || ${displayName} || '%'
            and 'userId' like ${userId};
        `;
      return files;
    }
    const files: Files[] = await prisma.$queryRaw`
      SELECT * FROM public.files
        WHERE 'displayName' ILIKE '%' || ${displayName} || '%'
        and 'userId' like ${userId}
        and 'folderId' like ${parentId};
    `;
    return files;
  }
}
