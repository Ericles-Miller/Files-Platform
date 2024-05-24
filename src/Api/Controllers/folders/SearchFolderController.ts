import { SearchFolderUseCase } from "@Applications/UseCases/folders/SearchFolderUseCase";
import { container } from "@IoC/index";
import { Request, Response } from "express";


export class SearchFolderController {
  async handle(request:Request, response: Response) :Promise<Response> {
    const { userId, folderId, displayName } = request.query;
    
    const searchFolderUseCase = container.get(SearchFolderUseCase)

    const folders = await searchFolderUseCase.execute({
      userId: userId as string, folderId: folderId as string, displayName: displayName as string
    });

    return response.json(folders);
  }
}