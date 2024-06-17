export interface IRequestDTO {
  name: string;
  email: string;
  password: string;
  file: Express.Multer.File | undefined;
}
