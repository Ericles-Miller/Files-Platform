import { IUpdateUserDTO } from "@Infra/DTOs/users/IUpdateUserDTO";
import { Base } from "./shared/Base";

export class User extends Base {
  name: string;
  email: string;
  password: string;
  avatar!: string | null
  fileName!: string | null

  constructor(name: string, email: string, password: string, id: string | null) {
    super(id);
    this.name = name;
    this.email = email;
    this.password = password;
  }

  update({ id, avatar,email,enable,name,password }: IUpdateUserDTO) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.setUpdatedAt(new Date());
    this.setEnable(enable)
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
}
