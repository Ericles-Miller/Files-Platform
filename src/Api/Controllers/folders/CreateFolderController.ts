import { Request, Response } from 'express';

import { CreateFolderUseCase } from '@Applications/UseCases/folders/CreateFolderUseCase';
import { container } from '@IoC/index';


export class CreateFolderController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { displayName, parentId } = request.body;
    const { userId } = request;

    const createFolderUseCase = container.get(CreateFolderUseCase);

    await createFolderUseCase.execute({ displayName, parentId, userId });

    return response.status(201).send();
  }
}
