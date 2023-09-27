import React, { Component } from 'react'
import * as ReactNavigation from 'react-navigation'
import { connect } from 'react-redux'
import { View } from 'react-native'
import Nameplate from '../Components/Nameplate'
import { Colors } from '../Themes'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'



class HeaderRight extends Component {
  getUserInitials = (user) => {
    if (!user) {
      return '(N/A)'
    }
    return user.firstName.substring(0, 1) + user.lastName.substring(0, 1)
  }

  render () {
    return (
      <View style={{
        marginRight: 20
      }}>
        {/*<Nameplate
          value={this.getUserInitials(this.props.selectedEmployee)}
          style={{ backgroundColor: Colors.primary }}
          onPress={() => {
            this.props.drawerOpen()
          }} />*/}
          <Icon name="menu" size={50} onPress={() => {
            this.props.drawerOpen()
          }} />
      </View>
    )
  }
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

export default connect(mapStateToProps)(HeaderRight)
