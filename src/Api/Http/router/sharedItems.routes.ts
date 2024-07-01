import { Router } from 'express';

import { SharedItemsBetweenUsersController } from '@Api/Controllers/sharedItems/SharedItemsBetweenUsersController';
import { SharedItemsToUserController } from '@Api/Controllers/sharedItems/SharedItemsToUserController';
import { UpdateViewSharedItemsController } from '@Api/Controllers/sharedItems/UpdateViewSharedItemsController';
import { ViewerSharedItemsController } from '@Api/Controllers/sharedItems/ViewerSharedItemsController';
import { ensureAuthenticated } from '@Applications/Services/auth/ensureAuthenticated';

export const sharedItemsRouter = Router();

const sharedItemsBetweenUsersController = new SharedItemsBetweenUsersController();
const viewerSharedItemsController = new ViewerSharedItemsController();
const updateViewSharedItemsController = new UpdateViewSharedItemsController();
const sharedItemsToUserController = new SharedItemsToUserController();

sharedItemsRouter.get('/:id', ensureAuthenticated, viewerSharedItemsController.handle);
sharedItemsRouter.get('/', ensureAuthenticated, sharedItemsToUserController.handle);
sharedItemsRouter.post('/', ensureAuthenticated, sharedItemsBetweenUsersController.handle);
sharedItemsRouter.patch('/', ensureAuthenticated, updateViewSharedItemsController.handle);
