import { inject, injectable } from 'inversify';

import { IRefreshTokenRepository } from '@Applications/Interfaces/auth/IRefreshTokenRepository';
import { prisma } from '@Infra/Database/database';
import { PrismaClient, RefreshTokens } from '@prisma/client';

import { BaseRepository } from '../shared/BaseRepository';

@injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshTokens> implements IRefreshTokenRepository {
  constructor(
    @inject('PrismaClient')
      prisma: PrismaClient,
  ) { super(prisma.refreshTokens); }

  async delete(userId: string): Promise<void> {
    await prisma.refreshTokens.deleteMany({ where: { userId } });
  }
}
