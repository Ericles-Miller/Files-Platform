import { IUsersRepository } from "@Applications/Interfaces/users/IUsersRepository";
import { IListUsersDTO } from "@Infra/DTOs/users/IListUsersDto";
import { inject, injectable } from "inversify";

@injectable()
export class ListUsersUseCase { 
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute() : Promise<IListUsersDTO[]> {
    const users = await this.usersRepository.listAll();

    const listAllUsers = users.map((user) => {
      const listUser : IListUsersDTO = {
        id: user.id,
        createdAt: user.createdAt,
        email: user.email,
        enable: user.enable,
        updatedAt: user.updatedAt,
        name: user.name,
        avatar: user.avatar
      }
      return listUser
    })

    return listAllUsers;
  }
}