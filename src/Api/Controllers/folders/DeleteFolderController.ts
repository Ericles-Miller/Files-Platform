import { DeleteFolderUseCase } from '@Applications/UseCases/folders/DeleteFolderUseCase';
import { container } from '@IoC/index';
import { Request, Response } from 'express';

export class DeleteFolderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { folderId } = request.params;
    const userId = request.userId;

    const deleteFolderUseCase = container.get(DeleteFolderUseCase);

    await deleteFolderUseCase.execute({ userId, folderId });
    
    return response.status(204).send();
  }
}