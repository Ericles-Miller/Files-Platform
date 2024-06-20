/* eslint-disable import/no-extraneous-dependencies */
import 'reflect-metadata';
import 'express-async-errors';
import { addMinutes, getTime } from 'date-fns';
import {
  capture,
  instance, mock, reset, verify, when,
} from 'ts-mockito';
import { v4 as uuid } from 'uuid';
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest';

import { IRefreshTokenRepository } from '@Applications/Interfaces/auth/IRefreshTokenRepository';
import { GenerateRefreshToken } from '@Applications/Services/auth/middlewares/GenerateRefreshToken';
import { RefreshToken } from '@Domain/Entities/RefreshToken';

describe('Generate a Refresh Token', () => {
  let generateRefreshToken: GenerateRefreshToken;
  let refreshTokenRepository: IRefreshTokenRepository;

  beforeEach(() => {
    refreshTokenRepository = mock<IRefreshTokenRepository>();
    generateRefreshToken = new GenerateRefreshToken(instance(refreshTokenRepository));
  });

  afterEach(() => {
    reset(refreshTokenRepository);
  });

  it('should be able create a new refreshToken', async () => {
    const userId = uuid();
    const expiresIn = getTime(addMinutes(new Date(), 15));

    const refreshToken = new RefreshToken(userId, expiresIn);

    when(refreshTokenRepository.create(expect.objectContaining(refreshToken))).thenResolve(refreshToken);
    const newToken = await generateRefreshToken.execute(userId);

    verify(await refreshTokenRepository.create(expect.anything())).once();
    expect(newToken).toEqual(refreshToken);
    expect(newToken.userId).toBe(userId);
    expect(newToken.expiresIn).toBeGreaterThan(Math.floor(Date.now() / 1000));


    // Capturing the argument passed to the create method
    const [capturedToken] = capture(refreshTokenRepository.create).last();
    expect(capturedToken.userId).toBe(userId);
    expect(capturedToken.expiresIn).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});
