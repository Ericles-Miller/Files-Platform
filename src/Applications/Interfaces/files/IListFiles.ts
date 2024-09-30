export interface IListFiles {
  id: string;
  displayName: string;
  fileName: string;
  size: number;
  createdAt: Date;
  updatedAt: Date | null;
  type: string;
  folderPath: string;
  userId: string;
  folderId: string;
}
