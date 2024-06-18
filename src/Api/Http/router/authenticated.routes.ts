import { Router } from 'express';

import { AuthenticateUserController } from '@Api/Controllers/auth/AuthenticatedUserController';
import { RefreshTokenUserController } from '@Api/Controllers/auth/RefreshTokenUserController';

export const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenUserController();

authenticateRoutes.post('/refreshToken', refreshTokenController.handle);
authenticateRoutes.post('/user', authenticateUserController.handle);
