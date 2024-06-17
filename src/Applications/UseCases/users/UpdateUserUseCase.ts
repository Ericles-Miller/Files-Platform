import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { User } from '@Domain/Entities/User';
import { AppError } from '@Domain/Exceptions/AppError';
import { IUpdateUserFileDTO } from '@Infra/DTOs/users/IUpdateUserFileDTO';
import { inject, injectable } from 'inversify';
import {PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';
import { Users } from '@prisma/client';
import { s3 } from '@Applications/Services/awsS3';
import { validationsFields } from '@Applications/Services/users/validateFields';

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ enable, id, name, password, file }: IUpdateUserFileDTO) : Promise<void> {
    try { 
      validationsFields({ name, password });
      const findUser: Users = await this.usersRepository.findById(id);
      if(!findUser) {
        throw new AppError('UserId does not exists!', 404);
      }    

      const user = new User(name, findUser.email, password, id);
      
      if(findUser.fileName) {
        try {
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: findUser.fileName,
          }))
        } catch (error) {
          console.log('The image is not in the cloud');
        }
      }

      if(file) {
        await s3.send(new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: `/root/${user.id}/avatars/file.originalname`,
          Body: file.buffer,
          ContentType: file.mimetype
        }));
        
        user.setAvatar(file.originalname);
        user.setFileName(file.originalname);
      }
      
      await user.setPassword(user.password);
      if(enable === 'true') {
        user.enable = true;
      } 

      else if(enable === 'false') {
        user.enable = false;
      } else {
        throw new AppError('Value invalid to field enable!', 400);
      }

      user.update(user);
      await this.usersRepository.update(id, user);
    
    } catch (error) {
      if(error instanceof AppError) {
        throw error
      }
      
      console.log(error);
      throw new AppError(`Unexpected server error!`, 500);
    }
  }
}



