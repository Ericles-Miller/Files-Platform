import { Router } from 'express';

import { filesRouters } from './files.routes';
import { foldersRoutes } from './folders.routes';
import { usersRoutes } from './users.routes';
import { authenticateRoutes } from './authenticated.routes';


export const router = Router();

router.use('/users', usersRoutes);
router.use('/folders', foldersRoutes);
router.use('/files', filesRouters);
router.use('/sessions', authenticateRoutes);
