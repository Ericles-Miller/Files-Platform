import { IUsersRepository } from "@Applications/Interfaces/users/IUsersRepository";
import { User } from "@Domain/Entities/User";
import { AppError } from "@Domain/Exceptions/AppError";
import { IUpdateUserFileDTO } from "@Infra/DTOs/users/IUpdateUserFileDTO";
import { inject, injectable } from "inversify";
import {PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';
import { Users } from "@prisma/client";
import { s3 } from "@Applications/Services/awsS3";

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ enable, id, name, password, file}: IUpdateUserFileDTO) : Promise<void> {
    try {  
      const findUser: Users = await this.usersRepository.findById(id);
      if(!findUser) {
        throw new AppError('UserId does not exists', 404);
      }
      
      const user = new User(name, findUser.email, password, id);
      
      if(file && findUser.fileName) {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: findUser.fileName,
        }))

        await s3.send(new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype
        }));
        user.setAvatar(file.originalname);
        user.setFileName(file.originalname);
      }
      
      user.enable = enable;
      user.update(user);
      
      await this.usersRepository.update(id, user);
    } catch (error) {
      if(error instanceof AppError) throw error

      throw new AppError(`${error}`, 500);
    }
  }
}



