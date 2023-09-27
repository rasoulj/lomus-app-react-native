import { LineItemService, SaleTXService } from '../../../../Realm/RealmService'

export default excludeSplitTicketItemsFromMainTicket = ({splitTicket, ticket}) => {
  console.tron.display({
    name: '⛄️ Exclude itemsss',
    value: {
      splitTicket,
      ticket
    }
  })
  
  splitTicket.lineItems.forEach(paidLineItem => {
    const itemInMainTicket = ticket.lineItems
      .filter(({itemVariationId}) => paidLineItem.itemVariationId === itemVariationId)[0]

    const newQuantity = itemInMainTicket.quantity - paidLineItem.quantity


    LineItemService.update({
      id: itemInMainTicket.id,
      quantity: newQuantity
    })

    if (newQuantity === 0) {
      SaleTXService.write(() => {
        ticket.lineItems = ticket.lineItems.filter(({id}) => id !== itemInMainTicket.id)
      })
      LineItemService.delete(itemInMainTicket)
    }
  })
}
