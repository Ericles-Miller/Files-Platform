import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { IPayload } from '@Applications/Interfaces/auth/IPayload';
import { AppError } from '@Domain/Exceptions/AppError';
import { prisma } from '@Infra/Database/database';


export async function ensureAuthenticated(
  request: Request, response: Response, next: NextFunction,
) {
  const authToken = request.headers.authorization;
  if (!authToken) {
    return response.status(401).json({ message: 'Token is missing!' });
  }

  const [, token] = authToken.split(' ');
  const secretToken = process.env.SECRET_TOKEN_USER;
  if (secretToken) {
    try {
      const { sub } = verify(token, secretToken) as IPayload;

      const refreshToken = await prisma.refreshTokens.findFirst({
        where: {
          userId: sub,
          revoked: false,
        },
      });

      if (!refreshToken) {
        throw new AppError('Token is revoked!', 401);
      }

      request.userId = sub;
      return next();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Unexpected server error!', 500);
    }
  } else {
    throw new AppError('Secret token is missing on file .env', 500);
  }
}
