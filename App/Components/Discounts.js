import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Colors, ApplicationStyles } from '../Themes'

import Checkbox from './Checkbox'

export default class Discounts extends Component {
  renderCheckboxes = (value) => {
    let type = value.itemClass === 'PERCENT' ? (value.amount + '%') : ('$' + value.amount)

    return (
      <Checkbox
        label={value.name}
        amount={type}
        checked={this.checkboxChecked(value)}
        onPress={() => this.props.checkboxPress(value)}
      />
    )
  }

  checkboxChecked = (value) => {
    return this.props.checkedList.includes(value.id)
  }

  render() {
    const {discountList, name} = this.props
    return (
      <View>
        <Text style={[styles.headerText, { fontWeight: 'bold' }]}>{name}</Text>
        <Text style={styles.headerText}>Select Discount Type</Text>
        {discountList.map(value => this.renderCheckboxes(value))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  checkboxView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
    paddingLeft: '5%'
  },
  checkboxIcon: {
    paddingRight: '3%',
    color: Colors.black
  },
  checkboxLabel: {
    fontSize: 18
  },
  checkboxAmount: {
    fontWeight: 'bold'
  },
  headerText: {
    fontSize: 20,
    paddingLeft: '5%',
    paddingTop: '2%',
    paddingBottom: '2%',
    color: Colors.black
  }
})
