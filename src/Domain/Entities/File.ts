import { IFilesParamsDTO } from "@Infra/DTOs/Files/IFilesParamsDTO";
import { Base } from "./shared/Base";

export class File extends Base {
  displayName: string;
  displayCover: string;
  type: string;
  size: number;
  folderPath: string;
  readonly userId: string;
  readonly folderId: string;

  constructor({ displayCover, displayName, folderId, folderPath, id, size, type, userId }: IFilesParamsDTO) {
    super(id)
    this.displayName = displayName;
    this.displayCover = displayCover;
    this.type = type;
    this.size = size;
    this.folderPath = folderPath;
    this.userId = userId;
    this.folderId= folderId;
  }

}