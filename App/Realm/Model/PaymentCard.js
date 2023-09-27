import RealmBase from './RealmBase'
class PaymentCard extends RealmBase {
}

PaymentCard.schema = {
  name: 'PaymentCard',
  primaryKey: 'id',
  properties: {
    id: {type: 'string', optional: true},

    cardHolderName: {type: 'string', optional: true},
    expirationDate: {type: 'string', optional: true},
    securityCode: {type: 'string', optional: true},
    cardNumber: {type: 'string', optional: true},

    //
    // **** The payment type options ****
    //
    // VISA = 'VISA';
    // MASTERCARD = 'MASTERCARD';
    // AMEX = 'AMEX';
    // DINERS = 'DINERS';
    // DEBIT = 'DEBIT';
    // DISCOVER = 'DISCOVER';
    // OTHER = 'OTHER';
    type: {type: 'string', optional: true}
  }
}

export {
  PaymentCard
}
