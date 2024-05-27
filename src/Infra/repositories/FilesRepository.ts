import { Files, Folders, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./shared/BaseRepository";
import { IFilesRepository } from "@Applications/Interfaces/IFilesRepository";
import { inject, injectable } from "inversify";
import { prisma } from "@Infra/Database/database";


@injectable()
export class FilesRepository extends BaseRepository<Files> implements IFilesRepository {
  constructor(
    @inject('PrismaClient')
    prisma: PrismaClient,
  ) { 
    super(prisma.files) 
  }

  async findPathWitSameName(folderPath: string, userId: string): Promise<Files | null> {
    const path = await prisma.files.findFirst({where: { folderPath, userId }});
    return path; 
  }

  async filesBelongingUser(userId: string, id: string): Promise<Files|null>{
    const file = await prisma.files.findFirst({where: { userId, id }});
    return file;
  }

  async findFilesChildren(userId: string, id: string): Promise<Files[]> {
    const files = await prisma.files.findMany({ where: { userId, folderId: id }});
    return files;
  }

  async searchFilesByName(
    displayName: string, userId: string, parentId: string
  ) : Promise<Files[]> {
    const files: Files[] = await prisma.$queryRaw`
      SELECT * FROM "files"
      WHERE "displayName" ILIKE ${displayName}
      AND "folderId" = ${parentId}
      AND "userId" = ${userId}
    `;
    return files;
  }
  

}