import { inject, injectable } from 'inversify';

import { IRefreshTokenRepository } from '@Applications/Interfaces/auth/IRefreshTokenRepository';
import { AppError } from '@Domain/Exceptions/AppError';
import { RefreshTokens } from '@prisma/client';

@injectable()
export class LogoutUserUseCase {
  constructor(
    @inject('RefreshTokenRepository')
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const token: RefreshTokens = await this.refreshTokenRepository.findById(id);
    if (!token) {
      throw new AppError('Token is missing!', 404);
    }

    token.revoked = true;
    await this.refreshTokenRepository.update(id, token);
  }
}
