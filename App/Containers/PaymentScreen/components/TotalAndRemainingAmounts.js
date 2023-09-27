import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ApplicationStyles } from '../../../Themes/index'
import Currency from '../../../Transforms/Currency'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})

export default class TotalAndRemainingAmounts extends React.Component {
  render () {
    const {totalPrice, remaining} = this.props
    return (
      <View style={{flex: 2}}>
        <Text style={[styles.header, {textAlign: 'right', marginTop: -20}]}>{I18n.t('Total2')} {Currency(totalPrice)}</Text>
        {/*<View>
          <Text style={[styles.header, {
            textAlign: 'right',
            marginTop: -45,
            fontSize: 20
          }]}>
           {I18n.t('Remaining')} {Currency(remaining)}
          </Text>
        </View>*/}
      </View>
    )
  }
}

TotalAndRemainingAmounts.propTypes = {
  remaining: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired
}
