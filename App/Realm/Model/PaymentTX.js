import RealmBase from './RealmBase'
class PaymentTX extends RealmBase {
  get json() {
    let result = {
      id: this.id,
      time: this.time,
      changeAmount: this.changeAmount,
      method: this.method,
      receiveAmount: this.receiveAmount,
      totalAmount: this.totalAmount
    }

    return result
  }
}

PaymentTX.schema = {
  name: 'PaymentTX',
  primaryKey: 'id',
  properties: {
    id: {type: 'string', optional: true},

    status: {type: 'string', optional: true},
    time: {type: 'date', optional: true},
    customerRewardId: {type: 'string', optional: true},
    confirmationCode: {type: 'string', optional: true},
    settleFailReason: {type: 'string', optional: true},
    authAmount: {type: 'double', optional: true},
    changeAmount: {type: 'double', optional: true},
    settleFailResolve: {type: 'string', optional: true},
    method: {type: 'string', optional: true},
    signature: {type: 'string', optional: true},
    customerGiftCardId: {type: 'string', optional: true},
    customerAgeRange: {type: 'string', optional: true},
    referenceNo: {type: 'string', optional: true},
    customer: {type: 'string', optional: true},
    note: {type: 'string', optional: true},
    receiveAmount: {type: 'double', optional: true},
    totalAmount: {type: 'double', optional: true},
    customerPostalCode: {type: 'string', optional: true},
    customerGender: {type: 'string', optional: true},

    // Relationships
    paymentCard: {type: 'PaymentCard'}
  }
}

export {
  PaymentTX
}
