-- CreateTable
CREATE TABLE "sharedItems" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileId" TEXT,
    "folderId" TEXT,
    "sharedWithUserId" TEXT NOT NULL,

    CONSTRAINT "sharedItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sharedItems_fileId_folderId_sharedWithUserId_key" ON "sharedItems"("fileId", "folderId", "sharedWithUserId");

-- AddForeignKey
ALTER TABLE "sharedItems" ADD CONSTRAINT "sharedItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sharedItems" ADD CONSTRAINT "sharedItems_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sharedItems" ADD CONSTRAINT "sharedItems_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
