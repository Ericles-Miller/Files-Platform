import { IUsersRepository } from "@Applications/Interfaces/users/IUsersRepository";
import { CreateUserUseCase } from "@Applications/UseCases/users/CreateUserUseCase";
import { ListUsersUseCase } from "@Applications/UseCases/users/ListUserUseCase";
import { prisma } from "@Infra/Data/database";
import { BaseRepository } from "@Infra/repositories/BaseRepository";
import { UsersRepository } from "@Infra/repositories/UsersRepository";
import { PrismaClient, Users } from "@prisma/client";
import { Container } from "inversify";

export const container = new Container();

container.bind<IUsersRepository>(UsersRepository).toSelf().inSingletonScope();
container.bind<BaseRepository<Users>>('UsersRepository').to(UsersRepository)
//container.bind<BaseRepository<Posts>>('PostRepository').to(PostRepository)
container.bind<PrismaClient>('PrismaClient').toConstantValue(prisma);

container.bind<ListUsersUseCase>(ListUsersUseCase).toSelf()
container.bind<CreateUserUseCase>(CreateUserUseCase).toSelf()