import { CreateFilesController } from '@Api/Controllers/files/CreateFilesController'
import { DeleteFilesController } from '@Api/Controllers/files/DeleteFilesUseController';
import { DownloadFileController } from '@Api/Controllers/files/DownloadFileController';
import { ensureAuthenticated } from '@Applications/Services/auth/ensureAuthenticated';
import { Router } from 'express'
import multer from 'multer';

export const filesRouters = Router();

const createFilesController = new CreateFilesController();
const deleteFilesController = new DeleteFilesController()
const downloadFileController = new DownloadFileController();

const storage = multer.memoryStorage();
const upload = multer({storage: storage})

filesRouters.post('/',ensureAuthenticated, upload.single('file'), createFilesController.handle);
filesRouters.delete('/',ensureAuthenticated, deleteFilesController.handle);
filesRouters.get('/download',ensureAuthenticated, downloadFileController.handle);