import { Matches } from "class-validator";

export class CardPayment {
  @Matches(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, {
    message: "Card Number consists of 16 digits",
  })
  cardNumber: string;

  @Matches(/^\d{2}\/\d{2}$/, {
    message: "Card Expiration date consists of 4 digits",
  })
  cardExpDate: string;

  @Matches(/^\d{3}$/, {
    message: "CVC code consists of 3 digits",
  })
  CVC: string;

  constructor(cardNumber: string, cardExpDate: string, CVC: string) {
    this.cardNumber = cardNumber;
    this.cardExpDate = cardExpDate;
    this.CVC = CVC;
  }
}
