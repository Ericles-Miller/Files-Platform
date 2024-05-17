import { CreateUserController } from "@Api/Controllers/users/CreateUserController";
import { ListUserController } from "@Api/Controllers/users/ListUserController";
import { Router } from "express";
import multer from "multer";
import uploadFileAvatar from "@Applications/jobs/UploadAvatar";

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();

const uploadAvatar = multer(uploadFileAvatar.upload("../../../tmp"));


usersRoutes.post('/',uploadAvatar.single("avatar"), createUserController.handle);
usersRoutes.get('/', listUserController.handle);