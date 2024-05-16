import { Users } from "@prisma/client";
import { IUsersRepository } from "@repositories/IUsersRepository";
import { inject, injectable } from "inversify";

export interface IListUsers {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
  enable: boolean;
}

@injectable()
export class ListUsersUseCase { 
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute() : Promise<IListUsers[]> {
    const users = await this.usersRepository.listAll();

    const listAllUsers = users.map((user) => {
      const listUser : IListUsers = {
        id: user.id,
        createdAt: user.createdAt,
        email: user.email,
        enable: user.enable,
        updatedAt: user.updatedAt,
        name: user.name
      }
      return listUser
    })

    return listAllUsers;
  }
}