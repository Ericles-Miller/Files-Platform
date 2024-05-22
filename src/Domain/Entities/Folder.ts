import { IFolderParamsDTO } from "@Infra/DTOs/folders/IFolderParamsDTO";
import { Base } from "./shared/Base";

export class Folder extends Base {
  displayName: string;
  size: number | null;
  parentId: string | null;
  children!: Folder[];
  readonly userId: string;

  constructor({ id, displayName, size, parentId, userId }: IFolderParamsDTO) {
    super(id);
    this.displayName = displayName;
    this.size = size;
    this.parentId = parentId || null;
    this.userId = userId;
  }
}