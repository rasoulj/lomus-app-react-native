import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import ApiActions from '../Redux/ApiRedux'
import { loadData } from './DataSagas'

export function * login (publicApi, action) {
  const { email, password, merchantId, reLoadData } = action
  console.tron.display({
    name: '🔐 Attempting Login',
    preview: email,
    value: {
      response
    }
  })


  console.log("merchantId: " + merchantId)
  // make the call to the api
  const response = yield call(publicApi.login, email, password, merchantId)

  if (response.ok) {


    const result = path(['data'], response)
    console.tron.display({
      name: '🗂 Setting Headers',
      preview: result.value,
      value: {
        Bearer: `Bearer ${result.value}`
      }
    })

    yield call(publicApi.setHeader, 'Authorization', `Bearer ${result.value}`)
    yield put(ApiActions.apiToken(result.value))



    const merchantUserResponse = yield call(publicApi.getMerchantUser, email, merchantId)
    const merchantUserResult = path(['data'], merchantUserResponse)
    yield put(ApiActions.merchantUserSuccess(merchantUserResult))

    const merchantResponse = yield call(publicApi.getMerchant, merchantId)
    const merchantResult = path(['data'], merchantResponse)
    yield put(ApiActions.merchantSuccess(merchantResult))


      // Load data
    yield* loadData(publicApi, {email, merchantId, reLoadData, lastSync: 0})

    // do data conversion here if needed

    yield put(ApiActions.loginSuccess(result))
  } else {
    console.tron.display({
      name: '🔐 Login Failed',
      preview: email,
      value: {
        response
      }
    })
    // Throw error if response has undefined data...!
    // const result = path(['data'], response) // Ramda paths 'null' to result if response.data is 'undefined'

    const result = response.data ? response.data : response // Result cant be 'null'
    publicApi.setHeader('Authorization', undefined)
    yield put(ApiActions.loginFailure(result))
  }
}

export function * logout (action) {
  yield put(ApiActions.logout())
}
