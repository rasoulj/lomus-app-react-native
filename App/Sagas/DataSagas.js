import { call, put, select } from 'redux-saga/effects'
import _ from 'lodash'
import ApiActions from '../Redux/ApiRedux'
import EmployeeActions from '../Redux/EmployeeRedux'

import { SaleTXService,
         LineItemService,
         ItemService,
         ItemVariationService,
         TaxService,
         DiscountService,
         UserAccountService,
         CategoryService } from '../Realm/RealmService'

export const getSyncDate = (state) => state.sync.syncDate

export function * loadData (publicApi, action) {
  const { merchantId, reLoadData } = action
  const syncFrequency = (1000) // Every 5 minutes  * 60 * 5
  let syncDate = yield select(getSyncDate)

  if (!syncDate) {
    syncDate = 0
  }

  let curTime = new Date().getTime()
  let sinceLastSync = curTime - syncDate

  console.tron.display({
    name: '📅 syncDate',
    preview: syncDate,
    value: {
      syncDate,
      sinceLastSync
    }
  })


  console.log("16");
  // Set the default user
  let defaultUser = UserAccountService.getAll()[0]
  console.log("17");
  yield put(EmployeeActions.setEmployee(defaultUser))


  // If the last sync was at least as long ago as syncFrequency
  if (sinceLastSync >= syncFrequency && reLoadData) { //Ras: || true
    // yield put(SyncActions.setSyncDate(curTime))

    // Clean all data and refetch
    //if(reLoadData) {
      ItemService.deleteAll()
      ItemVariationService.deleteAll()
      TaxService.deleteAll()
      LineItemService.deleteAll()
      SaleTXService.deleteAll()
      DiscountService.deleteAll()
      UserAccountService.deleteAll()
      CategoryService.deleteAll()
    //}

    /*
    let itemResponse = yield call(publicApi.getItems, merchantId)
    let items = itemResponse.data // .map(item => item.itemVariations)
    //*/



    const itemsCountResponse = yield call(publicApi.getItemsCount, merchantId)
    var itemsCount = itemsCountResponse.data.relatedObject;
    console.log("itemsCount: " + itemsCount);

    const PageSize = 100;
    let items = []

    console.log("items.length: " + items.length)

    let startRows = 0

    yield put(ApiActions.notifyLoadProgress({
      total: itemsCount,
      current: items.length
    }));

    //if(reLoadData) {
      for (startRows = 0; ; startRows += PageSize) {
        let itemResponse = yield call(publicApi.getItemsPaged, merchantId, startRows, PageSize)
        console.log(JSON.stringify(itemResponse.data.length))
        if (!itemResponse.data.length) break
        items = items.concat(itemResponse.data)

        yield put(ApiActions.notifyLoadProgress({
          total: itemsCount,
          current: items.length
        }));

        console.log("StartRow: " + startRows);
      }
    //}



    const discountsResponse = yield call(publicApi.getDiscounts, merchantId)
    const merchantUserAccountsResponse = yield call(publicApi.getMerchantUserAccounts, merchantId)
    const categoryResponse = yield call(publicApi.getCategories, merchantId)

    // Get the items' variations
    //TODO: ...let items = itemResponse.data // .map(item => item.itemVariations)
    // Get Discounts
    let discounts = discountsResponse.data
    // Get User Accounts
    let merchantUserAccounts = merchantUserAccountsResponse.data
    // Get User Accounts
    let categories = categoryResponse.data.filter(category => category.visible && !category.deleted)
    let itemTaxes = items.map(item => item.taxes) // array of arrays
    let taxes = _.groupBy([].concat.apply([], itemTaxes), 'id')

    // Flatten groupBy object to an array
    taxes = _.keys(taxes).map(key => taxes[key][0])
    console.log("7");
    let itemVariations = items.map(item => item.itemVariations) // array of arrays
    // Flatten array of arrays
    console.log("8");
    itemVariations = [].concat.apply([], itemVariations)
    console.log("9");
    // // TODO: Remove this... for testing scanner
    // itemVariations[2].sku = '0055577101018'

    //yield put(ApiActions.notifyLoadProgress({total: 100, current: 55}));

    // console.tron.display({
    //   name: '🐡 Synchronizing Categories',
    //   preview: categories.length,
    //   value: {
    //     categories
    //   }
    // })

    console.log("10");
    console.log("taxes.length: " + taxes.length)
    TaxService.addAll(taxes)
    console.log("11");
    ItemVariationService.addAll(itemVariations)
    console.log("12");
    DiscountService.addAll(discounts)
    console.log("13");
    UserAccountService.addAll(merchantUserAccounts)
    console.log("14");
    CategoryService.addAll(categories)
    console.log("15");
    // Adding sub category to parents
    categories.map(cat1 => {
      // If has no parent cat, find subs it
      if (!cat1.parentId) {
        // Search all cats for sub cats
        categories.map(cat2 => {
          // Found a sub cat --> cat2 is sub cat of cat1
          if (cat1.id === cat2.parentId) {
            // Open REALM and add sub cat to parent
            CategoryService.write(() => {
              let parentCat = CategoryService.getById(cat1.id)
              let subCat = CategoryService.getById(cat2.id)
              parentCat.subCategory.push(subCat)
            })
          }
        })
      }
    })

    console.log("16");
    // Set the default user
    let defaultUser = UserAccountService.getAll()[0]
    console.log("17");
    yield put(EmployeeActions.setEmployee(defaultUser))

    console.log("18");

    let tillCount = 0;


    //if(reLoadData) {
      for (let item of items) {


        //console.log("19: " + tillCount)

        if (tillCount % 100 == 0) {

          yield put(ApiActions.notifyLoadProgress({
            total: items.length,
            current: tillCount
          }));

          console.log("19: " + tillCount)
        }
        tillCount = tillCount + 1;

        let category = item.parent ? CategoryService.getById(item.parent.id) : undefined
        delete item.parent

        let taxes = item.taxes.map(tax => TaxService.getById(tax.id))
        delete item.taxes

        let itemVariations = item.itemVariations.map(variation => ItemVariationService.getById(variation.id))
        delete item.itemVariations

        let saved = ItemService.add(item)

        ItemService.write(() => {
          for (let tax of taxes) {
            saved.taxes.push(tax)
          }

          for (let itemVariation of itemVariations) {
            saved.itemVariations.push(itemVariation)
          }

          saved.category = category


        })
      }
    //}

    /*
    console.tron.display({
      name: '🐡 Synchronizing Categories',
      preview: CategoryService.getAll().length,
      value: {
        items: CategoryService.getAll().map(cat => cat.items),
        cats: CategoryService.getAll()
      }
    })
    //*/


  }
}

