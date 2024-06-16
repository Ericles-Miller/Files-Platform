import { CreateFolderUseCase } from '@Applications/UseCases/folders/CreateFolderUseCase';
import { container } from '@IoC/index';
import { Request, Response } from 'express';


export class CreateFolderController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { displayName, parentId } = request.body;
    const userId = request.userId;

    const createFolderUseCase = container.get(CreateFolderUseCase);

    await createFolderUseCase.execute({ displayName, parentId, userId }); 

    return response.status(201).send();
  }
}