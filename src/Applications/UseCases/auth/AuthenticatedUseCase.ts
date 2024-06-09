import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { GenerateRefreshToken } from '@Applications/Services/auth/middlewares/GenerateRefreshToken';
import { GenerateTokenProvider } from '@Applications/Services/auth/middlewares/GenerateTokenProvider';
import { AppError } from '@Domain/Exceptions/AppError';
import { container } from '@IoC/index';
import { compare } from 'bcryptjs';
import { inject, injectable } from 'inversify';

interface IResponse {
  refreshToken: {
    id: string;
    expiresIn: number;
    userId: string;
  },
  token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(email: string, password: string): Promise<IResponse> {
    try {
      const user = await this.usersRepository.checkEmailAlreadyExist(email);
      if (!user) {
        throw new AppError('Email or password is incorrect!', 404);
      }

      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) {
        throw new AppError('Email or password is incorrect!', 404);
      }

      const generateTokenProvider = new GenerateTokenProvider();
      const token = await generateTokenProvider.execute(user.id);

      const generateRefreshToken =  container.get(GenerateRefreshToken);
      const refreshToken = await generateRefreshToken.execute(user.id);
      
      return { token, refreshToken };
    } catch (error) {
      if(error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('Unexpected server error!', 500); 
    }
  }
}