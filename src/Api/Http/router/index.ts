import { Router } from "express";
import { usersRoutes } from "./users.routes";
import { foldersRoutes } from "./folders.routes";
import { filesRouters } from "./files.routes";
import { authenticateRoutes } from "./authenticated.routes";

export const router = Router();

router.use('/users', usersRoutes);
router.use('/folders', foldersRoutes);
router.use('/files', filesRouters);
router.use("/sessions", authenticateRoutes);
