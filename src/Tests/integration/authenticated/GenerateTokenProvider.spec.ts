/* eslint-disable import/no-extraneous-dependencies */
import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import {
  afterAll, beforeEach, describe, expect, it, vi,
} from 'vitest';

import { GenerateTokenProvider } from '@Applications/Services/auth/middlewares/GenerateTokenProvider';
import { AppError } from '@Domain/Exceptions/AppError';

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn().mockImplementation(() => 'jwt-token'),
}));


describe('Generate a token', () => {
  let generateTokenProvider : GenerateTokenProvider;

  const userId = uuid();
  const secretToken = 'secret';

  beforeEach(() => {
    generateTokenProvider = new GenerateTokenProvider();
    process.env.SECRET_TOKEN_USER = secretToken;
  });

  afterAll(() => {
    vi.clearAllMocks();
    delete process.env.SECRET_TOKEN_USER;
  });

  it('should be able generate a new token', async () => {
    const token = sign({}, secretToken, {
      subject: userId,
      expiresIn: '15m',
    });

    await expect(generateTokenProvider.execute(userId)).resolves.toBe(token);
  });

  it('should throw an error if secret token is missing', async () => {
    delete process.env.SECRET_TOKEN_USER;
    await expect(generateTokenProvider.execute(userId)).rejects.toThrow(AppError);
  });
});
