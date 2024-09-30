import { Request, Response } from 'express';

import { ListAllFoldersToUserUseCase } from '@Applications/UseCases/folders/ListAllFoldersToUserUseCase';
import { container } from '@IoC/index';

export class ListAllFoldersToUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId } = request;

    const listAllFoldersToUserUseCase = container.get(ListAllFoldersToUserUseCase);

    const folders = await listAllFoldersToUserUseCase.execute(userId);

    return response.json(folders);
  }
}
