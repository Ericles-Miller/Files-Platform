import { IBaseRepository } from './IBaseRepository';
import { Users } from '@prisma/client';

export interface IUsersRepository extends IBaseRepository<Users> {
  checkEmailAlreadyExist(email: string) : Promise<Users | null>
}
