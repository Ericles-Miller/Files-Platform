import { Request, Response } from 'express';

import { ListUsersUseCase } from '@Applications/UseCases/users/ListUserUseCase';
import { container } from '@IoC/index';

export class ListUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const listUsersUseCase = container.get(ListUsersUseCase);

    const users = await listUsersUseCase.execute();
    return response.json(users);
  }
}
