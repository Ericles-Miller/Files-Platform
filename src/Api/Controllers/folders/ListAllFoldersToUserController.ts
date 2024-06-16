import { ListAllFoldersToUserUseCase } from '@Applications/UseCases/folders/ListAllFoldersToUserUseCase';
import { container } from '@IoC/index';
import { Request, Response } from 'express';

export class ListAllFoldersToUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.userId;

    const listAllFoldersToUserUseCase = container.get(ListAllFoldersToUserUseCase);

    const folders = await listAllFoldersToUserUseCase.execute(userId);

    return response.json(folders);
  }
}