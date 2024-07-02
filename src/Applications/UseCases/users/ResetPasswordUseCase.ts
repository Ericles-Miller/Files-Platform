import { inject, injectable } from 'inversify';
import { verify } from 'jsonwebtoken';

import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { validationsFields } from '@Applications/Services/users/validateFields';
import { User } from '@Domain/Entities/User';
import { AppError } from '@Domain/Exceptions/AppError';
import { Users } from '@prisma/client';

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(email: string, password: string, confirmPassword: string): Promise<void> {
    if (!process.env.JWT_SECRET_NEW_USER) {
      throw new AppError('The JWT_SECRET_NEW_USER is null. Please the set secret key to development variable', 404);
    }

    const findUser = await this.usersRepository.checkEmailAlreadyExist(email);
    if (!findUser) {
      throw new AppError('The email is incorrect or user does not exists!', 404);
    }

    if (password !== confirmPassword) {
      throw new AppError('The password field does no same equals!', 400);
    }

    validationsFields({ name: findUser.name, password, email });

    const user = new User(findUser.name, findUser.email, password, findUser.id);

    await user.setPassword(user.password);

    await this.usersRepository.update(findUser.id, user);
  }

  async getReset(token: string): Promise<boolean> {
    try {
      if (!process.env.JWT_SECRET_NEW_USER) {
        throw new AppError('The JWT_SECRET_NEW_USER is null. Please the set secret key to development variable', 404);
      }
      const payload: any = verify(token, process.env.JWT_SECRET_NEW_USER);
      const { userId } = payload;

      const user: Users = await this.usersRepository.findById(userId);

      if (!user) {
        throw new AppError('The userId does not exists or does not belongs to user', 404);
      }

      return true;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.log(error);
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
