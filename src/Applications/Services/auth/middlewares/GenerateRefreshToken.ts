import { IRefreshTokenRepository } from "@Applications/Interfaces/auth/IRefreshTokenRepository";
import { RefreshToken } from "@Domain/Entities/RefresToken";
import { RefreshTokens } from "@prisma/client";
import { addMinutes, getTime } from 'date-fns'
import { inject, injectable } from "inversify";

@injectable()
export class GenerateRefreshToken {
  constructor(
    @inject('RefreshTokenRepository')
    private refreshTokenRepository : IRefreshTokenRepository,
  ) {}

  async execute(userId: string) : Promise<RefreshTokens> {
    const now = new Date();
    const futureTime = addMinutes(now, 5);
    const expiresIn = getTime(futureTime) / 1000; 

    const refreshToken = new RefreshToken(userId, expiresIn);
    const generateRefreshToken = await this.refreshTokenRepository.create(refreshToken);

    return generateRefreshToken;
  }
}