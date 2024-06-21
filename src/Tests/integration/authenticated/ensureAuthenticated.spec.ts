/* eslint-disable import/no-extraneous-dependencies */
import { NextFunction, Request, Response } from 'express';
import {
  instance, mock, verify, when,
} from 'ts-mockito';
import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';

import { ensureAuthenticated } from '@Applications/Services/auth/ensureAuthenticated';
import { AppError } from '@Domain/Exceptions/AppError';


vi.mock('jsonwebtoken', () => ({
  sign: vi.fn().mockImplementation(() => 'jwt-token'),
}));

describe('ensureAuthenticated middleware', () => {
  let mockedRequest: Request;
  let mockedResponse: Response;
  let mockedNext: NextFunction;

  beforeEach(() => {
    mockedRequest = mock<Request>();
    mockedResponse = mock<Response>();
    mockedNext = vi.fn();
  });

  it('should return 401  if no token is provided', async () => {
    when(mockedRequest.headers).thenReturn({});

    const request = instance(mockedRequest);
    const response = instance(mockedResponse);

    response.status = vi.fn().mockReturnValue(response);
    response.json = vi.fn().mockReturnValue(response);

    await ensureAuthenticated(request, response, mockedNext);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: 'Token is missing!' });
  });

  it('should throw an error if token is invalid', async () => {
    process.env.SECRET_TOKEN_USER = 'secret';
    (verify as vi.Mock).mockImplementation(() => {
      throw new Error();
    });

    when(mockedRequest.headers).thenReturn({ authorization: 'Bearer token' });
    const request = instance(mockedRequest);
    const response = instance(mockedResponse);

    await expect(ensureAuthenticated(request, response, mockedNext)).rejects.toThrow(AppError);
  });

  it('should call next function if token is valid', async () => {
    process.env.SECRET_TOKEN_USER = 'secret';
    const userId = 'user-id';
    (verify as vi.Mock).mockReturnValue({ sub: userId });

    when(mockedRequest.headers).thenReturn({ authorization: 'Bearer token' });
    const request = instance(mockedRequest);
    const response = instance(mockedResponse);

    await ensureAuthenticated(request, response, mockedNext);

    expect(request.userId).toBe(userId);
    expect(mockedNext).toHaveBeenCalled();
  });
});
