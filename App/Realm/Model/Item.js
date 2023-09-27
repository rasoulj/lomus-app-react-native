import RealmBase from './RealmBase'
class Item extends RealmBase {}
Item.schema = {
  name: 'Item',
  primaryKey: 'id',
  properties: {
    id: {type: 'string'},
    parentId: {type: 'string', optional: true}, // CategoryId

    name: {type: 'string', optional: true},
    version: {type: 'int', optional: true},
    startRow: {type: 'int', optional: true},
    rows: {type: 'int', optional: true},
    sortField: {type: 'string', optional: true},
    sortAsc: {type: 'bool', optional: true},
    deleted: {type: 'bool', optional: true},
    seoName: {type: 'string', optional: true},
    seoTitle: {type: 'string', optional: true},
    seoDescription: {type: 'string', optional: true},
    seoMetaDescription: {type: 'string', optional: true},
    info: {type: 'string', optional: true},
    label: {type: 'string', optional: true},
    color: {type: 'string', optional: true},
    image: {type: 'string', optional: true},
    itemClass: {type: 'string', optional: true},
    itemType: {type: 'string', optional: true},
    amount: {type: 'double', optional: true},
    score: {type: 'int', optional: true},
    hasInventory: {type: 'bool', optional: true},
    merchantId: {type: 'string', optional: true},
    courseId: {type: 'string', optional: true},
    dateCreated: {type: 'int', optional: true},
    rank: {type: 'int', optional: true},
    visible: {type: 'bool', optional: true},
    ibrandId: {type: 'string', optional: true},

    // Relationships
    // parent: {type: 'Item'},
    itemVariations: {type: 'list', objectType: 'ItemVariation'},
    taxes: {type: 'list', objectType: 'Tax'},
    category: 'Category'
  }
}

export {
  Item
}
