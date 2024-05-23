import { IChildrenRepository } from "@Applications/Interfaces/IChildrenRepository";
import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { IUsersRepository } from "@Applications/Interfaces/IUsersRepository";
import { CreateFolderUseCase } from "@Applications/UseCases/folders/CreateFolderUseCase";
import { CreateUserUseCase } from "@Applications/UseCases/users/CreateUserUseCase";
import { DeleteUserUseCase } from "@Applications/UseCases/users/DeleteUserUseCase";
import { ListUsersUseCase } from "@Applications/UseCases/users/ListUserUseCase";
import { UpdateUserUseCase } from "@Applications/UseCases/users/UpdateUserUseCase";
import { prisma } from "@Infra/Database/database";
import { ChildrenRepository } from "@Infra/repositories/ChildrenRepository";
import { FoldersRepository } from "@Infra/repositories/FoldersRepository";
import { BaseRepository } from "@Infra/repositories/shared/BaseRepository";
import { UsersRepository } from "@Infra/repositories/UsersRepository";
import { Children, Folders, PrismaClient, Users } from "@prisma/client";
import { Container } from "inversify";

export const container = new Container();

/// context
container.bind<BaseRepository<Users>>('UsersRepository').to(UsersRepository);
container.bind<BaseRepository<Folders>>('FoldersRepository').to(FoldersRepository);
container.bind<BaseRepository<Children>>('ChildrenRepository').to(ChildrenRepository);
container.bind<PrismaClient>('PrismaClient').toConstantValue(prisma);

/// interfaces 
container.bind<IUsersRepository>(UsersRepository).toSelf().inSingletonScope();
container.bind<IFoldersRepository>(FoldersRepository).toSelf().inSingletonScope();
container.bind<IChildrenRepository>(ChildrenRepository).toSelf().inSingletonScope();
/// users
container.bind<ListUsersUseCase>(ListUsersUseCase).toSelf();
container.bind<CreateUserUseCase>(CreateUserUseCase).toSelf();
container.bind<UpdateUserUseCase>(UpdateUserUseCase).toSelf(); 
container.bind<DeleteUserUseCase>(DeleteUserUseCase).toSelf(); 

/// folders
container.bind<CreateFolderUseCase>(CreateFolderUseCase).toSelf();

///children

