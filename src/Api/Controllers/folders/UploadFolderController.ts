import { Request, Response } from 'express';

import { UploadFolderUseCase } from '@Applications/UseCases/folders/UploadFolderUseCase';
import { container } from '@IoC/index';

export class UploadFolderController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { parentId } = request.body;
    const folder = request.file;
    const { userId } = request;

    const uploadFolderUseCase = container.get(UploadFolderUseCase);
    const displayName = folder?.filename;
    if (displayName) {
      await uploadFolderUseCase.execute(displayName, userId, parentId);
    }

    return response.status(201).send();
  }
}
