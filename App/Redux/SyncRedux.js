import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setSyncDate: ['syncDate']
})

export const SyncTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const blank = () => {
  return {
    syncDate: 0
  }
}

export const INITIAL_STATE = Immutable(blank())

/* ------------- Reducers ------------- */

export const setSyncDate = (state, { syncDate }) => {
  return state.merge({
    syncDate: syncDate
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_SYNC_DATE]: setSyncDate
})
