/* eslint-disable import-helpers/order-imports */
import { Router } from 'express';

import { filesRouters } from './files.routes';
import { foldersRoutes } from './folders.routes';
import { authenticateRoutes } from './authenticated.routes';
import { usersRoutes } from './users.routes';
import { sharedItemsRouter } from './sharedItems.routes';

export const router = Router();

router.use('/users', usersRoutes);
router.use('/folders', foldersRoutes);
router.use('/files', filesRouters);
router.use('/auth', authenticateRoutes);
router.use('/sharedItems', sharedItemsRouter);
