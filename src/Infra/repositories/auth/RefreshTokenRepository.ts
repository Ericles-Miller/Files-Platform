import { inject, injectable } from 'inversify';
import { BaseRepository } from '../shared/BaseRepository';
import { PrismaClient, RefreshTokens } from '@prisma/client';
import { IRefreshTokenRepository } from '@Applications/Interfaces/auth/IRefreshTokenRepository';
import { prisma } from '@Infra/Database/database';


@injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshTokens> implements IRefreshTokenRepository {
  constructor(
    @inject('PrismaClient')
    prisma: PrismaClient
  ) { super(prisma.refreshTokens) }
  
  async delete(userId: string): Promise<void> {
    await prisma.refreshTokens.deleteMany({ where: { userId }});
  }
}