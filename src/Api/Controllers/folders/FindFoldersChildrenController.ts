import { FindFoldersChildrenUseCase } from "@Applications/UseCases/folders/FindFoldersChildrenUseCase";
import { container } from "@IoC/index";
import { Request, Response } from "express";


export class FindFoldersChildrenController {
  async handle(request: Request, response: Response) :Promise<Response> {
    let { userId, id, path } = request.query;
    path = path as string;
    userId = userId as string;
    id = id as string;

    const findFoldersChildrenUseCase = container.get(FindFoldersChildrenUseCase);

    const folders = await findFoldersChildrenUseCase.execute({ userId, id, path });

    return response.json(folders);
  }
}