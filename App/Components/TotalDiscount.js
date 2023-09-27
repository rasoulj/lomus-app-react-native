import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Colors, ApplicationStyles } from '../Themes'
import Currency from '../Transforms/Currency'

export default class TotalDiscount extends Component {
  render() {
    const { value, navigate, amount, ...rest } = this.props
    console.tron.display({
      name: '🐊 TotalDiscount',
      value: amount
    })
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{
          flex: 2,
          alignSelf: 'flex-start'
        }} >
          <Text style={styles.discountText}
          >Ticket Discount
          </Text>
        </View>
        <View style={{
          flex: 3,
          alignSelf: 'center'
        }}>
          <Text style={styles.discountName}
            onPress={() => { navigate('DiscountScreen', { screenType: 'ticketDiscount' }) }}
            >{value.name}{value.itemClass === 'PERCENT' ? <Text> ({value.amount}%)</Text> : undefined}
          </Text>
        </View>
        <View style={{
          flex: 2,
          alignSelf: 'flex-end'
        }}>
          <Text style={styles.discountAmt}
          >(-{Currency(amount)})
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  discountText: {
    color: Colors.text,
    textAlign: 'left',
    fontSize: 15
  },
  discountName: {
    color: Colors.primary,
    textAlign: 'right',
    textDecorationLine: 'underline',
    fontWeight: '500',
    fontSize: 15
  },
  discountAmt: {
    color: Colors.text,
    textAlign: 'right',
    fontSize: 15
  }
})
