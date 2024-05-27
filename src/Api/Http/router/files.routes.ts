import { CreateFilesController } from "@Api/Controllers/files/CreateFilesController"
import { Router } from "express"
import multer from "multer";

export const filesRouters = Router();

const createFilesController = new CreateFilesController();

const storage = multer.memoryStorage();
const upload = multer({storage: storage})

filesRouters.post('/',upload.single('file'), createFilesController.handle);