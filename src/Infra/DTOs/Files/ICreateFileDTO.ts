export interface ICreateFileDTO {
  userId: string;
  folderId?: string;
  file: Express.Multer.File | undefined;
}