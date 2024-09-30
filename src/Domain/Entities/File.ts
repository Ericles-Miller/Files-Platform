import { IFilesParamsDTO } from '@Infra/DTOs/Files/IFilesParamsDTO';

import { Base } from './shared/Base';

export class File extends Base {
  displayName: string;
  fileName: string;
  type!: string;
  size!: number;
  folderPath!: string;
  readonly userId: string;
  readonly folderId: string;

  constructor({
    displayName, fileName, folderId, id, userId,
  }: IFilesParamsDTO) {
    super(id);
    this.displayName = displayName;
    this.userId = userId;
    this.folderId = folderId;
    this.fileName = fileName;
  }

  setSize(size: number): void {
    this.size = size;
  }

  getSize(): number {
    return this.size;
  }

  setPath(path: string): void {
    this.folderPath = path;
  }

  getPath(): string {
    return this.folderPath;
  }

  setType(type: string): void {
    this.type = type;
  }

  getType(): string {
    return this.type;
  }
}
