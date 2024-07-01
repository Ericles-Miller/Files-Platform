import { Container } from 'inversify';

import { IRefreshTokenRepository } from '@Applications/Interfaces/auth/IRefreshTokenRepository';
import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { ISharedItemsRepository } from '@Applications/Interfaces/repositories/ISharedItemsRepository';
import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { GenerateRefreshToken } from '@Applications/Services/auth/middlewares/GenerateRefreshToken';
import { AuthenticateUserUseCase } from '@Applications/UseCases/auth/AuthenticatedUseCase';
import { LogoutUserUseCase } from '@Applications/UseCases/auth/LogoutUserUseCase';
import { RefreshTokenUserUseCase } from '@Applications/UseCases/auth/RefreshTokenUserUseCase';
import { ConfirmEmailUseCase } from '@Applications/UseCases/email/ConfirmEmailUseCase';
import { CreateFilesUseCase } from '@Applications/UseCases/files/CreateFilesUseCase';
import { DeleteFilesUseCase } from '@Applications/UseCases/files/DeleteFilesUseCase';
import { DownloadFilesUseCase } from '@Applications/UseCases/files/DownloadFilesUseCase';
import { FindFilesChildrenUseCase } from '@Applications/UseCases/files/FindFilesChildrenUseCase';
import { SearchFilesByNameUseCase } from '@Applications/UseCases/files/SearchFilesByNameUseCase';
import { CalcSizeFoldersUseCase } from '@Applications/UseCases/folders/CalcSizeFoldersUseCase';
import { CreateFolderUseCase } from '@Applications/UseCases/folders/CreateFolderUseCase';
import { DeleteFolderUseCase } from '@Applications/UseCases/folders/DeleteFolderUseCase';
import { DownloadFolderUseCase } from '@Applications/UseCases/folders/DownloadFolderUseCase';
import { FindFoldersChildrenUseCase } from '@Applications/UseCases/folders/FindFoldersChildrenUseCase';
import { ListAllFoldersToUserUseCase } from '@Applications/UseCases/folders/ListAllFoldersToUserUseCase';
import { SearchFolderByNameUseCase } from '@Applications/UseCases/folders/SearchFolderByNameUseCase';
import { UpdateFolderUseCase } from '@Applications/UseCases/folders/UpdateFolderUseCase';
import { UploadFolderUseCase } from '@Applications/UseCases/folders/UploadFolderUseCase';
import { SearchFolderUseCase } from '@Applications/UseCases/shared/SearchFolderUseCase';
import { SharedItemsBetweenUsersUseCase } from '@Applications/UseCases/sharedItems/SharedItemsBetweenUsersUseCase';
import { ViewerSharedItemsUseCase } from '@Applications/UseCases/sharedItems/ViewerItemSharedUseCase';
import { CreateUserUseCase } from '@Applications/UseCases/users/CreateUserUseCase';
import { DeleteUserUseCase } from '@Applications/UseCases/users/DeleteUserUseCase';
import { ListUsersUseCase } from '@Applications/UseCases/users/ListUserUseCase';
import { UpdateUserUseCase } from '@Applications/UseCases/users/UpdateUserUseCase';
import { prisma } from '@Infra/Database/database';
import { RefreshTokenRepository } from '@Infra/repositories/auth/RefreshTokenRepository';
import { FilesRepository } from '@Infra/repositories/FilesRepository';
import { FoldersRepository } from '@Infra/repositories/FoldersRepository';
import { BaseRepository } from '@Infra/repositories/shared/BaseRepository';
import { SharedItemsRepository } from '@Infra/repositories/SharedItemsRepository';
import { UsersRepository } from '@Infra/repositories/UsersRepository';
import {
  Files, Folders, PrismaClient, RefreshTokens, SharedItems, Users,
} from '@prisma/client';

export const container = new Container();

/// context
container.bind<BaseRepository<Users>>('UsersRepository').to(UsersRepository);
container.bind<BaseRepository<Folders>>('FoldersRepository').to(FoldersRepository);
container.bind<BaseRepository<Files>>('FilesRepository').to(FilesRepository);
container.bind<BaseRepository<RefreshTokens>>('RefreshTokenRepository').to(RefreshTokenRepository);
container.bind<BaseRepository<SharedItems>>('SharedItemsRepository').to(SharedItemsRepository);
container.bind<PrismaClient>('PrismaClient').toConstantValue(prisma);

/// interfaces
container.bind<IUsersRepository>(UsersRepository).toSelf().inSingletonScope();
container.bind<IFoldersRepository>(FoldersRepository).toSelf().inSingletonScope();
container.bind<IFilesRepository>(FilesRepository).toSelf().inSingletonScope();
container.bind<IRefreshTokenRepository>(RefreshTokenRepository).toSelf().inSingletonScope();
container.bind<ISharedItemsRepository>(SharedItemsRepository).toSelf().inSingletonScope();

/// users
container.bind<ListUsersUseCase>(ListUsersUseCase).toSelf();
container.bind<CreateUserUseCase>(CreateUserUseCase).toSelf();
container.bind<UpdateUserUseCase>(UpdateUserUseCase).toSelf();
container.bind<DeleteUserUseCase>(DeleteUserUseCase).toSelf();

/// folders
container.bind<CalcSizeFoldersUseCase>(CalcSizeFoldersUseCase).toSelf();

container.bind<CreateFolderUseCase>(CreateFolderUseCase).toSelf();
container.bind<UpdateFolderUseCase>(UpdateFolderUseCase).toSelf();
container.bind<ListAllFoldersToUserUseCase>(ListAllFoldersToUserUseCase).toSelf();
container.bind<FindFoldersChildrenUseCase>(FindFoldersChildrenUseCase).toSelf();
container.bind<SearchFolderByNameUseCase>(SearchFolderByNameUseCase).toSelf();
container.bind<SearchFolderUseCase>(SearchFolderUseCase).toSelf();
container.bind<DeleteFolderUseCase>(DeleteFolderUseCase).toSelf();
container.bind<DownloadFolderUseCase>(DownloadFolderUseCase).toSelf();
container.bind<UploadFolderUseCase>(UploadFolderUseCase).toSelf();

/// files
container.bind<CreateFilesUseCase>(CreateFilesUseCase).toSelf();
container.bind<FindFilesChildrenUseCase>(FindFilesChildrenUseCase).toSelf();
container.bind<SearchFilesByNameUseCase>(SearchFilesByNameUseCase).toSelf();
container.bind<DeleteFilesUseCase>(DeleteFilesUseCase).toSelf();
container.bind<DownloadFilesUseCase>(DownloadFilesUseCase).toSelf();


/// refreshToken
container.bind<AuthenticateUserUseCase>(AuthenticateUserUseCase).toSelf();
container.bind<GenerateRefreshToken>(GenerateRefreshToken).toSelf();
container.bind<RefreshTokenUserUseCase>(RefreshTokenUserUseCase).toSelf();
container.bind<ConfirmEmailUseCase>(ConfirmEmailUseCase).toSelf();
container.bind<LogoutUserUseCase>(LogoutUserUseCase).toSelf();

/// shared Items
container.bind<SharedItemsBetweenUsersUseCase>(SharedItemsBetweenUsersUseCase).toSelf();
container.bind<ViewerSharedItemsUseCase>(ViewerSharedItemsUseCase).toSelf();
