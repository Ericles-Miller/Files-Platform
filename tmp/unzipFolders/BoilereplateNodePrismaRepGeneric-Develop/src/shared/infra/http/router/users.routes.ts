import { UsersController } from "@controllers/UserController";
import { Router } from "express";



export const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post('/', usersController.handle);
usersRoutes.get('/', usersController.list);