import { DownloadFilesUseCase } from '@Applications/UseCases/files/DownloadFilesUseCase';
import { container } from '@IoC/index';
import { Request, Response } from 'express';

export class DownloadFileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId, fileId } = request.query;

    const downloadFileUseCase = container.get(DownloadFilesUseCase);

    const file = await downloadFileUseCase.execute(userId as string, fileId as string);

    return response.status(201).json({ message: 'Download file success!' });
  }
}