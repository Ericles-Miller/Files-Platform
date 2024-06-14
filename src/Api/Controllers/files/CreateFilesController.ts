import { CreateFilesUseCase } from '@Applications/UseCases/files/CreateFilesUseCase';
import { container } from '@IoC/index';
import { Request, Response } from 'express';


export class CreateFilesController {
  async handle(request:Request, response: Response):Promise<Response> {
    const { folderId } = request.body;
    const { id } = request.user;
    const file = request.file;
    console.log(id);
    
    const createFileUseCase = container.get(CreateFilesUseCase);

    await createFileUseCase.execute({ folderId, userId: id, file });

    return response.status(201).send();
  }
}