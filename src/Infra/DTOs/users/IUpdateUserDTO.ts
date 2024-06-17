export interface IUpdateUserDTO {
  id: string;
  name: string;
  email: string;
  password: string;
  enable: boolean
  avatar: string | null;
}
