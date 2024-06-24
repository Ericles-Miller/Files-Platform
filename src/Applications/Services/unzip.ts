/* eslint-disable new-cap */
import admZip from 'adm-zip';
import fs from 'fs';
import * as path from 'path';

import { AppError } from '@Domain/Exceptions/AppError';


export async function unzip(nameFile: string, userId: string): Promise<void> {
  try {
    const dirZip = path.join(__dirname, `../../../tmp/${nameFile}`);
    const zip = new admZip(dirZip);

    const outputDir = path.join(__dirname, `../../../tmp/unzipFolders/${userId}`);
    zip.extractAllTo(outputDir, true);

    fs.unlink(dirZip, (err) => {
      if (err) throw err;
      console.log('File was deleted');
    });
  } catch (error) {
    throw new AppError('unexpected server error!', 500);
  }
}
