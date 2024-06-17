import { RefreshTokens } from '@prisma/client';

import { IBaseRepository } from '../repositories/shared/IBaseRepository';

export interface IRefreshTokenRepository extends IBaseRepository<RefreshTokens>{
  delete(userId: string) : Promise<void>
}
