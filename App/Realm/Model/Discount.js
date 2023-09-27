import RealmBase from './RealmBase'
class Discount extends RealmBase {
  discountAmount(itemAmount) {
    let result = 0

    if (this.itemClass === 'PERCENT') {
      result = (itemAmount * this.amount) / 100
    } else if (this.itemClass === 'VALUE') {
      result = this.amount
    }

    return result
  }
}
Discount.schema = {
  name: 'Discount',
  primaryKey: 'id',
  properties: {
    version: {type: 'int', optional: true},
    id: {type: 'string'},
    name: {type: 'string', optional: true},
    image: {type: 'string', optional: true},
    itemClass: {type: 'string', optional: true},
    itemType: {type: 'string', optional: true},
    amount: {type: 'double', optional: true},
    score: {type: 'int', optional: true},
    dateCreated: {type: 'int', optional: true},
    rank: {type: 'int', optional: true},
    visible: {type: 'bool', optional: true}

    // Relationships
    // parent: {type: 'Item'},
    // itemVariations: {type: 'list', objectType: 'ItemVariation'},
    // taxes: {type: 'list', objectType: 'Tax'}
  }
}

export {
  Discount
}
