import { Children, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./shared/BaseRepository";
import { IChildrenRepository } from "@Applications/Interfaces/IChildrenRepository";
import { inject, injectable } from "inversify";



@injectable()
export class ChildrenRepository extends BaseRepository<Children> implements IChildrenRepository {
  constructor(
    @inject('PrismaClient')
    prisma: PrismaClient,
  ) { super(prisma.children) }

  

}