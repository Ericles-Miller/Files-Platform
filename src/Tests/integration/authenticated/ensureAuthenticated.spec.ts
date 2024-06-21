import { sign, verify, } from 'jsonwebtoken';
import { mock, instance, when, verify as tsVerify, reset } from 'ts-mockito';
import { Request, Response, NextFunction } from 'express';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AppError } from '@Domain/Exceptions/AppError';
import { ensureAuthenticated } from '@Applications/Services/auth/ensureAuthenticated';
import { IPayload } from '@Applications/Interfaces/auth/IPayload';

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(),
  verify: vi.fn(),
}));

describe('ensureAuthenticated middleware', () => {
  let mockedRequest: Request;
  let mockedResponse: Response;
  let mockedResponseAuth: Request;
  let mockedNext: NextFunction;
  let mockedNextVi : NextFunction;

  beforeEach(() => {
    mockedRequest = mock<Request>();
    mockedResponse = mock<Response>();
    mockedNext = mock<NextFunction>();
    mockedNextVi = vi.fn() as unknown as NextFunction;
    process.env.SECRET_TOKEN_USER = 'secret';
  });

  afterEach(() => {
    vi.clearAllMocks();
    reset(mockedRequest);
    reset(mockedResponse);
    reset(mockedNext);
  });

  // it('should return 401 if no token is provided', async () => {
  //   const request = instance(mockedRequest);
  //   const response = instance(mockedResponse);
  //   const next = instance(mockedNext)
    
  //   when(mockedResponseAuth.headers).thenReturn({});

  //   response.status = vi.fn().mockReturnValue(response);
  //   response.json = vi.fn().mockReturnValue(response);
    
  //   await ensureAuthenticated(request, response, mockedNext);

  //   expect(response.status).toHaveBeenCalledWith(401);
  //   expect(response.json).toHaveBeenCalledWith({ message: 'Token is missing!' });
  // });

  it('should throw an error if secret token is missing', async () => {
    delete process.env.SECRET_TOKEN_USER;

    when(mockedRequest.headers).thenReturn({ authorization: 'Bearer token' });
    const request = instance(mockedRequest);
    const response = instance(mockedResponse);

    await expect(ensureAuthenticated(request, response, mockedNext)).rejects.toThrow(AppError);
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
    (verify as vi.Mock).mockReturnValue({ sub: userId } as IPayload);

    when(mockedRequest.headers).thenReturn({ authorization: 'Bearer token' });
    const request = instance(mockedRequest);
    const response = instance(mockedResponse);
    const next = instance(mockedNextVi);

    await ensureAuthenticated(request, response, mockedNextVi);

    expect(request.userId).toBe(userId);
    expect(mockedNextVi).toHaveBeenCalled();

  });
});
