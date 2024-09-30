export interface IListUsersDTO {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
  enable: boolean;
  avatar: string | null
}
