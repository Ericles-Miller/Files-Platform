import { CreateUserController } from "@controllers/createUser/CreateUserController";
import { ListUserController } from "@controllers/ListUser/ListUserController";
import { Router } from "express";

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();

usersRoutes.post('/', createUserController.handle);
usersRoutes.get('/', listUserController.handle);