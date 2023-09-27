import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../Themes'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { connect } from 'react-redux'

import FlagActions from '../Redux/FlagRedux'
import PropTypes from 'prop-types'

const {setPaymentProcessing} = FlagActions

class LeftHeader extends Component {

  handlePress = () => {
    if (this.props.cancelPaymentProcessing) {
      this.props.setPaymentProcessing(false)
    }
    const { navigation } = this.props
    if (navigation.state.routeName === 'PaymentScreen') {
      navigation.navigate('TransactionScreen')
    } else {
      navigation.goBack()
    }
  }

  render () {
    return (
      <Icon
        onPress={() => { this.handlePress() }}
        name='chevron-right'
        size={45}
        style={{color: Colors.primary, paddingTop: 20, paddingLeft: 45}}
      />
    )
  }
}

LeftHeader.defaultProps = {
  cancelPaymentProcessing: false
}

LeftHeader.propTypes = {
  navigation: PropTypes.object.isRequired,
  cancelPaymentProcessing: PropTypes.bool
}

export default connect(null, {setPaymentProcessing})(LeftHeader)
