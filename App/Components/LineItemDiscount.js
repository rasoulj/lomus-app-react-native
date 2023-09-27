import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Colors, ApplicationStyles } from '../Themes'
import Currency from '../Transforms/Currency'

export default class LineItemDiscount extends Component {
  render() {
    const { id, value, navigate, amount, ...rest } = this.props
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{
          flex: 2,
          alignSelf: 'flex-start'
        }} >
          <Text style={styles.discountText}
          >Discount
          </Text>
        </View>
        <View style={{
          flex: 3,
          alignSelf: 'center'
        }}>
          <Text style={styles.discountName}
                onPress={() => { navigate('DiscountScreen', { screenType: 'itemDiscount', id: id }) }}
          >{value.name}{value.itemClass === 'PERCENT' ? <Text> ({value.amount}%)</Text> : undefined}
          </Text>
        </View>
        <View style={{
          flex: 2,
          alignSelf: 'flex-end'
        }}>
          <Text style={styles.discountAmt}>
            (-{Currency(amount)})
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  discountAmt: {
    color: Colors.text,
    textAlign: 'right',
    fontSize: 15
  },
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
  }
})
