BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[posts] (
    [id] NVARCHAR(1000) NOT NULL,
    [displayName] NVARCHAR(1000) NOT NULL,
    [displayCover] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [posts_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updateAt] DATETIME2 CONSTRAINT [posts_updateAt_df] DEFAULT CURRENT_TIMESTAMP,
    [description] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [posts_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [posts_displayName_key] UNIQUE NONCLUSTERED ([displayName])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 CONSTRAINT [users_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [enable] BIT NOT NULL,
    [avatar] NVARCHAR(1000),
    [fileName] NVARCHAR(1000),
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Comments] (
    [id] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [postsId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Comments_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Comments] ADD CONSTRAINT [Comments_postsId_fkey] FOREIGN KEY ([postsId]) REFERENCES [dbo].[posts]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
