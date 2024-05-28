export interface IUpdateUserFileDTO {
  id: string;
  name: string;
  password: string;  
  enable: string;
  file: Express.Multer.File | undefined;
}