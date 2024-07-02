import { inject, injectable } from 'inversify';

import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { generateConfirmationToken } from '@Applications/Services/email/GenerateConfirmationToken';
import { AppError } from '@Domain/Exceptions/AppError';
import { addEmailToQueue } from '@Jobs/producer';


@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(email: string) : Promise<void> {
    try {
      const findUser = await this.usersRepository.checkEmailAlreadyExist(email);
      if (!findUser) {
        throw new AppError('The email does not exists.Please check if address email exists!', 404);
      }

      const token = generateConfirmationToken(findUser.id);

      addEmailToQueue({
        email: findUser.email, name: findUser.name, token, method: 'Forgot Password',
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('Unexpected server error!', 500);
    }
  }
}
