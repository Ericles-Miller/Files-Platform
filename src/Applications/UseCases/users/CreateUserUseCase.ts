import { inject, injectable } from 'inversify';

import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { s3 } from '@Applications/Services/awsS3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { User } from '@Domain/Entities/User';
import { AppError } from '@Domain/Exceptions/AppError';
import { IRequestDTO } from '@Infra/DTOs/users/IRequestDTO';


@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    email, name, password, file,
  }: IRequestDTO) : Promise<void> {
    try {
      const userAlreadyExists = await this.usersRepository.checkEmailAlreadyExist(email);
      if (userAlreadyExists) {
        throw new AppError('User already exists with email!', 400);
      }

      const user = new User(name, email, password, null);

      if (file) {
        await s3.send(new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        }));

        user.setAvatar(file.originalname);
        user.setFileName(file.originalname);
      }

      await user.setPassword(user.password);
      await this.usersRepository.create(user);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError(`Unexpected server error!`, 500);
    }
  }
}
