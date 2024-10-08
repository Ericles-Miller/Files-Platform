import { Request, Response } from 'express';

import { SearchFolderUseCase } from '@Applications/UseCases/shared/SearchFolderUseCase';
import { container } from '@IoC/index';


export class SearchFolderController {
  async handle(request:Request, response: Response) :Promise<Response> {
    const { folderId, displayName } = request.query;
    const { userId } = request;

    const searchFolderUseCase = container.get(SearchFolderUseCase);

    const folders = await searchFolderUseCase.execute({
      userId, folderId: folderId as string, displayName: displayName as string,
    });

    return response.json(folders);
  }
}
