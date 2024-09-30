import { sign } from 'jsonwebtoken';

import { AppError } from '@Domain/Exceptions/AppError';

export class GenerateTokenProvider {
  async execute(userId: string) : Promise<string> {
    const secretToken = process.env.SECRET_TOKEN_USER;
    if (!secretToken) {
      throw new AppError('Secret token is missing on file .env', 500);
    }
    const token = sign({}, secretToken, {
      subject: userId,
      expiresIn: '15m',
    });

    return token;
  }
}
