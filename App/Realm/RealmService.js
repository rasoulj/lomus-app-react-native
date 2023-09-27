import Realm from 'realm'
import _ from 'lodash'

import { Item } from './Model/Item'
import { ItemVariation } from './Model/ItemVariation'
import { LineItem } from './Model/LineItem'
import { Tax } from './Model/Tax'
import { SaleTX } from './Model/SaleTX'
import { PaymentTX } from './Model/PaymentTX'
import { PaymentCard } from './Model/PaymentCard'
import { Discount } from './Model/Discount'
import { UserAccount } from './Model/UserAccount'
import { Category } from './Model/Category'

export const realm = new Realm({
  schema: [
    ItemVariation,
    LineItem,
    Tax,
    Item,
    PaymentCard,
    PaymentTX,
    SaleTX,
    Discount,
    UserAccount,
    Category
  ],
  schemaVersion: 40,
  migration: (oldRealm, newRealm) => {
    // Remove all previous data (needs to be changed when in PROD)
    newRealm.deleteAll()
  }
})

function getService(schemaClass) {
  return class {
    static getAll() {
      return realm.objects(schemaClass)
    }

    static getById(id) {
      if (id) {
        return realm.objectForPrimaryKey(schemaClass, id)
      }
    }

    static query(param, val) {
      return this.getAll().filtered(`${param} = "${val}"`)
    }

    static queryOne(param, val) {
      let result = this.query(param, val).slice(0, 1)
      return result && result.length === 1 ? result[0] : undefined
    }

    static size() {
      return this.getAll().length
    }

    static add(obj, callback) {
      let existing = this.getById(obj.id)

      if (existing) {
        console.tron.display({
          name: '🐈 Object already exists! Use update instead',
          value: {
            obj: obj,
            existing: existing[0]
          }
        })

        if (callback) {
          callback(existing)
        }

        return existing
      }

      let result
      realm.write(() => {
        result = realm.create(schemaClass, _.clone(obj))
      })
      return result
    }

    // For addAll we do it within a single transaction to avoid penalties from multiple writes
    static addAll(objs) {
      realm.write(() => {
        for (let obj of objs) {
          let existing = this.getById(obj.id)

          if (existing) {
            continue
          }

          realm.create(schemaClass, _.clone(obj))
        }
      })
    }

    static deleteAll() {
      realm.write(() => {
        realm.delete(realm.objects(schemaClass))
        console.tron.display({
          name: '😭 Cleaned Realm!',
          preview: schemaClass
        })
      })
    }

    static update(obj) {
      let result
      realm.write(() => {
        result = realm.create(schemaClass, _.clone(obj), true)
      })
      return result
    }

    // Update without a write method. You must manage write yourself
    static updateInner(obj) {
      return realm.create(schemaClass, _.clone(obj), true)
    }

    static write(func) {
      realm.write(func)
    }

    static delete(obj) {
      realm.write(() => {
        realm.delete(obj)
      })
    }

    static addChangeListener(func) {
      return realm.addListener('change', func)
    }

    // Removes listeners on all objects
    static removeAllListeners() {
      return realm.removeAllListeners()
    }
  }
}

let ItemVariationService = getService('ItemVariation')
let LineItemService = getService('LineItem')
let TaxService = getService('Tax')
let ItemService = getService('Item')
let SaleTXService = getService('SaleTX')
let PaymentTXService = getService('PaymentTX')
let PaymentCardService = getService('PaymentCard')
let DiscountService = getService('Discount')
let UserAccountService = getService('UserAccount')
let CategoryService = getService('Category')

export {
  ItemVariationService,
  LineItemService,
  TaxService,
  ItemService,
  SaleTXService,
  PaymentTXService,
  PaymentCardService,
  DiscountService,
  UserAccountService,
  CategoryService
}
