export interface IUpdateUserFileDTO {
  id: string;
  name: string;
  email: string;
  password: string;  
  enable: boolean
  file: Express.Multer.File | undefined;
}