export function * createSales(publicApi, action) {
  const { saleTX, itemVaraitions, itemDiscounts } = action // probably fill in other stuff here as well.

  // How to create a sale TX
  // 1. All sales related IDs, such as SaleTX.id, LineItem.id, PaymentTX.id, PaymentCard.id needs to be generated
  // from in the client using UUID v4.
  // 2. All amounts are calculated on the client side (amount, tax, discount, LineItem.taxAmount, LineItem.discountAmount etc.
  // 3. PaymentTX needs to be filled (for non-split payment, only one object in this array)
  // 4. When credit card payment is done, PaymentCard needs to be filled.
  // 5. Check the ReleatedObject<SaleTX> object returned from the API for certain null fields (such as SaleTX.PaymentTX.referenceNo, etc).
  // 6. Print or Email with the SaleTX object returned from the server.
  // 7. API will always return HTTP 200. Need to check RelatedObject.status === 'SUCCESS' to see if the sale ticket creation
  // is successful.

}

export function * scanBarcode (action) {
  const { barcode } = action

  if (!barcode) {
    return
  }

  const items = yield select(state => state.api.items)

  let item = null
  let itemVariation = null

  items.filter(item => !item.deleted).some(anItem => {
    anItem.itemVariations.some(variation => {
      let found = false

      if (variation.upc === barcode) {
        found = true
        item = anItem
        itemVariation = variation
      } else if (variation.sku === barcode) {
        found = true
        item = anItem
        itemVariation = variation
      }

      if (found) {
        console.tron.display({
          name: 'scanBarcode',
          preview: barcode,
          value: {
            barcode: barcode,
            item: item,
            itemVariation: itemVariation
          }
        })

        return true
      }
    })
    if (item) {
      return true
    }
  })

  if (item) {
    // TODO create the line item here
    yield put(ApiActions.barcodeComplete(item, itemVariation))
  } else {
    yield put(ApiActions.barcodeComplete(null, null))
  }
}
