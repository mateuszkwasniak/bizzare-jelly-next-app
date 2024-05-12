import { IsEmail, Length, isEmail } from "class-validator";

export class SignUpCredential {
  @Length(3, 50, {
    message: "Username should consist of at least 3 characters",
  })
  username: string;

  @Length(2, 50, {
    message: "First name should consist of at least 2 characters",
  })
  firstName: string;

  @Length(2, 50, {
    message: "Last name should consist of at least 2 characters",
  })
  lastName: string;

  @IsEmail(undefined, {
    message: "Please provide a valid email address",
  })
  email: string;

  @Length(6, 50, {
    message: "Password should consist of at least 6 characters",
  })
  password: string;

  constructor(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}
