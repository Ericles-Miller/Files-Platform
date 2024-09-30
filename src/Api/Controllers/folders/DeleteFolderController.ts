import { Request, Response } from 'express';

import { DeleteFolderUseCase } from '@Applications/UseCases/folders/DeleteFolderUseCase';
import { container } from '@IoC/index';

export class DeleteFolderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { folderId } = request.params;
    const { userId } = request;

    const deleteFolderUseCase = container.get(DeleteFolderUseCase);

    await deleteFolderUseCase.execute({ userId, folderId });

    return response.status(204).send();
  }
}
