import { User } from "@entities/User";
import { Users } from "@prisma/client";
import { IUsersRepository } from "@repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "inversify";

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}


@injectable()
export class UsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async create({email, name,password }: IRequestDTO) : Promise<void> {    
    
    const userAlreadyExists = await this.usersRepository.checkEmailAlreadyExist(email);
        
    if(userAlreadyExists) {
      throw new AppError('user already exists with email!', 400);
    }
    
    const user = new User(name, email, password);    
    await this.usersRepository.create(user);
  }

  async list(): Promise<Users[]> {
    const users = await this.usersRepository.listAll();

    return users;
  }
}