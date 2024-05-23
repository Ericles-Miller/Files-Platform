/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `folders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "folders_path_key" ON "folders"("path");
