import { Router } from 'express';

import { SharedItemsBetweenUsersController } from '@Api/Controllers/sharedItems/SharedItemsBetweenUsersController';
import { ViewerSharedItemsController } from '@Api/Controllers/sharedItems/ViewerSharedItemsController';
import { ensureAuthenticated } from '@Applications/Services/auth/ensureAuthenticated';

export const sharedItemsRouter = Router();

const sharedItemsBetweenUsersController = new SharedItemsBetweenUsersController();
const viewerSharedItemsController = new ViewerSharedItemsController();

sharedItemsRouter.get('/:id', ensureAuthenticated, viewerSharedItemsController.handle);
sharedItemsRouter.post('/', ensureAuthenticated, sharedItemsBetweenUsersController.handle);
