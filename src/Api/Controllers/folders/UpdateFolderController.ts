import { UpdateFolderUseCase } from "@Applications/UseCases/folders/UpdateFolderUseCase";
import { container } from "@IoC/index";
import { Request, Response } from "express";



export class UpdateFolderController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { id } = request.params;
    const { userId, displayName, parentId } = request.body;

    const updateFolderUseCase = container.get(UpdateFolderUseCase);

    await updateFolderUseCase.execute({ id, userId, displayName, parentId });

    return response.status(204).send();
  }
}