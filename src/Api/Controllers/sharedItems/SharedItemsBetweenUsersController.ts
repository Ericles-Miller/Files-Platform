import { Request, Response } from 'express';

import { SharedItemsBetweenUsersUseCase } from '@Applications/UseCases/sharedItems/SharedItemsBetweenUsersUseCase';
import { container } from '@IoC/index';


export class SharedItemsBetweenUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId } = request;
    const { folderId, fileId, sharedWithUserId } = request.body;

    const sharedItemsBetweenUsersUseCase = container.get(SharedItemsBetweenUsersUseCase);

    await sharedItemsBetweenUsersUseCase.execute({
      userId, sharedWithUserId, fileId, folderId,
    });

    return response.status(201).send();
  }
}
