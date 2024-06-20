import jwt from 'jsonwebtoken';

import { AppError } from '@Domain/Exceptions/AppError';

export function generateConfirmationToken(userId: string): string {
  if (!process.env.JWT_SECRET_NEW_USER) {
    throw new AppError('The JWT_SECRET_NEW_USER is null. Please the set secret key to development variable', 404);
  }
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_NEW_USER, { expiresIn: '1h' });
  return token;
}
