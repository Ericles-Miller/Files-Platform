import { CreateFolderController } from "@Api/Controllers/folders/CreateFolderController";
import { Router } from "express";


export const foldersRoutes = Router();

const createFolderController = new CreateFolderController();

foldersRoutes.post('/', createFolderController.handle);