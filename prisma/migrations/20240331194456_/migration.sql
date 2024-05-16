-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "updateAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updatedAt" DROP NOT NULL;
