import React, { Component } from 'react'
import { View } from 'react-native'
import QMButton from '../../QMButton'
import PropTypes from 'prop-types'

export default class SplitPaymentButtons extends Component {
  render () {
    const {selected, setSplitAmount} = this.props
    return (
      <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
        {[2, 3, 4, 5].map(splitAmount => (
          <View key={splitAmount} style={{flex: 1}}>
            <QMButton
              key={splitAmount}
              onPress={() => setSplitAmount(splitAmount)}
              isSelected={selected === splitAmount}
            >1/{splitAmount}</QMButton>
          </View>
        ))}
      </View>
    )
  }
}

SplitPaymentButtons.propTypes = {
  setSplitAmount: PropTypes.func.isRequired,
  selected: PropTypes.number.isRequired
}
