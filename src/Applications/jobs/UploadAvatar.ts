import multer from "multer";
import { resolve } from "path";

export default {
  upload(folder: string) {
    return {
      storage: multer.diskStorage({
        destination: (request, file, callback) => {
          callback(null, resolve(__dirname, "../../", folder));
        },
        filename: (request, file, callback) => {
          const fileName = `${file.originalname}`;
          console.log("File Name:", fileName);

          return callback(null, fileName);
        },
      }),
    };
  },
};
