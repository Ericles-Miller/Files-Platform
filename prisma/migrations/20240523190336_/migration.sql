/*
  Warnings:

  - Made the column `size` on table `folders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "folders" ALTER COLUMN "size" SET NOT NULL;
