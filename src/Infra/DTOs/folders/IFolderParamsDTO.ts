import { Folder } from "@Domain/Entities/Folder";

export interface IFolderParamsDTO { 
  displayName : string;
  size: number;
  dadId: string;
  children: Folder [];
  id:string | null
}