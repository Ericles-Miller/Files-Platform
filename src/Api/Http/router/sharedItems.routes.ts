import { Router } from 'express';

import { SharedItemsBetweenUsersController } from '@Api/Controllers/sharedItems/SharedItemsBetweenUsersController';
import { ensureAuthenticated } from '@Applications/Services/auth/ensureAuthenticated';

export const sharedItemsRouter = Router();

const sharedItemsBetweenUsersController = new SharedItemsBetweenUsersController();


sharedItemsRouter.post('/', ensureAuthenticated, sharedItemsBetweenUsersController.handle);
