import { CreateUserController } from "@Api/Controllers/users/CreateUserController";
import { DeleteUserController } from "@Api/Controllers/users/DeleteUserController";
import { ListUserController } from "@Api/Controllers/users/ListUserController";
import { UpdateUserController } from "@Api/Controllers/users/UpdateUserController";
import { ensureAuthenticated } from "@Applications/Services/auth/ensureAuthenticated";
import { Router } from "express";
import multer from "multer";

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


usersRoutes.post('/',upload.single('avatar'), createUserController.handle);
usersRoutes.get('/', listUserController.handle);
usersRoutes.patch('/',ensureAuthenticated, upload.single('avatar'), updateUserController.handle);
usersRoutes.delete('/', ensureAuthenticated,  deleteUserController.handle);