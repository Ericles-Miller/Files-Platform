import { IRefreshTokenRepository } from "@Applications/Interfaces/auth/IRefreshTokenRepository";
import { IFilesRepository } from "@Applications/Interfaces/IFilesRepository";
import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { IUsersRepository } from "@Applications/Interfaces/IUsersRepository";
import { GenerateRefreshToken } from "@Applications/Services/auth/middlewares/GenerateRefreshToken";
import { AuthenticateUserUseCase } from "@Applications/UseCases/auth/AuthenticatedUseCase";
import { RefreshTokenUserUseCase } from "@Applications/UseCases/auth/RefreshTokenUserUseCase";
import { CreateFilesUseCase } from "@Applications/UseCases/files/CreateFilesUseCase";
import { DeleteFilesUseCase } from "@Applications/UseCases/files/DeleteFilesUseCase";
import { DownloadFilesUseCase } from "@Applications/UseCases/files/DownloadFilesUseCase";
import { FindFilesChildrenUseCase } from "@Applications/UseCases/files/FindFilesChildrenUseCase";
import { SearchFilesByNameUseCase } from "@Applications/UseCases/files/SearchFilesByNameUseCase";
import { CalcSizeFoldersUseCase } from "@Applications/UseCases/folders/CalcSizeFoldersUseCase";
import { CreateFolderUseCase } from "@Applications/UseCases/folders/CreateFolderUseCase";
import { DeleteFolderUseCase } from "@Applications/UseCases/folders/DeleteFolderUseCase";
import { FindFoldersChildrenUseCase } from "@Applications/UseCases/folders/FindFoldersChildrenUseCase";
import { ListAllFoldersToUserUseCase } from "@Applications/UseCases/folders/ListAllFoldersToUserUseCase";
import { SearchFolderByNameUseCase } from "@Applications/UseCases/folders/SearchFolderByNameUseCase";
import { UpdateFolderUseCase } from "@Applications/UseCases/folders/UpdateFolderUseCase";
import { SearchFolderUseCase } from "@Applications/UseCases/shared/SearchFolderUseCase";
import { CreateUserUseCase } from "@Applications/UseCases/users/CreateUserUseCase";
import { DeleteUserUseCase } from "@Applications/UseCases/users/DeleteUserUseCase";
import { ListUsersUseCase } from "@Applications/UseCases/users/ListUserUseCase";
import { UpdateUserUseCase } from "@Applications/UseCases/users/UpdateUserUseCase";
import { prisma } from "@Infra/Database/database";
import { RefreshTokenRepository } from "@Infra/repositories/auth/RefreshTokenRepository";
import { FilesRepository } from "@Infra/repositories/FilesRepository";
import { FoldersRepository } from "@Infra/repositories/FoldersRepository";
import { BaseRepository } from "@Infra/repositories/shared/BaseRepository";
import { UsersRepository } from "@Infra/repositories/UsersRepository";
import { Files, Folders, PrismaClient, RefreshTokens, Users } from "@prisma/client";
import { Container } from "inversify";

export const container = new Container();

/// context
container.bind<BaseRepository<Users>>('UsersRepository').to(UsersRepository);
container.bind<BaseRepository<Folders>>('FoldersRepository').to(FoldersRepository);
container.bind<BaseRepository<Files>>('FilesRepository').to(FilesRepository);
container.bind<BaseRepository<RefreshTokens>>('RefreshTokenRepository').to(RefreshTokenRepository);
container.bind<PrismaClient>('PrismaClient').toConstantValue(prisma);

/// interfaces 
container.bind<IUsersRepository>(UsersRepository).toSelf().inSingletonScope();
container.bind<IFoldersRepository>(FoldersRepository).toSelf().inSingletonScope();
container.bind<IFilesRepository>(FilesRepository).toSelf().inSingletonScope();
container.bind<IRefreshTokenRepository>(RefreshTokenRepository).toSelf().inSingletonScope();

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

///files
container.bind<CreateFilesUseCase>(CreateFilesUseCase).toSelf();
container.bind<FindFilesChildrenUseCase>(FindFilesChildrenUseCase).toSelf();
container.bind<SearchFilesByNameUseCase>(SearchFilesByNameUseCase).toSelf();
container.bind<DeleteFilesUseCase>(DeleteFilesUseCase).toSelf();
container.bind<DownloadFilesUseCase>(DownloadFilesUseCase).toSelf();

/// refreshToken
container.bind<AuthenticateUserUseCase>(AuthenticateUserUseCase).toSelf();
container.bind<GenerateRefreshToken>(GenerateRefreshToken).toSelf();
container.bind<RefreshTokenUserUseCase>(RefreshTokenUserUseCase).toSelf();

