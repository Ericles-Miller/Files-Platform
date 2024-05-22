import { Folder } from "@Domain/Entities/Folder";

export interface IFolderParamsDTO { 
  displayName : string;
  size: number | null;
  parentId: string | null;
  children: Folder [];
  userId : string;
  id: string | null
}