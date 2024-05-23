import { IBaseRepository } from './shared/IBaseRepository';
import { Users } from '@prisma/client';

export interface IUsersRepository extends IBaseRepository<Users> {
  checkEmailAlreadyExist(email: string) : Promise<Users | null>
}
