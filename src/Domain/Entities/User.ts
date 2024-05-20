import { IUpdateUserDTO } from "@Infra/DTOs/users/IUpdateUserDTO";
import { Base } from "./shared/Base";

export class User extends Base {
  name: string;
  email: string;
  password: string;
  avatar!: string | null
  fileName!: string | null

  constructor(name: string, email: string, password: string) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
  }

  update({ avatar,email,enable,name,password }: IUpdateUserDTO) {
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

  setFileName(nameFile: string | null): void {
    if(nameFile) {
      this.avatar = nameFile;
    }
  }

  getFileName() : string | null{
    return this.fileName;
  }
}
