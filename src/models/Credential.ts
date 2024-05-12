import { Length } from "class-validator";

export class Credential {
  @Length(3, 50, {
    message: "Identifier should consist of at least 3 characters",
  })
  identifier: string;
  @Length(6, 50, {
    message: "Password should consist of at least 6 characters",
  })
  password: string;

  constructor(identifier: string, password: string) {
    this.identifier = identifier;
    this.password = password;
  }
}
