import {v4 as uuid} from 'uuid';


export class RefreshToken {
  userId: string;
  expiresIn: number;
  id: string;

  constructor(userId: string, expiresIn: number) {
    this.id = uuid();
    this.expiresIn = expiresIn;
    this.userId = userId;
  }
}