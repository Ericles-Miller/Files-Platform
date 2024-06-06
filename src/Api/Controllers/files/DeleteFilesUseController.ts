import { DeleteFilesUseCase } from '@Applications/UseCases/files/DeleteFilesUseCase';
import { container } from '@IoC/index';
import { Request, Response } from 'express';


export class DeleteFilesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId, folderId, id } = request.query;

    const deleteFilesUseCase = container.get(DeleteFilesUseCase);

    await deleteFilesUseCase.execute(userId as string, folderId as string, id as string);

    return response.status(204).send();
  }
}