import { Router } from 'express';

import { authenticateRoutes } from './authenticated.routes';
import { filesRouters } from './files.routes';
import { foldersRoutes } from './folders.routes';
import { usersRoutes } from './users.routes';

export const router = Router();

router.use('/users', usersRoutes);
router.use('/folders', foldersRoutes);
router.use('/files', filesRouters);
router.use('/sessions', authenticateRoutes);
