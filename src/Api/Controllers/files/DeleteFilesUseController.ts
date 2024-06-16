import { DeleteFilesUseCase } from '@Applications/UseCases/files/DeleteFilesUseCase';
import { container } from '@IoC/index';
import { Request, Response } from 'express';


export class DeleteFilesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { folderId, id } = request.query;
    const userId = request.userId;

    const deleteFilesUseCase = container.get(DeleteFilesUseCase);

    await deleteFilesUseCase.execute(userId, folderId as string, id as string);

    return response.status(204).send();
  }
}