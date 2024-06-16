import { DeleteUserUseCase } from '@Applications/UseCases/users/DeleteUserUseCase';
import { container } from '@IoC/index';
import { Request, Response } from 'express';

export class DeleteUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const  userId = request.userId;

    const deleteUserUseCase = container.get(DeleteUserUseCase);

    await deleteUserUseCase.execute(userId);

    return response.status(204).send();
  }
}