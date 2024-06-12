import { Base } from "./Base";

export class User extends Base {

  name: string;
  email: string;
  password: string;

  constructor(name: string, email: string, password: string) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
