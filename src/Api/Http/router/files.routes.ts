import { CreateFilesController } from "@Api/Controllers/files/CreateFilesController"
import { DeleteFilesController } from "@Api/Controllers/files/DeleteFilesUseController";
import { Router } from "express"
import multer from "multer";

export const filesRouters = Router();

const createFilesController = new CreateFilesController();
const deleteFilesController = new DeleteFilesController()

const storage = multer.memoryStorage();
const upload = multer({storage: storage})

filesRouters.post('/',upload.single('file'), createFilesController.handle);
filesRouters.delete('/', deleteFilesController.handle);