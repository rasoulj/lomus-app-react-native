import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setPaymentProcessing: ['processingPayment']
})

export const FlagTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const init = () => {
  return {
    immutable: true,
    processingPayment: false
  }
}

export const INITIAL_STATE = Immutable(init())

/* ------------- Reducers ------------- */

export const setPaymentProcessing = (state, { processingPayment }) => {
  return state.merge({
    processingPayment: processingPayment
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_PAYMENT_PROCESSING]: setPaymentProcessing
})
