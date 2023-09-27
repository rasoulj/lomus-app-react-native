import RealmBase from './RealmBase'

class SaleTX extends RealmBase {
  get isEmpty () {
    return !this.lineItems || !this.lineItems.length
  }

  get totalPrice () {
    return this.subtotalPrice + this.taxAmount
  }

  get subtotalPrice () {
    return this.itemSubtotalPrice
  }

  get itemSubtotalPrice () {
    return this.lineItems.map(line => line.totalPrice).reduce((sum, value) => {
      return sum + value
    }, 0)
  }

  get itemSubtotalWithoutTicket () {
    return this.lineItems.map(line => line.totalPriceWithoutTicket).reduce((sum, value) => {
      return sum + value
    }, 0)
  }

  get taxAmount () {
    return this.lineItems.map(line => line.taxAmount).reduce((sum, value) => {
      return sum + value
    }, 0)
  }

  get json () {
    let result = {
      id: this.id,
      merchantId: this.merchantId,
      userId: this.userId,
      time: this.time,
      amount: this.totalPrice,
      tax: this.taxAmount,

      refundFee: this.refundFee,
      tip: this.tip,
      discount: 0, // TODO: calculate discounts
      taxIncluded: 0, // TODO: what is this?
      deliveryStatus: this.deliveryStatus,
      salesPerson: this.salesPerson,
      status: this.status,
      receiptId: this.receiptId,
      referenceId: this.referenceId,
      note: this.note,
      groupId: this.groupId,
      refundFeeDescr: this.refundFeeDescr,
      tableNumber: this.tableNumber,

      lineItems: [],
      paymentTXs: []
    }

    this.lineItems.forEach(line => {
      result.lineItems.push(line.json)
    })

    this.paymentTXs.forEach(payment => {
      result.paymentTXs.push(payment.json)
    })

    return result
  }
}

SaleTX.schema = {
  name: 'SaleTX',
  primaryKey: 'id',
  properties: {
    id: {type: 'string'},
    merchantId: {type: 'string', optional: true},
    time: {type: 'date', optional: true},
    status: {type: 'string', optional: true},
    amount: {type: 'double', optional: true},
    tax: {type: 'double', optional: true},
    receiptId: {type: 'string', optional: true},
    referenceId: {type: 'string', optional: true},
    // discount: {type: 'double', optional: true},
    taxIncluded: {type: 'double', optional: true},
    deliveryStatus: {type: 'string', optional: true},
    refundFee: {type: 'double', optional: true},
    tip: {type: 'double', optional: true},
    note: {type: 'string', optional: true},
    groupId: {type: 'string', optional: true},
    refundFeeDescr: {type: 'string', optional: true},
    tableNumber: {type: 'string', optional: true},
    userId: {type: 'string', optional: true},
    salesPerson: {type: 'string', optional: true},

    // Relationships
    discounts: {type: 'list', objectType: 'Discount'},
    lineItems: {type: 'list', objectType: 'LineItem'},
    paymentTXs: {type: 'list', objectType: 'PaymentTX'}
  }
}

export {
  SaleTX
}
