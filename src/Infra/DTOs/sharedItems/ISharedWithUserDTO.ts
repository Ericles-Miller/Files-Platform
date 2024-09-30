import { IListFiles } from '@Applications/Interfaces/files/IListFiles';
import { Folders } from '@prisma/client';

export interface ISharedWithUserDTO {
  folders : Folders[],
  files: IListFiles[],
}
