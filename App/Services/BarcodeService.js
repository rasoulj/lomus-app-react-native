import UUID from '../Utils/UUID'
import { ToastAndroid } from 'react-native'
import { ItemVariationService, LineItemService, SaleTXService } from '../Realm/RealmService'

export const updateLineQuantity = (line, quantity) => {
  if (quantity === 0) {
    LineItemService.delete(line)
  } else {
    LineItemService.update({
      id: line.id,
      quantity: quantity
    })
  }
}

export const addItemVariationToTicket = (variation, ticket, quantity = 1) => {
  console.tron.display({
    name: '😭 addin item variation to ticket',
    value: {
      variation,
      ticket
    }
  })

  const lineItems = ticket.refAsArray('lineItems')
  let curLine = lineItems.filter(lineItem => lineItem.itemVariationId === variation.id)

  const itemIsNotPresentInTicket = curLine.length === 0
  if (itemIsNotPresentInTicket) {
    const newLineItem = {
      id: UUID(),
      itemVariationId: variation.id,
      quantity,
      itemVariation: variation
    }

    const savedLine = LineItemService.add(newLineItem)
    SaleTXService.write(() => {
      ticket.lineItems.push(savedLine)
    })
  } else {
    const line = curLine[0]
    const quantity = line.quantity + 1
    updateLineQuantity(line, quantity)
  }
}

export default class BarcodeService {
  static scanUpc (saleTx, upc) {
    let variation = ItemVariationService.queryOne('UPC', upc)

    if (variation) {
      addItemVariationToTicket(variation, saleTx)
    } else {
      ToastAndroid.showWithGravity(`Can't find item with upc \n    '${upc}'`, ToastAndroid.LONG, ToastAndroid.CENTER)
      console.tron.display({
        name: '☠️ scanUpc NOT FOUND',
        preview: upc
      })
    }
  }
}
