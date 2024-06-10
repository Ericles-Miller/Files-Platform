import { Router } from 'express';
import { CreateFolderController } from '@Api/Controllers/folders/CreateFolderController';
import { DeleteFolderController } from '@Api/Controllers/folders/DeleteFolderController';
import { ListAllFoldersToUserController } from '@Api/Controllers/folders/ListAllFoldersToUserController';
import { SearchFolderController } from '@Api/Controllers/folders/SearchFolderController';
import { UpdateFolderController } from '@Api/Controllers/folders/UpdateFolderController';
import { ensureAuthenticated } from '@Applications/Services/auth/ensureAuthenticated';
import { DownloadFoldersController } from '@Api/Controllers/folders/DownloadFoldersController';

export const foldersRoutes = Router();

const createFolderController = new CreateFolderController();
const updateFolderController = new UpdateFolderController();
const listAllFoldersToUserController = new ListAllFoldersToUserController();
const searchFolderController = new SearchFolderController();
const deleteFolderController = new DeleteFolderController();
const downloadFoldersController = new DownloadFoldersController();

foldersRoutes.post('/', ensureAuthenticated, createFolderController.handle);
foldersRoutes.get('/',ensureAuthenticated, searchFolderController.handle);
foldersRoutes.delete('/', ensureAuthenticated, deleteFolderController.handle);
foldersRoutes.patch('/:id',ensureAuthenticated, updateFolderController.handle);
foldersRoutes.get('/:userId', listAllFoldersToUserController.handle);
foldersRoutes.get('/prepare/download',ensureAuthenticated, downloadFoldersController.handle);