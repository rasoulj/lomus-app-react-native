import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setEmployee: ['selectedEmployee']
})

export const EmployeeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const init = () => {
  return {
    immutable: true,
    selectedEmployee: undefined
  }
}

export const INITIAL_STATE = Immutable(init())

/* ------------- Reducers ------------- */

export const setEmployee = (state, { selectedEmployee }) => {
  return state.merge({
    selectedEmployee: selectedEmployee
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_EMPLOYEE]: setEmployee
})
