import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  sendEmail: ['targetEmail', 'base64String', 'senderName'],
  emailSuccess: ['result'],
  emailFailure: ['result']
})

export const EmailTypes = Types
export default Creators

/* ------------- Initial State ------------- */
const blank = () => {
  return {
    sendingEmail: false,
    senderName: null,
    targetEmail: null,
    base64String: null,
    emailResult: ''
  }
}

export const INITIAL_STATE = Immutable(blank())

/* ------------- Reducers ------------- */
export const sendEmail = (state, { targetEmail, base64String, senderName }) =>
  state.merge({
    sendingEmail: true,
    senderName: senderName,
    targetEmail: targetEmail,
    base64String: base64String
  })

export const emailSuccess = (state, { result }) => {
  return state.merge({
    sendingEmail: false,
    emailResult: result
  })
}

export const emailFailure = (state, { result }) => {
  return state.merge({
    sendingEmail: false,
    emailResult: result
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SEND_EMAIL]: sendEmail,
  [Types.EMAIL_SUCCESS]: emailSuccess,
  [Types.EMAIL_FAILURE]: emailFailure
})
