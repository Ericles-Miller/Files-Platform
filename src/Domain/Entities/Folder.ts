import { IFolderParamsDTO } from "@Infra/DTOs/folders/IFolderParamsDTO";
import { Base } from "./shared/Base";


export class Folder extends Base {
  displayName : string;
  size: number;
  dadId: string;
  children: Folder [];

  constructor({ children, dadId, displayName, size, id }: IFolderParamsDTO) {
    super(id)
    this.displayName = displayName;
    this.size = size;
    this.dadId = dadId;
    this.children = children;
  }
}