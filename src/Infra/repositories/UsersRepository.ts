import { inject, injectable } from 'inversify';

import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { prisma } from '@Infra/Database/database';
import { PrismaClient, Users } from '@prisma/client';

import { BaseRepository } from './shared/BaseRepository';


@injectable()
export class UsersRepository extends BaseRepository<Users> implements IUsersRepository {
  constructor(
    @inject('PrismaClient')
      prisma: PrismaClient,
  ) {
    super(prisma.users);
  }

  async checkEmailAlreadyExist(email: string) : Promise<Users|null> {
    const user = await prisma.users.findFirst({ where: { email } });

    return user;
  }
}
