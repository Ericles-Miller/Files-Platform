import { Router } from 'express';

import { AuthenticateUserController } from '@Api/Controllers/auth/AuthenticatedUserController';
import { RefreshTokenUserController } from '@Api/Controllers/auth/RefreshTokenUserController';
import { ConfirmEmailController } from '@Api/Controllers/email/ConfirmEmailController';

export const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenUserController();
const confirmEmailController = new ConfirmEmailController();

authenticateRoutes.post('/refreshToken', refreshTokenController.handle);
authenticateRoutes.post('/user', authenticateUserController.handle);
authenticateRoutes.get('accountsConfirm/:token', confirmEmailController.handle);
