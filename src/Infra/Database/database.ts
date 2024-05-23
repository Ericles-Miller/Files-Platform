import { Files, PrismaClient, Users, Folders, RefreshTokens, Children } from "@prisma/client";


export const {users, files, folders, refreshTokens } = new PrismaClient();

export type RepositoryType<T> = T extends Users
  ? PrismaClient['users']
  : T extends Files
  ? PrismaClient['files']
  : T extends Folders
  ? PrismaClient['folders']
  : T extends RefreshTokens
  ? PrismaClient['refreshTokens']
  : T extends Children
  ? PrismaClient['children']
  : never;

export const prisma = new PrismaClient();
