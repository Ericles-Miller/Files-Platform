import { Folder } from "@Domain/Entities/Folder";

export interface IRequestFoldersDTO{
  displayName: string;
  parentId: string | null;
  userId: string;
}