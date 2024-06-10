import { IUsersRepository } from "@Applications/Interfaces/repositories/IUsersRepository";
import { AppError } from "@Domain/Exceptions/AppError";
import { Users } from "@prisma/client";
import { inject, injectable } from "inversify";
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from "@Applications/Services/awsS3";

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {} 

  async execute(userId: string) : Promise<void> {
    try {
      const user: Users = await this.usersRepository.findById(userId);
      if(!user) {
        throw new AppError('UserId does not exists', 404);
      }
  
      if(user.fileName) {
        try {
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: user.fileName,
          }));
        } catch (error) {
          console.log('File does not exists in cloud');
        }
      }
  
      await this.usersRepository.delete(userId);
    } catch (error) {
      if(error instanceof AppError) {
        throw error;
      }
      console.log(error);      
      throw new AppError('Unexpected server error!', 500);
    }
  }
}