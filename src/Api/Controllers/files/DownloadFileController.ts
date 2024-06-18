import { Request, Response } from 'express';

import { DownloadFilesUseCase } from '@Applications/UseCases/files/DownloadFilesUseCase';
import { container } from '@IoC/index';

export class DownloadFileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { fileId } = request.params;
    const { userId } = request;

    const downloadFileUseCase = container.get(DownloadFilesUseCase);

    const file = await downloadFileUseCase.execute(userId, fileId);

    response.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
    response.setHeader('Content-Type', file.contentType);
    return response.send(file.body);
  }
}
