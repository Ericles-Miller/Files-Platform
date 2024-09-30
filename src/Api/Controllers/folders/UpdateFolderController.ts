import { Request, Response } from 'express';

import { UpdateFolderUseCase } from '@Applications/UseCases/folders/UpdateFolderUseCase';
import { container } from '@IoC/index';


export class UpdateFolderController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { id } = request.params;
    const { displayName, parentId } = request.body;
    const { userId } = request;

    const updateFolderUseCase = container.get(UpdateFolderUseCase);

    await updateFolderUseCase.execute({
      id, userId, displayName, parentId,
    });

    return response.status(204).send();
  }
}
