import { IsBoolean, Length, Matches } from "class-validator";

export class ShippingAddress {
  @Length(2, 50, {
    message: "Street should consist of 2-50 characters",
  })
  street: string;

  @Length(1, 50, {
    message: "Local should consist of 1-50 characters",
  })
  local: string;

  @Length(2, 50, {
    message: "City should consist of 2-50 characters",
  })
  city: string;

  @Matches(/^\d{2}-\d{3}$/, {
    message: "Postal code format is: XX-XXX",
  })
  postal: string;

  @Length(2, 50, {
    message: "First name should consist of 2-50 characters",
  })
  firstName: string;

  @Length(2, 50, {
    message: "Last name should consist of at least 2-50 characters",
  })
  lastName: string;

  @Matches(/^\+48\s\d{3}\s\d{3}\s\d{3}$/, {
    message: "Phone number is 9 digits long",
  })
  phone: string;

  @IsBoolean({
    message: "Main is true or false",
  })
  main: boolean;

  constructor(
    street: string,
    local: string,
    city: string,
    postal: string,
    firstName: string,
    lastName: string,
    phone: string,
    main: boolean
  ) {
    this.street = street;
    this.local = local;
    this.city = city;
    this.postal = postal;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.main = main;
  }
}
