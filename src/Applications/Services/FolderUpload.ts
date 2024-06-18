import multer from 'multer';
import { resolve } from 'path';

import { AppError } from '@Domain/Exceptions/AppError';

export default {
  upload(folder: string) {
    return {
      storage: multer.diskStorage({
        destination: (request, file, callback) => {
          callback(null, resolve(__dirname, '../../../', folder));
        },
        filename: (request, file, callback) => {
          if (file.mimetype !== 'application/zip') {
            throw new AppError('The file must be of the zip type!', 400);
          }

          const fileName = `${file.originalname}`;
          return callback(null, fileName);
        },
      }),
    };
  },
};
