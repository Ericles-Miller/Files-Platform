import { injectable } from 'inversify';

import { IBaseRepository } from '@Applications/Interfaces/repositories/shared/IBaseRepository';
import { RepositoryType } from '@Infra/Database/database';
import {
  Files, Folders, RefreshTokens, SharedItems, Users,
} from '@prisma/client';

@injectable()
export class BaseRepository<T extends Users | Files | Folders | RefreshTokens | SharedItems> implements IBaseRepository<T> {
  protected readonly repository: RepositoryType<T>;

  constructor(repository: RepositoryType<T>) {
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

  async create<T>(data: T): Promise<T> {
    const context = await this.repository.create({ data });
    return context;
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
    await this.repository.delete({ where: { id } });
  }

  async findManyById(id: string): Promise<T[]> {
    const context = await this.repository.findMany({ where: { id } });
    return context;
  }
}
