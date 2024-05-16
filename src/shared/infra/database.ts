import { Comments, Posts, PrismaClient, Users } from "@prisma/client";


export const {users, posts, comments } = new PrismaClient();

export type RepositoryType<T> = T extends Users
  ? PrismaClient['users']
  : T extends Posts
  ? PrismaClient['posts']
  : T extends Comments
  ? PrismaClient['comments']
  : never;

export const prisma = new PrismaClient();
