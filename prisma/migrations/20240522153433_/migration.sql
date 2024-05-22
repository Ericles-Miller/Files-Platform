/*
  Warnings:

  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_dadId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_folderId_fkey";

-- DropTable
DROP TABLE "Folder";

-- CreateTable
CREATE TABLE "Folders" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "size" DOUBLE PRECISION NOT NULL,
    "dadId" TEXT,

    CONSTRAINT "Folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_dadId_fkey" FOREIGN KEY ("dadId") REFERENCES "Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
