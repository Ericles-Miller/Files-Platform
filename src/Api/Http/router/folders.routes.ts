import { Router } from 'express';
import { CreateFolderController } from '@Api/Controllers/folders/CreateFolderController';
import { DeleteFolderController } from '@Api/Controllers/folders/DeleteFolderController';
import { ListAllFoldersToUserController } from '@Api/Controllers/folders/ListAllFoldersToUserController';
import { SearchFolderController } from '@Api/Controllers/folders/SearchFolderController';
import { UpdateFolderController } from '@Api/Controllers/folders/UpdateFolderController';
import { ensureAuthenticated } from '@Applications/Services/auth/ensureAuthenticated';
import { DownloadFoldersController } from '@Api/Controllers/folders/DownloadFoldersController';
import multer from 'multer';
import upload from '@Applications/Services/FolderUpload';
import { UploadFolderController } from '@Api/Controllers/folders/UploadFolderController';

export const foldersRoutes = Router();

const folderUpload = multer(upload.upload('./tmp'));


const createFolderController = new CreateFolderController();
const updateFolderController = new UpdateFolderController();
const listAllFoldersToUserController = new ListAllFoldersToUserController();
const searchFolderController = new SearchFolderController();
const deleteFolderController = new DeleteFolderController();
const downloadFoldersController = new DownloadFoldersController();
const uploadFolderController = new UploadFolderController()

foldersRoutes.post('/', ensureAuthenticated, createFolderController.handle);
foldersRoutes.get('/',ensureAuthenticated, searchFolderController.handle);
foldersRoutes.delete('/:folderId',ensureAuthenticated, deleteFolderController.handle);
foldersRoutes.patch('/:id',ensureAuthenticated, updateFolderController.handle);
foldersRoutes.get('/listAllFoldersByUser',ensureAuthenticated, listAllFoldersToUserController.handle);
foldersRoutes.get('/download/:folderId',ensureAuthenticated, downloadFoldersController.handle);
foldersRoutes.post('/upload', folderUpload.single('folderZip'), uploadFolderController.handle); //without router in swagger