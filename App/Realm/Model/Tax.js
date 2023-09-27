import RealmBase from './RealmBase'
class Tax extends RealmBase {}
Tax.schema = {
  name: 'Tax',
  primaryKey: 'id',
  properties: {
    version: {type: 'int', optional: true},
    startRow: {type: 'int', optional: true},
    rows: {type: 'int', optional: true},
    sortField: {type: 'string', optional: true},
    sortAsc: {type: 'bool', optional: true},
    id: {type: 'string'},
    deleted: {type: 'bool', optional: true},
    name: {type: 'string', optional: true},
    type: {type: 'string', optional: true},
    amount: {type: 'double', optional: true},
    enabled: {type: 'bool', optional: true},
    included: {type: 'bool', optional: true},
    appliedCustomAmount: {type: 'bool', optional: true},
    merchantId: {type: 'string', optional: true},
    applyToNewItem: {type: 'bool', optional: true}

    // Relationships
    // itemVariations: {type: 'list', objectType: 'ItemVariation'}
  }
}

export {
  Tax
}
