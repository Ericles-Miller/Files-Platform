import { CreateFolderController } from "@Api/Controllers/folders/CreateFolderController";
import { FindFoldersChildrenController } from "@Api/Controllers/folders/FindFoldersChildrenController";
import { ListAllFoldersToUserController } from "@Api/Controllers/folders/ListAllFoldersToUserController";
import { UpdateFolderController } from "@Api/Controllers/folders/UpdateFolderController";
import { Router } from "express";

export const foldersRoutes = Router();

const createFolderController = new CreateFolderController();
const updateFolderController = new UpdateFolderController();
const listAllFoldersToUserController = new ListAllFoldersToUserController();
const findFoldersChildrenController = new FindFoldersChildrenController();

foldersRoutes.post('/', createFolderController.handle);
foldersRoutes.patch('/:id', updateFolderController.handle);
foldersRoutes.get('/:userId', listAllFoldersToUserController.handle);
foldersRoutes.get('/', findFoldersChildrenController.handle);