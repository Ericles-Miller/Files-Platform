import { DeleteFolderUseCase } from "@Applications/UseCases/folders/DeleteFolderUseCase";
import { container } from "@IoC/index";
import { Request, Response } from "express";

export class DeleteFolderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId, folderId } = request.query;

    const deleteFolderUseCase = container.get(DeleteFolderUseCase);

    await deleteFolderUseCase.execute({userId: userId as string, folderId: folderId as string});
    
    return response.status(204).send();
  }
}