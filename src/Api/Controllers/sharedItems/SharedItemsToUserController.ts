import { Request, Response } from 'express';

import { SharedItemsToUserUseCase } from '@Applications/UseCases/sharedItems/SharedItemsToUserUseCase';
import { container } from '@IoC/index';


export class SharedItemsToUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId } = request;

    const sharedItemsToUserUseCase = container.get(SharedItemsToUserUseCase);

    const sharedItemToUser = await sharedItemsToUserUseCase.execute(userId);

    return response.json(sharedItemToUser);
  }
}
