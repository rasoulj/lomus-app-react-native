import _ from 'lodash'
import RealmBase from './RealmBase'

class LineItem extends RealmBase {
  get totalPrice() {
    return this.subtotalPrice - this.totalDiscount
  }

  get totalPriceWithoutTicket() {
    return this.subtotalPrice - this.itemDiscount
  }

  get subtotalPrice() {
    return this.quantity * this.unitPrice
  }

  get totalDiscount() {
    return this.itemDiscount + this.ticketDiscount
  }

  get itemDiscount() {
    let result = 0 // this.saleTx.refAsArray['discounts'].length

    this.discountList.forEach(discount => {
      result += discount.discountAmount(this.subtotalPrice)
    })

    // Don't allow an item to be less than free
    return Math.min(result, this.subtotalPrice)
  }

  get ticketDiscount() {
    let result = 0
    let itemSubtotal = this.subtotalPrice - this.itemDiscount

    this.saleTx[0].discounts.forEach(discount => {
      result += discount.discountAmount(itemSubtotal)
    })

    // Don't allow an item to be less than free
    return Math.min(result, this.totalPriceWithoutTicket)
  }

  get taxes() {
    return this.itemVariation.item[0].refAsArray('taxes')
  }

  get taxAmount() {
    let taxPercentage = this.taxes.map(tax => tax.amount)
    let perItemTaxPercentage = taxPercentage.reduce((sum, value) => {
      return sum + value
    }, 0)
    let afterDiscount = this.subtotalPrice - this.totalDiscount
    return (afterDiscount * perItemTaxPercentage) / 100
  }

  get taxPercentage() {
    let taxPercentage = this.itemVariation.item[0].refAsArray('taxes').map(tax => tax.amount)
    return taxPercentage
  }

  get itemVariationId() {
    return this.itemVariation.id
  }

  get unitPrice() {
    return this.itemVariation.price
  }

  get json() {
    let result = {
      totalPrice: this.subtotalPrice,
      taxIds: [],
      taxAmount: this.taxAmount,
      itemVariationId: this.itemVariationId,
      id: this.id,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      discountAmount: this.totalDiscount
    }

    this.taxes.forEach(tax => {
      result.taxIds.push(tax.id)
    })

    return result
  }
}
LineItem.schema = {
  name: 'LineItem',
  primaryKey: 'id',
  properties: {
    id: {type: 'string'},
    quantity: {type: 'int'},

    taxIds: {type: 'string', optional: true},
    // discountAmount: {type: 'float', optional: true},
    modifierOptionAmount: {type: 'float', optional: true},
    refundFee: {type: 'float', optional: true},
    inventoryUpdate: {type: 'float', optional: true},
    note: {type: 'string', optional: true},
    returnQuantity: {type: 'int', optional: true},
    taxAmountIncluded: {type: 'float', optional: true},

    // unitPrice: {type: 'float', optional: true},
    // itemVariationId: {type: 'string', optional: true},
    // taxAmount: {type: 'float', optional: true},
    // totalPrice: {type: 'float', optional: true},

    // Relationships
    itemVariation: {type: 'ItemVariation'},
    discountList: {type: 'list', objectType: 'Discount'},

    saleTx: {type: 'linkingObjects', objectType: 'SaleTX', property: 'lineItems'}

    // ticketDiscountList: {type: 'list', objectType: 'Discount'}

    // rewardCode: {type: 'string', optional: true},
    // refundOriginalLineItemId: {type: 'string', optional: true},
    // refundType: {type: 'string', optional: true},
    // customerGiftCard: {type: 'string', optional: true},
    // discountIds: {type: 'string', optional: true},
    // courseId: {type: 'string', optional: true},
    // modifierOptionIds: {type: 'string', optional: true},
  }
}

export {
  LineItem
}
