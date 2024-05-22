import { Router } from "express";
import { usersRoutes } from "./users.routes";
import { foldersRoutes } from "./folders.routes";

export const router = Router();

router.use('/users', usersRoutes);
router.use('/folders', foldersRoutes);
