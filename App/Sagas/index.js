import { takeLatest, takeEvery } from 'redux-saga/effects'
// import API from '../Services/Api'
import publicApi from '../Services/PublicApi'
import emailApi from '../Services/EmailApi'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/boilerplate/StartupRedux'
import { ApiTypes } from '../Redux/ApiRedux'
import { EmailTypes } from '../Redux/EmailRedux'

/* ------------- Sagas ------------- */

import { startup } from './boilerplate/StartupSagas'
import { login, logout } from './ApiSagas'
import { sendEmail } from './EmailSagas'
import { scanBarcode } from './DataSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const api = DebugConfig.useFixtures ? FixtureAPI : API.create()
// const publicApi = DebugConfig.useFixtures ? FixtureAPI : PUBLIC_API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    takeEvery(ApiTypes.LOGIN, login, publicApi),
    takeEvery(ApiTypes.SCAN_BARCODE, scanBarcode),
    takeEvery(ApiTypes.LOGOUT, logout),
    takeEvery(EmailTypes.SEND_EMAIL, sendEmail, emailApi)
  ]
}
