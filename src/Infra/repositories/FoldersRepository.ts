import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { BaseRepository } from "./shared/BaseRepository";
import { Folders, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { prisma } from "@Infra/Database/database";
import { ISearchFoldersDTO } from "@Infra/DTOs/folders/ISearchFoldersDTO";


@injectable()
export class FoldersRepository extends BaseRepository<Folders> implements IFoldersRepository {
  constructor(
    @inject('PrismaClient')
    prisma: PrismaClient,
  ) { super(prisma.folders) }

  async checkNameFolderAlreadyExits(displayName: string): Promise<Folders | null> {
    const folder = await prisma.folders.findFirst({where : { displayName }});
    return folder;
  }

  async findFolderPath(path: string, userId: string): Promise<Folders|null> {
    const folder = await prisma.folders.findFirst({ where: { path, userId } });
    return folder;
  }


  async folderBelongingUser(userId: string, id: string) : Promise<Folders | null> {
    const folder = await prisma.folders.findFirst({
      where: {id, userId },
    });
    return folder;
  }
  
  async listFoldersWithoutParent(userId: string) : Promise<Folders[]> {
    const folders = await prisma.folders.findMany({ where: { parentId : null, userId }});
    return folders;
  }

  async foldersByUsers(userId: string) : Promise<Folders[]> { /// list all folders to frontEnd
    const folders = await prisma.folders.findMany({where : { userId }});
    return folders;
  }

  async findFoldersChildren(parentId: string, userId: string): Promise<Folders[]> {
    const folders = await prisma.folders.findMany({ where: { parentId, userId }});
    return folders;
  }

  async searchFolderByName({ displayName, userId ,parentId }: ISearchFoldersDTO): Promise<Folders[]> {
    if (!parentId) {
      const folders: Folders[] = await prisma.$queryRaw`
        SELECT * FROM "folders"
        WHERE "displayName" ILIKE ${displayName}
        AND "userId" = ${userId};
      `;
      return folders;
    }      
  
    const folders: Folders[] = await prisma.$queryRaw`
      SELECT * FROM "folders"
      WHERE "displayName" ILIKE ${displayName}
      AND "parentId" = ${parentId}
      AND "userId" = ${userId}
    `;
        
    return folders;
  }
}