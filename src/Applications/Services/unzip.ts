/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import * as path from 'path';
import * as yauzl from 'yauzl';

import { AppError } from '@Domain/Exceptions/AppError';

export async function unzip(nameFile: string, userId: string, displayName?: string): Promise<void> {
  try {
    const dirZip = path.join(__dirname, `../../../tmp/${nameFile}`);

    let outputDir : string;
    displayName ? outputDir = path.join(__dirname, `../../../tmp/unzipFolders/${userId}/${displayName}`)
      : outputDir = path.join(__dirname, `../../../tmp/unzipFolders/${userId}`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    yauzl.open(dirZip, { lazyEntries: true, decodeStrings: true }, (err, zipFile) => {
      if (err) throw err;
      if (!zipFile) return;

      zipFile.readEntry();

      zipFile.on('entry', (entry: yauzl.Entry) => {
        if (/\/$/.test(entry.fileName)) {
          zipFile.readEntry();
          return;
        }

        const outputPath = path.join(outputDir, entry.fileName);

        const outputDirPath = path.dirname(outputPath);
        if (!fs.existsSync(outputDirPath)) {
          fs.mkdirSync(outputDirPath, { recursive: true });
        }

        zipFile.openReadStream(entry, (err, readStream) => {
          if (err) throw err;
          if (!readStream) return;

          readStream.on('end', () => {
            zipFile.readEntry();
          });

          const writeStream = fs.createWriteStream(outputPath);
          readStream.pipe(writeStream);
        });
      });
    });

    fs.unlink(dirZip, (err) => {
      if (err) throw err;
      console.log('File was deleted');
    });
  } catch (error) {
    throw new AppError('Unexpected server error!', 500);
  }
}
