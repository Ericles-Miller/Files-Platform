import { CreateFilesUseCase } from '@Applications/UseCases/files/CreateFilesUseCase';
import { container } from '@IoC/index';
import { Request, Response } from 'express';


export class CreateFilesController {
  async handle(request:Request, response: Response):Promise<Response> {
    const { folderId } = request.body;
    const userId = request.userId;
    const file = request.file;
    
    const createFileUseCase = container.get(CreateFilesUseCase);

    await createFileUseCase.execute({ folderId, userId, file });

    return response.status(201).send();
  }
}