import { Base } from "./shared/Base";

export class User extends Base {

  name: string;
  email: string;
  password: string;
  avatar!: string

  constructor(name: string, email: string, password: string, avatar: string) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
  }
}
