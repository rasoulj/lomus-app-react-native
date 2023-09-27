import { combineReducers } from 'redux'
import configureStore from './boilerplate/CreateStore'
import rootSaga from '../Sagas/'
import api from '../Services/PublicApi'
import sales from './SalesRedux'
import payments from './PaymentRedux'

export default (onStartup) => {
  const rootReducer = (state, action) => {
    // If the USER_LOGOUT action is triggered, reset the entire state
    if (action.type === 'USER_LOGOUT') {
      state.api = undefined
      state.nav = undefined
      state.nav2 = undefined
      state.emp = undefined
      state.sales = undefined
      state.flag = undefined
    } else if (action.type === 'NAV_RESET') {
      state.nav = undefined
    } else if (onStartup && action.type === 'STARTUP') {
      onStartup()

      // Reinitialize the API with the last token
      api.setToken(state.api.token)
    }

    return appReducer(state, action)
  }

  /* ------------- Assemble The Reducers ------------- */
  const appReducer = combineReducers({
    nav: require('./boilerplate/NavigationRedux').reducer,
    nav2: require('./boilerplate/NavCategoryRedux').reducer,
    api: require('./ApiRedux').reducer,
    sync: require('./SyncRedux').reducer,
    emp: require('./EmployeeRedux').reducer,
    sales,
    payments,
    flag: require('./FlagRedux').reducer,
    email: require('./EmailRedux').reducer
  })

  return configureStore(rootReducer, rootSaga)
}
