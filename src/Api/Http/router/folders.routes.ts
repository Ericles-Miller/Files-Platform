import { CreateFolderController } from "@Api/Controllers/folders/CreateFolderController";
import { UpdateFolderController } from "@Api/Controllers/folders/UpdateFolderController";
import { Router } from "express";

export const foldersRoutes = Router();

const createFolderController = new CreateFolderController();
const updateFolderController = new UpdateFolderController();

foldersRoutes.post('/', createFolderController.handle);
foldersRoutes.patch('/:id', updateFolderController.handle);