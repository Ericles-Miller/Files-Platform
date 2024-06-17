import { Request, Response } from 'express';

import { CreateUserUseCase } from '@Applications/UseCases/users/CreateUserUseCase';
import { container } from '@IoC/index';

export class CreateUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { name, email, password } = request.body;
    const { file } = request;

    const createUserUseCase = container.get(CreateUserUseCase);
    await createUserUseCase.execute({
      email, name, password, file,
    });

    return response.status(201).json({ message: 'User Created With Success!' });
  }
}

