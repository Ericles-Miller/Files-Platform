import { RefreshTokens } from "@prisma/client"
import { IBaseRepository } from "../shared/IBaseRepository"


export interface IRefreshTokenRepository extends IBaseRepository<RefreshTokens>{
  delete(userId: string) : Promise<void> 
}