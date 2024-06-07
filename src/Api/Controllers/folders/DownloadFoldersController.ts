import { DownloadFolderUseCase } from "@Applications/UseCases/folders/DownloadFolderUseCase";
import { container } from "@IoC/index";
import { Request, Response } from "express";
import * as fs from 'fs';

export class DownloadFoldersController {
  async handle(request: Request, response: Response) : Promise<any> {
    const { userId, folderId } = request.query;
    console.log(userId, folderId);
    
    const downloadFolderUseCase = container.get(DownloadFolderUseCase);

    const zipFilePath = await downloadFolderUseCase.execute(userId as string, folderId as string);

    response.download(zipFilePath, 'folder.zip', (err) => {
      if (err) {
        console.error(err);
      } else {
        fs.unlinkSync(zipFilePath);
      }
    });
  }
}