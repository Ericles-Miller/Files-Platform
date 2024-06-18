import { Request, Response } from 'express';

import { DeleteUserUseCase } from '@Applications/UseCases/users/DeleteUserUseCase';
import { container } from '@IoC/index';

export class DeleteUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { userId } = request;

    const deleteUserUseCase = container.get(DeleteUserUseCase);

    await deleteUserUseCase.execute(userId);

    return response.status(204).send();
  }
}
