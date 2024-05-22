import { Base } from "./shared/Base";

export class Children extends Base {
  folderId: string;

  constructor(folderId : string, id: string | null) {
    super(id)
    this.folderId = folderId;
  }
}