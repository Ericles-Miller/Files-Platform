import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { BaseRepository } from "./shared/BaseRepository";
import { Folders, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { prisma } from "@Infra/Database/database";


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
  

}