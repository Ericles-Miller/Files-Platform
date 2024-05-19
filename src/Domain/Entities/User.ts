import { Base } from "./shared/Base";

export class User extends Base {

  name: string;
  email: string;
  password: string;
  avatar: string | null

  constructor(name: string, email: string, password: string, avatar: string | null) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
  }
}
