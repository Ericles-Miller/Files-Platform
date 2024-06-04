export interface IResponseRefreshToken {
  token: string,
  newRefreshToken?: {
    id: string;
    expiresIn: number;
    userId: string;
  }
}