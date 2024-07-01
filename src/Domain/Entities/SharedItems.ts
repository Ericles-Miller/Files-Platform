import { Base } from './shared/Base';

export class SharedItems extends Base {
  userId: string;
  fileId!: string;
  folderId!: string;
  sharedWithUserId: string;

  constructor(id: string| null, userId: string, sharedWithUserId: string) {
    super(id);
    this.userId = userId;
    this.sharedWithUserId = sharedWithUserId;
  }

  setFolderId(folderId: string): void {
    this.folderId = folderId;
  }

  getFolderId(): string {
    return this.folderId;
  }

  setFileId(fileId: string): void {
    this.fileId = fileId;
  }

  getFileId(): string {
    return this.fileId;
  }
}
