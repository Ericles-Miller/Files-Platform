/*
  Warnings:

  - Added the required column `fileName` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "files_displayName_key";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "fileName" TEXT NOT NULL;
