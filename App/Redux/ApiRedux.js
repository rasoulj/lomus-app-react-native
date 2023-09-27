import { Alert } from 'react-native'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initialize: [],
  login: ['email', 'password', 'merchantId', 'reLoadData'],
  loginSuccess: ['result'],
  loginFailure: ['result'],
  logout: [],
  userLogout: [],
  navReset: [],
  merchantSuccess: ['result'],
  notifyLoadProgress: ['progress'],
  merchantUserSuccess: ['result'],
  taxSuccess: ['result'],
  itemSuccess: ['result'],

  scanBarcode: ['barcode'],
  barcodeComplete: ['scannedItem', 'scannedItemVariation'],

  apiToken: ['token']
})

export const ApiTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const blank = () => {
  return {
    // Leave this, it's used to know if we have loaded the state
    initializing: false,

    fetching: false,
    loggedIn: false,
    email: undefined,

    progress: {
      total: -1,
      current: 0
    },

    user: undefined,
    merchantId: undefined,
    merchant: undefined,
    merchantUser: undefined,
    barcode: undefined,
    scanned: {
      item: null,
      itemVariation: null
    },
    taxes: undefined,
    items: undefined,
    // current sales ticket
    ticket: undefined,

    saleTx: undefined
  }
}

export const INITIAL_STATE = Immutable(blank())

/* ------------- Reducers ------------- */

export const initialize = (state, { email, merchantId }) =>
  state.merge({
    fetching: true
  })

export const login = (state, { email, merchantId, reLoadData }) => {
  return state.merge({
    fetching: true,
    email: email,
    merchantId: merchantId
  })
}

export const loginSuccess = (state, { result }) => {
  return state.merge({
    fetching: false,
    loggedIn: true,
    user: result
  })
}

export const loginFailure = (state, { result }) => {
  Alert.alert('Login Failed', result.message ? result.message : 'Unknown Error..!')
  return state.merge({
    fetching: false,
    loggedIn: false,
    user: undefined
  })
}

export const notifyLoadProgress = (state, { progress }) => {
  //Alert.alert('Login Failed', result.message ? result.message : 'Unknown Error..!')
  console.log(JSON.stringify(progress))
  return state.merge({
    progress: progress
  })
}


export const merchantSuccess = (state, { result }) => {
  return state.merge({
    merchant: result
  })
}

export const merchantUserSuccess = (state, { result }) => {
  return state.merge({
    merchantUser: result
  })
}

export const taxSuccess = (state, { result }) => {
  return state.merge({
    taxes: result
  })
}

export const itemSuccess = (state, { result }) => {
  return state.merge({
    items: result
  })
}
export const scanBarcode = (state, { barcode }) => {
  return state.merge({
    barcode: barcode
  })
}

export const barcodeComplete = (state, { scannedItem, scannedItemVariation }) => {
  return state.merge({
    scanned: {
      item: scannedItem,
      itemVariation: scannedItemVariation
    }
  })
}

export const apiToken = (state, { token }) => {
  return state.merge({
    token: token
  })
}

export const getMerchantId = ({api}) => api.merchantId.toString()

export const logout = (state) => state.merge(blank())

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INITIALIZE]: initialize,
  [Types.LOGIN]: login,
  [Types.LOGIN_SUCCESS]: loginSuccess,
  [Types.LOGIN_FAILURE]: loginFailure,
  [Types.LOGOUT]: logout,
  [Types.MERCHANT_USER_SUCCESS]: merchantUserSuccess,
  [Types.MERCHANT_SUCCESS]: merchantSuccess,
  [Types.NOTIFY_LOAD_PROGRESS]: notifyLoadProgress,
  [Types.TAX_SUCCESS]: taxSuccess,
  [Types.ITEM_SUCCESS]: itemSuccess,
  [Types.SCAN_BARCODE]: scanBarcode,
  [Types.BARCODE_COMPLETE]: barcodeComplete,
  [Types.API_TOKEN]: apiToken
})
