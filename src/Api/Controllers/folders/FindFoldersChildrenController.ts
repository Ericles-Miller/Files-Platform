import { FindFoldersChildrenUseCase } from "@Applications/UseCases/folders/FindFoldersChildrenUseCase";
import { container } from "@IoC/index";
import { Request, Response } from "express";

export class FindFoldersChildrenController {
  async handle(request: Request, response: Response) :Promise<Response> {
    const { userId, id } = request.query;
    
    const findFoldersChildrenUseCase = container.get(FindFoldersChildrenUseCase);
    const folders = await findFoldersChildrenUseCase.execute(userId as string, id as string );

    return response.json(folders);
  }
}