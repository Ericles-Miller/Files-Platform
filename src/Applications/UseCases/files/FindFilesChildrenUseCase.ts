import { inject, injectable } from 'inversify';

import { IListFiles } from '@Applications/Interfaces/files/IListFiles';
import { IFilesRepository } from '@Applications/Interfaces/repositories/IFilesRepository';
import { IFoldersRepository } from '@Applications/Interfaces/repositories/IFoldersRepository';
import { s3 } from '@Applications/Services/awsS3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppError } from '@Domain/Exceptions/AppError';
import { IFindFilesDTO } from '@Infra/DTOs/Files/IFindFilesDTO';

@injectable()
export class FindFilesChildrenUseCase {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
    @inject('FoldersRepository')
    private foldersRepository: IFoldersRepository,
  ) {}

  async execute({ id, userId }: IFindFilesDTO): Promise<IListFiles[]> {
    const filesBelongingUser = await this.foldersRepository.folderBelongingUser(userId, id);
    if (!filesBelongingUser) {
      throw new AppError('That folder does not belong this user or userId is incorrect!', 400);
    }

    const files = await this.filesRepository.findFilesChildren({ userId, id });

    const listFiles = Promise.all(files.map(async (file) => {
      const getFile = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: file.displayName,
      });
      const url = await getSignedUrl(s3, getFile, { expiresIn: 3600 });

      const list : IListFiles = {
        id: file.id,
        createdAt: file.createdAt,
        displayName: url,
        fileName: file.fileName,
        folderId: file.folderId,
        folderPath: file.folderPath,
        size: file.size,
        type: file.type,
        updatedAt: file.updatedAt,
        userId,
      };
      return list;
    }));

    return listFiles;
  }
}
