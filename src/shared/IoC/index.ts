import { CreateUserUseCase } from "@controllers/createUser/CreateUserUseCase";
import { ListUsersUseCase } from "@controllers/ListUser/ListUserUseCase";
import { PrismaClient, Users } from "@prisma/client";
import { BaseRepository } from "@repositories/BaseRepository";
import { IUsersRepository } from "@repositories/IUsersRepository";
import { UsersRepository } from "@repositories/UsersRepository";
import { prisma } from "@shared/infra/database";
import { Container } from "inversify";

export const container = new Container();

container.bind<IUsersRepository>(UsersRepository).toSelf().inSingletonScope();
container.bind<BaseRepository<Users>>('UsersRepository').to(UsersRepository)
//container.bind<BaseRepository<Posts>>('PostRepository').to(PostRepository)
container.bind<PrismaClient>('PrismaClient').toConstantValue(prisma);

container.bind<ListUsersUseCase>(ListUsersUseCase).toSelf()
container.bind<CreateUserUseCase>(CreateUserUseCase).toSelf()