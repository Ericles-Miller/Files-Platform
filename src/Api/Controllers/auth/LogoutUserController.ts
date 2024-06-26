import { Request, Response } from 'express';

import { LogoutUserUseCase } from '@Applications/UseCases/auth/LogoutUserUseCase';
import { container } from '@IoC/index';


export class LogoutUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.body;

    const logoutUserUseCase = container.get(LogoutUserUseCase);

    await logoutUserUseCase.execute(token);

    return response.status(204).send();
  }
}
