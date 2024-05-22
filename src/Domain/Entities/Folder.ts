import { IFolderParamsDTO } from "@Infra/DTOs/folders/IFolderParamsDTO";
import { Base } from "./shared/Base";

export class Folder extends Base {
  displayName: string;
  size!: number | null;
  parentId: string | null;
  children!: Folder[];
  readonly userId: string;

  constructor({ id, displayName, parentId, userId }: IFolderParamsDTO) {
    super(id);
    this.displayName = displayName;
    this.parentId = parentId || null;
    this.userId = userId;
  }

  setParentFolder(parentId: string) : void {
    this.parentId = parentId;
  }

  getParentFolder(): string | null {
    return this.parentId;
  }

  setChildren(folder: Folder) : void {
    this.children.push(folder)
  }

  getChildren(): Folder[] {
    return this.children;
  }
}