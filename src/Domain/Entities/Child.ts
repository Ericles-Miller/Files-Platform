import { Base } from './shared/Base';

export class Child extends Base {
  folderId: string;

  constructor(folderId : string, id: string | null) {
    super(id);
    this.folderId = folderId;
  }
}
