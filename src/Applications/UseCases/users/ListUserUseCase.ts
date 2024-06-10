import { IUsersRepository } from '@Applications/Interfaces/repositories/IUsersRepository';
import { IListUsersDTO } from '@Infra/DTOs/users/IListUsersDto';
import { inject, injectable } from 'inversify';
import {GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import { s3 } from '@Applications/Services/awsS3';
import { AppError } from '@Domain/Exceptions/AppError';


@injectable()
export class ListUsersUseCase { 
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute() : Promise<IListUsersDTO[]> {
    try {
      const users = await this.usersRepository.listAll();

      const listAllUsers = Promise.all(users.map(async (user) => {
        if(user.avatar) {
          const getAvatar = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: user.avatar,
          });
    
          const url = await getSignedUrl(s3, getAvatar, {expiresIn : 3600});
          const listUser : IListUsersDTO = {
            id: user.id,
            createdAt: user.createdAt,
            email: user.email,
            enable: user.enable,
            updatedAt: user.updatedAt,
            name: user.name,
            avatar: url
          }
          return listUser
        }

        const listUser : IListUsersDTO = {
          id: user.id,
          createdAt: user.createdAt,
          email: user.email,
          enable: user.enable,
          updatedAt: user.updatedAt,
          name: user.name,
          avatar: ''
        };

        return listUser
      }))

      return listAllUsers;
    } catch (error) {
      if(error instanceof AppError) {
        throw error
      }
      console.log(error);
      throw new AppError(`Unexpected server error!`, 500);
    }
  }
}