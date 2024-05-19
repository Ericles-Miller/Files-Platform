import { CreateUserController } from "@Api/Controllers/users/CreateUserController";
import { ListUserController } from "@Api/Controllers/users/ListUserController";
import { Router } from "express";
import multer from "multer";
import uploadFileAvatar from "Jobs/UploadAvatar";

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();

const upload = multer({ dest: 'uploads/' });


usersRoutes.post('/',upload.single("avatar"), createUserController.handle);
usersRoutes.get('/', listUserController.handle);