import { Router } from 'express';
import multer from 'multer';

import { CreateUserController } from '@Api/Controllers/users/CreateUserController';
import { DeleteUserController } from '@Api/Controllers/users/DeleteUserController';
import { ListUserController } from '@Api/Controllers/users/ListUserController';
import { UpdateUserController } from '@Api/Controllers/users/UpdateUserController';
import { ensureAuthenticated } from '@Applications/Services/auth/ensureAuthenticated';

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const storage = multer.memoryStorage();
const upload = multer({ storage });


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
usersRoutes.post('/', upload.single('avatar'), createUserController.handle);


usersRoutes.get('/', listUserController.handle);
usersRoutes.patch('/', ensureAuthenticated, upload.single('avatar'), updateUserController.handle);
usersRoutes.delete('/', ensureAuthenticated, deleteUserController.handle);
