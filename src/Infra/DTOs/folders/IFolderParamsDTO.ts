import { Folder } from "@Domain/Entities/Folder";

export interface IFolderParamsDTO { 
  displayName : string;
  size: number;
  parentId: string;
  children: Folder [];
  userId : string;
  id:string | null
}