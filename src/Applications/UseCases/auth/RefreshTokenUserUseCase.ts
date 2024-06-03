import { IRefreshTokenRepository } from '@Applications/Interfaces/auth/IRefreshTokenRepository';
import { IResponseRefreshToken } from '@Applications/Interfaces/auth/IResponseRefreshToken';
import { GenerateRefreshToken } from '@Applications/Services/auth/middlewares/GenerateRefreshToken';
import { GenerateTokenProvider } from '@Applications/Services/auth/middlewares/GenerateTokenProvider';
import { AppError } from '@Domain/Exceptions/AppError';
import { container } from '@IoC/index';
import { RefreshTokens } from '@prisma/client';
import { isPast } from 'date-fns';
import { inject, injectable } from 'inversify';


@injectable()
export class RefreshTokenUserUseCase {
  constructor(
    @inject('RefreshTokenRepository')
    private refreshTokenRepository : IRefreshTokenRepository,
  ) {}

  async execute(tokenId: string): Promise<IResponseRefreshToken> {
    const refreshToken : RefreshTokens = await this.refreshTokenRepository.findById(tokenId);
    if(!refreshToken) {
      throw new AppError('Token invalid!', 404);
    }
    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute(refreshToken.userId);

    const dateToCheck = refreshToken.expiresIn * 1000;
    if(isPast(dateToCheck)) {
      await this.refreshTokenRepository.delete(refreshToken.userId);

      const generateTokenProvider = container.get(GenerateRefreshToken);
      const newRefreshToken = await generateTokenProvider.execute(refreshToken.userId);

      return { token, newRefreshToken}
    }
    return {token};
  }
}