import {v4 as uuid} from 'uuid';

export class Base {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  enable!: boolean;

  constructor(id: string | null) {
    if(!id) {
      this.id = uuid();
      this.createdAt = new Date();
      this.enable = true;
      this.updatedAt = null;
    } else {
      this.id = id;
    }
  }

  setUpdatedAt(date: Date): void {
    this.updatedAt = date;
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt;
  }

  setEnable(status: boolean): void {
    this.enable = status;
  }

  getEnable(): boolean {
    return this.enable;
  }
}
