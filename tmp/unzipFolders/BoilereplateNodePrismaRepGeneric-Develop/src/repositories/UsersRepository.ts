import { inject, injectable } from 'inversify';

import { BaseRepository } from './BaseRepository';
import { IUsersRepository } from './IUsersRepository';
import { PrismaClient, Users } from '@prisma/client';
import { prisma } from '@shared/infra/database';


@injectable()
export class UsersRepository extends BaseRepository<Users> implements IUsersRepository {
  constructor(
    @inject('PrismaClient')
    prisma: PrismaClient
  ) {
    super(prisma.users);
  }

  async checkEmailAlreadyExist(email: string) : Promise<Users|null> {
    const user = await prisma.users.findFirst({ where: { email }})

    return user;
  }

}
