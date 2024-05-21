/*
  Warnings:

  - You are about to drop the column `author` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `enable` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `posts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[displayName]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayCover` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[posts] DROP COLUMN [author],
[enable],
[title];
ALTER TABLE [dbo].[posts] ADD [description] NVARCHAR(1000) NOT NULL,
[displayCover] NVARCHAR(1000) NOT NULL,
[displayName] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[posts] ADD CONSTRAINT [posts_displayName_key] UNIQUE NONCLUSTERED ([displayName]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
