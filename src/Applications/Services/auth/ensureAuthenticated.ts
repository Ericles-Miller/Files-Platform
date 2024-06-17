import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { AppError } from '@Domain/Exceptions/AppError';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request, response: Response, next: NextFunction,
) {
  const authToken = request.headers.authorization; // recebe o dado via header
  if (!authToken) {
    return response.status(401).json({ message: 'Token is missing!' });
  }

  const [, token] = authToken.split(' ');
  const secretToken = process.env.SECRET_TOKEN_USER;
  if (secretToken) {
    try {
      // verifico se o token e valido
      const { sub } = verify(token, secretToken) as IPayload; // chave de criptografia

      request.userId = sub;
      return next();
    } catch (error) {
      throw new AppError('Invalid token!', 401);
    }
  } else {
    throw new AppError('Secret token is missing on file .env', 500);
  }
}
