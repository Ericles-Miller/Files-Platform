import { AuthenticateUserController } from "@Api/Controllers/auth/AuthenticatedUserController";
import { RefreshTokenUserController } from "@Api/Controllers/auth/RefreshTokenUserController";
import { Router } from "express";

export const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenUserController();

authenticateRoutes.post('/refreshToken', refreshTokenController.handle);
authenticateRoutes.post("/user", authenticateUserController.handle);
