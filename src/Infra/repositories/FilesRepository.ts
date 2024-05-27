import { Files, PrismaClient } from "@prisma/client";
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


  

}