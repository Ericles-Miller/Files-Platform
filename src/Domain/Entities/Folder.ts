import { IFolderParamsDTO } from "@Infra/DTOs/folders/IFolderParamsDTO";
import { Base } from "./shared/Base";

export class Folder extends Base {
  displayName: string;
  size: number;
  children: Folder[];
  readonly parentId: string;
  readonly userId: string;

  constructor({ children, parentId, displayName, size, id, userId }: IFolderParamsDTO) {
    super(id);
    this.displayName = displayName;
    this.size = size;
    this.parentId = parentId;
    this.children = children || [];
    this.userId = userId;
  }
}
