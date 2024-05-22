/*
  Warnings:

  - A unique constraint covering the columns `[displayName]` on the table `Folders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Folders_displayName_key" ON "Folders"("displayName");
