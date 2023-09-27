import RealmBase from './RealmBase'
class ItemVariation extends RealmBase {}
ItemVariation.schema = {
  name: 'ItemVariation',
  primaryKey: 'id',
  properties: {
    id: {type: 'string'},
    sku: {type: 'string', optional: true, indexed: true},
    upc: {type: 'string', optional: true, indexed: true},

    itemId: {type: 'string', optional: true},
    name: {type: 'string', optional: true},
    version: {type: 'int', optional: true},
    startRow: {type: 'int', optional: true},
    rows: {type: 'int', optional: true},
    sortField: {type: 'string', optional: true},
    sortAsc: {type: 'bool', optional: true},
    deleted: {type: 'bool', optional: true},
    price: {type: 'double', optional: true},
    position: {type: 'int', optional: true},
    image: {type: 'string', optional: true},
    description: {type: 'string', optional: true},
    merchantId: {type: 'string', optional: true},
    webStorePrice: {type: 'double', optional: true},
    brand: {type: 'string', optional: true},
    rank: {type: 'int', optional: true},
    visible: {type: 'bool', optional: true},
    shippingAllowed: {type: 'bool', optional: true},
    shippingRate: {type: 'double', optional: true},
    cost: {type: 'double', optional: true},
    dateCreated: {type: 'int', optional: true},

    SKU: {type: 'string', optional: true},
    UPC: {type: 'string', optional: true},

    // Relationships
    item: {type: 'linkingObjects', objectType: 'Item', property: 'itemVariations'}

    // inventory: 'Inventory',
    // variationAttributes: {type: 'list', objectType: 'any'}, //any[],
    // variationExtendedAttributes: {type: 'list', objectType: 'any'},
    // dataSource: 'any',
  }
}

export {
  ItemVariation
}
