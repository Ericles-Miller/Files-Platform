import { Request, Response } from 'express';

import { UpdateViewSharedItemsUseCase } from '@Applications/UseCases/sharedItems/UpdateViewSharedItemsUseCase';
import { container } from '@IoC/index';


export class UpdateViewSharedItemsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId } = request;
    const { id, status } = request.body;

    const updateViewSharedItemsUseCase = container.get(UpdateViewSharedItemsUseCase);
    await updateViewSharedItemsUseCase.execute(id, userId, status);
    return response.status(204).send();
  }
}

