import { Request, Response } from 'express';

import { CreateFilesUseCase } from '@Applications/UseCases/files/CreateFilesUseCase';
import { container } from '@IoC/index';


export class CreateFilesController {
  async handle(request:Request, response: Response):Promise<Response> {
    const { folderId } = request.body;
    const { userId } = request;
    const { file } = request;

    const createFileUseCase = container.get(CreateFilesUseCase);

    await createFileUseCase.execute({ folderId, userId, file });

    return response.status(201).send();
  }
}
