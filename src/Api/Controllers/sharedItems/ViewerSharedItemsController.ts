import { Request, Response } from 'express';

import { ViewerSharedItemsUseCase } from '@Applications/UseCases/sharedItems/ViewerItemSharedUseCase';
import { container } from '@IoC/index';


export class ViewerSharedItemsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId } = request;
    const { id } = request.params;

    const viewerSharedItemsUseCase = container.get(ViewerSharedItemsUseCase);

    const sharedItems = await viewerSharedItemsUseCase.execute(id, userId);

    return response.json(sharedItems);
  }
}
