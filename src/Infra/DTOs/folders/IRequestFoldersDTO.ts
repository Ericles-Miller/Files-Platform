import { Folder } from "@Domain/Entities/Folder";

export interface IRequestFoldersDTO{
  displayName: string;
  size: number | null;
  children: Folder[];
  parentId: string | null;
  userId: string;
}