import { inject, injectable } from "inversify";
import { User } from "Domain/Entities/User";
import { IUsersRepository } from "@Applications/Interfaces/users/IUsersRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { IRequestDTO } from "@Infra/DTOs/users/IRequestDTO";
import {PutObjectCommand ,S3} from '@aws-sdk/client-s3';
import { s3 } from "Jobs/AwsS3";


@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({email, name, password, file }: IRequestDTO) : Promise<void> {    
    try {
      const userAlreadyExists = await this.usersRepository.checkEmailAlreadyExist(email);
      if(userAlreadyExists) {
        throw new AppError('user already exists with email!', 400);
      }

      if(file) { 
        await s3.send(new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: file.originalname,
          Body:file.buffer,
          ContentType: file.mimetype,
        }));
        
        const user = new User(name, email, password, file.filename); 
        await this.usersRepository.create(user);   
  
      } else {
        const user = new User(name, email, password, null );
        await this.usersRepository.create(user);
      }
    } catch (error) {
      if(error instanceof AppError) {
        throw error
      }
      throw new AppError(`${error}`, 500);
    }
  }
}