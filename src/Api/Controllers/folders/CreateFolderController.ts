import { CreateFolderUseCase } from "@Applications/UseCases/folders/CreateFolderUseCase";
import { container } from "@IoC/index";
import { Request, Response } from "express";


export class CreateFolderController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { displayName, size, parentId, children, userId } = request.body;

    const createFolderUseCase = container.get(CreateFolderUseCase);

    await createFolderUseCase.execute({ children, displayName, parentId, size, userId }); 

    return response.status(201).send();
  }
}