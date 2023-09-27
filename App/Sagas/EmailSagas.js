import { call, put } from 'redux-saga/effects'
import EmailActions from '../Redux/EmailRedux'

export function * sendEmail (emailApi, action) {
  const { targetEmail, base64String, senderName } = action
  const error = yield call(emailApi.sendReceiptEmail, targetEmail, base64String, senderName)

  if (error) {
    yield put(EmailActions.emailFailure('failed'))
  } else {
    yield put(EmailActions.emailSuccess('queued'))
  }
}
