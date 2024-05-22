/*
  Warnings:

  - You are about to drop the column `parentId` on the `folders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_parentId_fkey";

-- AlterTable
ALTER TABLE "folders" DROP COLUMN "parentId";

-- CreateTable
CREATE TABLE "children" (
    "id" TEXT NOT NULL,
    "folderId" TEXT,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
