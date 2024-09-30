import { Request, Response } from 'express';

import { AuthenticateUserUseCase } from '@Applications/UseCases/auth/AuthenticatedUseCase';
import { container } from '@IoC/index';

export class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUserUseCase = container.get(AuthenticateUserUseCase);

    const token = await authenticateUserUseCase.execute(email, password);

    return response.json(token);
  }
}
