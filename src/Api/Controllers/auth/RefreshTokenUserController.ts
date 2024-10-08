import { Request, Response } from 'express';

import { RefreshTokenUserUseCase } from '@Applications/UseCases/auth/RefreshTokenUserUseCase';
import { container } from '@IoC/index';

export class RefreshTokenUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { refreshToken } = request.body;

    const refreshTokenUserUseCase = container.get(RefreshTokenUserUseCase);

    const token = await refreshTokenUserUseCase.execute(refreshToken);

    return response.json(token);
  }
}
