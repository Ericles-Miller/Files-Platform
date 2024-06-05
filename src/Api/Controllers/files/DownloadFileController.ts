import { DownloadFilesUseCase } from '@Applications/UseCases/files/DownloadFilesUseCase';
import { container } from '@IoC/index';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

export class DownloadFileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId, fileId } = request.query;

    const downloadFileUseCase = container.get(DownloadFilesUseCase);

    const file = await downloadFileUseCase.execute(userId as string, fileId as string);


    var file = __dirname + '/upload-folder/dramaticpenguin.MOV';

    var filename = path.basename(file);
    var mimetype = mime.getType(file);

    response.setHeader('Content-disposition', 'attachment; filename=' + filename);
    response.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(response);
  }
}