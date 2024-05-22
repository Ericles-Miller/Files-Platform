import { injectable } from "inversify";
import { Files, Folders, RefreshTokens, Users, } from "@prisma/client";
import { RepositoryType } from "@Infra/Database/database";
import { IBaseRepository } from "@Applications/Interfaces/IBaseRepository";

@injectable()
export class BaseRepository<T extends Users | Files | Folders | RefreshTokens > implements IBaseRepository<T> {
  protected readonly repository: RepositoryType<T>;

  constructor(repository: RepositoryType<T> ) {  
    this.repository = repository;
  }

  async findById<T>(id: string): Promise<T> {
    const context = await this.repository.findUnique({
      where: {
        id,
      },
    });

    return context;
  }

  async create(data: T): Promise<void> {
    await this.repository.create({ data });
  }

  async listAll(): Promise<T[]> {
    const context = await this.repository.findMany();
    return context;
  }

  async update<T>(id: string, data: T): Promise<T> {
    const context = await this.repository.update({
      where: {
        id,
      },
      data,
    });

    return context;
  }

  async delete(id: string) : Promise<void> {
    await this.repository.delete({ where: { id }}); 
  }
}