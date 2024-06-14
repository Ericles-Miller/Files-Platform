import * as path from 'path';
import admZip from 'adm-zip';
import { AppError } from '@Domain/Exceptions/AppError';
import fs from 'fs';

export async function unzip(nameFile: string): Promise<void> {
  try {
    const dirZip = path.join(__dirname, `../../../tmp/${nameFile}`);
    const zip = new admZip(dirZip);

    const outputDir = path.join(__dirname, '../../../tmp/unzipFolders')
    zip.extractAllTo(outputDir, true);

    fs.unlink(dirZip, (err) => {
      if (err) throw err;
      console.log('File was deleted');
    });

} catch (error) {
    throw new AppError('unexpected server error!', 500);
  }
}
