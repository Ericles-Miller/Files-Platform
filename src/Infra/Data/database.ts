import { Comments, Files, PrismaClient, Users } from "@prisma/client";


export const {users, files, comments } = new PrismaClient();

export type RepositoryType<T> = T extends Users
  ? PrismaClient['users']
  : T extends Files
  ? PrismaClient['files']
  : T extends Comments
  ? PrismaClient['comments']
  : never;

export const prisma = new PrismaClient();
