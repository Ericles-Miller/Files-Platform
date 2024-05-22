/*
  Warnings:

  - You are about to drop the column `usersId` on the `Folders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Folders" DROP CONSTRAINT "Folders_usersId_fkey";

-- AlterTable
ALTER TABLE "Folders" DROP COLUMN "usersId",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
