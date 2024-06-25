import { Router } from 'express';

import { AuthenticateUserController } from '@Api/Controllers/auth/AuthenticatedUserController';
import { RefreshTokenUserController } from '@Api/Controllers/auth/RefreshTokenUserController';
import { ConfirmEmailController } from '@Api/Controllers/email/ConfirmEmailController';
import { ForgotPasswordController } from '@Api/Controllers/email/ForgotPasswordController';
import { ResetPasswordController } from '@Api/Controllers/email/ResetPasswordController';

export const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenUserController();
const confirmEmailController = new ConfirmEmailController();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

authenticateRoutes.post('/refreshToken', refreshTokenController.handle);
authenticateRoutes.post('/user', authenticateUserController.handle);
authenticateRoutes.patch('/resetPassword', resetPasswordController.handle);
authenticateRoutes.get('/resetPassword/:token', resetPasswordController.getResetPassword);
authenticateRoutes.get('/accountsConfirm/:token', confirmEmailController.handle);
authenticateRoutes.get('/forgotPassword/:email', forgotPasswordController.handle);
