-- AlterTable
ALTER TABLE "refreshTokens" ADD COLUMN     "revoked" BOOLEAN NOT NULL DEFAULT false;
