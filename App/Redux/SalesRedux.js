import Immutable from 'seamless-immutable'
import { SaleTXService } from '../Realm/RealmService'
import UUID from '../Utils/UUID'
import { resetPayment } from './PaymentRedux'

const createNewSaleTx = function () {
  const id = UUID()
  SaleTXService.add({
    id
  })
  return id
}

const UPDATE_ACTIVE_TICKET = 'indigo/sales/UPDATE_ACTIVE_TICKET'
export const createNewTicket = () => dispatch => {
  const id = createNewSaleTx()

  const listenForTicketUpdates = () => {
    dispatch(setActiveSale(id))
    dispatch(resetPayment())
    SaleTXService.query('id', id).addListener(() => {
      dispatch({
        type: UPDATE_ACTIVE_TICKET,
        activeTicket: new Date()
      })
    })
  }

  setTimeout(listenForTicketUpdates, 0)
}

const SET_ACTIVE_SALE = 'indigo/sales/SET_ACTIVE_SALE'
export const setActiveSale = (saleId) => ({
  type: SET_ACTIVE_SALE,
  saleId
})

// TODO reuse this
export const saleId = state => state.sales.activeSaleId
export const splitTicketId = state => state.sales.splitTicketId
export const activeTicket = (state) => SaleTXService.getById(saleId(state))
export const splitTicket = (state) => SaleTXService.getById(splitTicketId(state))

export const actionCreators = {
  setActiveSale,
  createNewTicket
}

export const INITIAL_STATE = Immutable({
  immutable: true,
  activeSaleId: undefined,
  paymentStatus: undefined,
  activeTicket: null,
  splitTicket: null,
  splitTicketId: null
})

// TODO Use a namespace
const SET_ACTIVE_SPLIT = 'SET_ACTIVE_SPLIT'
const setActiveSplit = (splitSaleId) => ({
  type: SET_ACTIVE_SPLIT,
  splitSaleId
})

// TODO Use a namespace
const UPDATE_SPLIT_TICKET = 'UPDATE_SPLIT_TICKET'
export const createSplitTicket = () => (dispatch) => {
  const id = createNewSaleTx()

  const listenForTicketUpdates = () => {
    dispatch(setActiveSplit(id))
    dispatch(resetPayment())
    SaleTXService.query('id', id).addListener(() => {
      dispatch({
        type: UPDATE_SPLIT_TICKET,
        splitTicket: new Date()
      })
    })
  }

  setTimeout(listenForTicketUpdates, 0)
}

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_ACTIVE_TICKET:
      return state.set('activeTicket', action.activeTicket)
    case UPDATE_SPLIT_TICKET:
      return state.set('splitTicket', action.splitTicket)
    case SET_ACTIVE_SALE:
      return state.set('activeSaleId', action.saleId)
    case SET_ACTIVE_SPLIT:
      // TODO normalize names
      return state.set('splitTicketId', action.splitSaleId)
    default:
      return state
  }
}
