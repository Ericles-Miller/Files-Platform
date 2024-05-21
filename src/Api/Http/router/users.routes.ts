import { CreateUserController } from "@Api/Controllers/users/CreateUserController";
import { ListUserController } from "@Api/Controllers/users/ListUserController";
import { Router } from "express";

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();

usersRoutes.post('/', createUserController.handle);
usersRoutes.get('/', listUserController.handle);