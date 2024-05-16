/*
  Warnings:

  - Added the required column `enable` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enable` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "enable" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "enable" BOOLEAN NOT NULL;
