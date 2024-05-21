import { inject, injectable } from "inversify";
import { User } from "Domain/Entities/User";
import { IUsersRepository } from "@Applications/Interfaces/users/IUsersRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { IRequestDTO } from "@Infra/DTOs/users/IRequestDTO";


@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({email, name,password }: IRequestDTO) : Promise<void> {    
    const userAlreadyExists = await this.usersRepository.checkEmailAlreadyExist(email);
        
    if(userAlreadyExists) {
      throw new AppError('user already exists with email!', 400);
    }
    
    const user = new User(name, email, password);    
    await this.usersRepository.create(user);
  }
}