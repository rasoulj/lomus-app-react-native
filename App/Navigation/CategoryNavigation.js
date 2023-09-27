import React from 'react'
import * as ReactNavigation from 'react-navigation'
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import CategoryScreen from '../Containers/CategoryScreen'

import { Colors } from '../Themes/'

// Manifest of possible screens
export const CategoryNavigation = ReactNavigation.StackNavigator({
  CategoryScreen: { screen: CategoryScreen }
}, {
  // Default config for all screens
  headerMode: 'screen',
  initialRouteName: 'CategoryScreen',
  mode: 'modal',
  navigationOptions: ({navigation}) => ({
    headerStyle: {
      backgroundColor: Colors.white_smoke,
      elevation: 0
    },
    headerTitleStyle: {
      fontFamily: 'normal',
      alignSelf: 'center',
      fontSize: 26,
      fontWeight: '200'
    },
    headerTintColor: Colors.black
  })
})

// here is our redux-aware our smart component
function ReduxCategoryNavigation (props) {
  const { dispatch, nav, openItemInfo } = props
  const navigation = ReactNavigation.addNavigationHelpers({
    dispatch,
    openItemInfo,
    state: nav
  })

  return <CategoryNavigation navigation={navigation}/>
}

const mapStateToProps = state => ({
  nav: state.nav2
})

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps)(ReduxCategoryNavigation)
