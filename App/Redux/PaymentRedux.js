import Immutable from 'seamless-immutable'
import UUID from '../Utils/UUID'
import I18n from 'react-native-i18n'
const UPDATE_PAYMENT = 'indigo/payments/UPDATE_PAYMENT'
export const updatePayment = updates => {
  return {
    type: UPDATE_PAYMENT,
    updates
  }
}

const RESET_PAYMENT = 'indigo/payments/RESET_PAYMENT'
export const resetPayment = () => ({
  type: RESET_PAYMENT
})

export const currentPayment = (state) => state.payments.currentPayment

export const itemQuantityInCurrentSplit = (state, item) => {
  return state.payments.splitPayment[item.id] || 0
}
const PUT_INTO_CURRENT_SPLIT = 'putIntoCurrentSplit'

export const putIntoCurrentSplit = ({item, quantity}) => {
  return {
    type: PUT_INTO_CURRENT_SPLIT,
    item: {
      id: item.id,
      quantity
    }
  }
}

// TODO split into 2 ducks
export const INITIAL_STATE = Immutable({
  currentPayment: {
    id: UUID(),
    method: 'CREDIT'
  },
  splitPayment: {}
})

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_PAYMENT:
      return state.set('currentPayment', {
        ...state.currentPayment,
        ...action.updates
      })
    case PUT_INTO_CURRENT_SPLIT:
      return Immutable.setIn(state, ['splitPayment', action.item.id], action.item.quantity)
    case RESET_PAYMENT:
      return INITIAL_STATE
    default:
      return state
  }
}
