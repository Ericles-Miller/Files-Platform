import { Files, Folders } from '@prisma/client';

export interface IResponseSearchFilesFolders {
  files: Files[];
  folders: Folders[];
}