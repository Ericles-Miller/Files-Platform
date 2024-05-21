export interface IUpdateUserFileDTO {
  id: string;
  name: string;
  password: string;  
  enable: boolean
  file: Express.Multer.File | undefined;
}