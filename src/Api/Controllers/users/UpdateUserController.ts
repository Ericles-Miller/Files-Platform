import { Request, Response } from 'express';

import { UpdateUserUseCase } from '@Applications/UseCases/users/UpdateUserUseCase';
import { container } from '@IoC/index';

export class UpdateUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { enable, name, password } = request.body;
    const { file } = request;
    const id = request.userId;

    const updateUserUseCase = container.get(UpdateUserUseCase);

    await updateUserUseCase.execute({
      id, enable, file, name, password,
    });

    return response.status(204).send();
  }
}
