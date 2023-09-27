import React from 'react'
import * as ReactNavigation from 'react-navigation'
import { connect } from 'react-redux'

import TransactionScreen from '../Containers/TransactionScreen'
import CameraScreen from '../Containers/CameraScreen/CameraScreen'
import DiscountScreen from '../Containers/DiscountScreen'
import PaymentScreen from '../Containers/PaymentScreen'
import SplitPaymentScreen from '../Containers/SplitPaymentScreen'
import ProcessedScreen from '../Containers/ProcessedScreen'
import CardSwipeScreen from '../Containers/CardSwipeScreen'
import PSPContactingScreen from '../Containers/PSPContactingScreen'
import TransactionFailedScreen from '../Containers/TransactionFailedScreen'
import SellInfoScreen from '../Containers/SellInfoScreen'

import HeaderRight from './HeaderRight'

import { Colors } from '../Themes/'

// Manifest of possible screens
export const AppNavigation = ReactNavigation.StackNavigator({
  TransactionScreen: { screen: TransactionScreen },
  CameraScreen: { screen: CameraScreen },
  DiscountScreen: { screen: DiscountScreen },
  ProcessedScreen: { screen: ProcessedScreen },
  PaymentScreen: { screen: PaymentScreen },
  SplitPaymentScreen: { screen: SplitPaymentScreen },
  CardSwipeScreen: { screen: CardSwipeScreen },
  PSPContactingScreen: { screen: PSPContactingScreen },
  TransactionFailedScreen: { screen: TransactionFailedScreen },
  SellInfoScreen: { screen: SellInfoScreen },

}, {
  // Default config for all screens
  headerMode: 'screen',
  initialRouteName: 'TransactionScreen',
  navigationOptions: ({navigation}) => ({
    headerStyle: {
      backgroundColor: Colors.white,
      elevation: 0,
      bar: null
    },
    headerTitleStyle: {
      fontFamily: 'Karla-Regular',
      alignSelf: 'center',
      fontWeight: '200'
    },
    headerTintColor: Colors.black,
    headerRight: <HeaderRight drawerOpen={navigation.drawerOpen} />
  })
})

// here is our redux-aware our smart component
function ReduxNavigation (props) {

  const { dispatch, nav, api, userLogout, rightIcon, drawerOpen, drawerClose, selectedEmployee} = props
  const navigation = ReactNavigation.addNavigationHelpers({
    dispatch,
    state: nav,
    logout: userLogout,
    drawerOpen: drawerOpen,
    drawerClose: drawerClose,
    selectedEmployee: selectedEmployee
  })

  return <AppNavigation navigation={navigation}/>
}

const mapStateToProps = state => ({
  nav: state.nav,
  api: state.api,
  selectedEmployee: state.emp.selectedEmployee
})

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps)(ReduxNavigation)
