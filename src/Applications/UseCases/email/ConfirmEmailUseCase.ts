import { inject, injectable } from 'inversify';
import { verify } from 'jsonwebtoken';

import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { AppError } from '@Domain/Exceptions/AppError';
import { Users } from '@prisma/client';

@injectable()
export class ConfirmEmailUseCase {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  async execute(token: string) : Promise<void> {
    try {
      if (!process.env.JWT_SECRET_NEW_USER) {
        throw new AppError('The JWT_SECRET_NEW_USER is null. Please the set secret key to development variable', 404);
      }
      const payload: any = verify(token, process.env.JWT_SECRET_NEW_USER);
      const { userId } = payload;

      const userIsValid: Users = await this.usersRepository.findById(userId);
      if (!userIsValid) {
        throw new AppError('User is invalid or does not confirm the account in email', 404);
      }

      await this.usersRepository.setUserTrue(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;

      console.log(error);
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
