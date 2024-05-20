import { CreateUserController } from "@Api/Controllers/users/CreateUserController";
import { ListUserController } from "@Api/Controllers/users/ListUserController";
import { UpdateUserController } from "@Api/Controllers/users/UpdateUserController";
import { Router } from "express";
import multer from "multer";

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const updateUserController = new UpdateUserController();

const storage = multer.memoryStorage()
const upload = multer({storage: storage});


usersRoutes.post('/',upload.single('avatar'), createUserController.handle);
usersRoutes.get('/', listUserController.handle);
usersRoutes.patch('/',upload.single('avatar'), updateUserController.handle )