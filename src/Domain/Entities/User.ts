import { IUpdateUserDTO } from "@Infra/DTOs/users/IUpdateUserDTO";
import { Base } from "./shared/Base";
import { hash } from "bcryptjs";

export class User extends Base {
  name: string;
  email: string;
  password: string;
  avatar!: string | null;
  fileName!: string | null;
  enable!: boolean;

  constructor(name: string, email: string, password: string, id: string | null) {
    super(id);
    this.name = name;
    this.email = email;
    this.password = password;
  }

  update({ id, avatar, email, enable, name, password }: IUpdateUserDTO) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.setUpdatedAt(new Date());
    this.setEnable(enable);
  }

  setAvatar(avatar: string | null): void {
    if(avatar) {
      this.avatar = avatar;
    }
  }

  getAvatar() : string | null{
    return this.avatar;
  }

  setFileName(fileName: string | null): void {
    if(fileName) {
      this.fileName = fileName;
    }
  }

  getFileName() : string | null{
    return this.fileName;
  }

  async setPassword(password: string) : Promise<void> {
    const passwordHash = await hash(password, 8);
    this.password = passwordHash;
  }

  getPassword() : string {
    return this.password;
  }

  setEnable(status: boolean): void {
    this.enable = status;
  }

  getEnable(): boolean {
    return this.enable;
  }
}
