import { IFolderParamsDTO } from "@Infra/DTOs/folders/IFolderParamsDTO";
import { Base } from "./shared/Base";

export class Folder extends Base {
  displayName: string;
  size!: number;
  parentId!: string | null;
  children!: Folder[];
  path!: string;
  readonly userId: string;

  constructor({ id, displayName, userId }: IFolderParamsDTO) {
    super(id);
    this.displayName = displayName;
    this.userId = userId;
  }

  setParentFolder(parentId: string | null) : void {
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

  setSize(size: number) :void {
    this.size = size;
  }

  getSize(): number | null {
    return this.size;
  }
  
  setPath(path: string): void {
    this.path = path;
  }

  getPath(): string {
    return this.path;
  }
}