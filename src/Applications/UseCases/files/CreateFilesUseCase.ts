import { IFoldersRepository } from "@Applications/Interfaces/IFoldersRepository";
import { File } from "@Domain/Entities/File";
import { AppError } from "@Domain/Exceptions/AppError";
import { inject, injectable } from "inversify";
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from "@Applications/Services/awsS3"
import { IFilesRepository } from "@Applications/Interfaces/IFilesRepository";
import { ICreateFileDTO } from "@Infra/DTOs/Files/ICreateFileDTO";

@injectable()
export class CreateFilesUseCase {
  constructor (
    @inject("FoldersRepository")
    private foldersRepository: IFoldersRepository,
    @inject('FilesRepository')
    private filesRepository: IFilesRepository
  ) {}

  async execute({ file, folderId, userId }: ICreateFileDTO) : Promise<void> {
    if(folderId && file) {
      const folderBelongingUser = await this.foldersRepository.folderBelongingUser(userId, folderId);
      if(!folderBelongingUser) {
        throw new AppError('that folder does not belong this user or userId is incorrect', 400);
      }
      
      const newFile = new File({ 
        displayName: file.originalname, fileName:file.originalname, folderId, id: null, userId 
      });

      newFile.setSize(file.size);
      newFile.setType(file.mimetype);
      newFile.setPath(`${folderBelongingUser.path}/${file.originalname}`);

      const filePath = await this.filesRepository.findPathWitSameName(newFile.folderPath, userId);
      if(filePath){
        throw new AppError('The file name already exists in dir. Please choose another name!', 400);
      }

      await s3.send(new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: file.originalname,
        Body:file.buffer,
        ContentType: file.mimetype,
      }));

      await this.filesRepository.create(newFile);
      // set size to folders
    }
  }
}