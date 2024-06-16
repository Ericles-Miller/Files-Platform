import { DownloadFolderUseCase } from '@Applications/UseCases/folders/DownloadFolderUseCase';
import { container } from '@IoC/index';
import { Request, Response } from 'express';
import * as fs from 'fs';

export class DownloadFoldersController {
  async handle(request: Request, response: Response) : Promise<any> {
    const { folderId } = request.params;
    const userId = request.userId;
    console.log(folderId, userId);
    

    const downloadFolderUseCase = container.get(DownloadFolderUseCase);

    const zipFilePath = await downloadFolderUseCase.execute(userId, folderId);

    response.download(zipFilePath, 'folder.zip', (err) => {
      if (err) {
        console.error(err);
      } else {
        fs.unlinkSync(zipFilePath);
      }
    });
  }
}