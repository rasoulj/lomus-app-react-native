import React, { Component } from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import QMButton from '../../QMButton'
import QMInput from '../../QMInput'
import { ApplicationStyles, Colors } from '../../../Themes/index'
import Currency from '../../../Transforms/Currency'
import sanitizeDecimal from '../sanitizeDecimal'
import * as Animatable from 'react-native-animatable'
import I18n from 'react-native-i18n'
import Icon from 'react-native-vector-icons/Ionicons'


class CashAmountButton extends Component {
  render () {
    const {amount, ...rest} = this.props
    const isDecimal = (amount + '').contains('.')
    const formatted = amount;//Currency(amount)
    return (
      <QMButton btnType='paymentOffer' {...rest}>
        {/*isDecimal ? formatted : formatted.substring(0, formatted.length - 3)*/}
        {Currency(amount)}
      </QMButton>
    )
  }
}

export default class PaymentLine extends Component {
  roundToN = (val, n) => {
    return Math.ceil(val / n) * n
  }

  isSelected = (val) => {
    // Compare against the rounded value
    return this.props.selected === Number(val)
  }

  onAmountChange (newValue) {
    const {onChange, selected} = this.props

    const regex = /^[0-9]+\.?[0-9]?[0-9]?$/
    if (Number(newValue) === Number(selected)) {
      return
    }

    if (newValue === '' || regex.test(newValue)) {
      onChange(newValue)
    } else {
      onChange(selected)
    }
  }

  render () {
    const {price, onChange, hideChoice} = this.props

    let prices = [price]
    let roundToFive = this.roundToN(price, 1000)



    if (roundToFive !== price) {
      prices.push(roundToFive)
    }

    /*
    let roundToTen = this.roundToN(price, 10)
    if (roundToTen !== roundToFive) {
      prices.push(roundToTen)
    } else {
      prices.push(this.roundToN(price, 20))
    }
    */
    let onBtnPress = (val) => () => {
      let roundValue = sanitizeDecimal(val)

      if (onChange) {
        onChange(roundValue)
      }
    }

    const {selected} = this.props
    const value = (selected || '') + ''

    //onChange(this.roundToN(value, 1000))

    return (
      <View style={styles.secondRow}>
          {!hideChoice ?

            prices.map((val, index) => (
              <View key={index} style={{ flex: 2 }}>
                {val > 0 && <CashAmountButton key={val} amount={val} onPress={onBtnPress(val)} isSelected={this.isSelected(val)} />}
              </View>
          ))
            : (
            <View style={{ flex: 3, paddingRight: 10 }}>
              <Animatable.Text
                animation='zoomIn'
                duration={100}
                style={{textAlign: 'center', fontSize: 20, color: Colors.black, fontFamily: 'normal'}}
              >{I18n.t('Payment_Amount_MSG')}
              </Animatable.Text>
            </View>
          )}

        <View style={{flex: 3, paddingLeft: 10, marginTop: 10}}>
          {/*
          <QMInput
            value={value}
            label={I18n.t('amount')}
            keyboardType={'numeric'}
            onChangeText={(val) => this.onAmountChange(val)}
            height={50}
            style={styles.inputStyle}
          />*/}
          <View style={styles.searchSection}>
            <Icon style={styles.searchIcon} name="ios-cash" size={30} color="#aaa"/>
            <TextInput
              keyboardType='numeric'
              style={styles.input}
              value={value}
              placeholder={I18n.t('amount')}
              onChangeText={(val) => this.onAmountChange(val)}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  secondRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  inputStyle: {
    fontSize: 20,
    fontFamily: 'normal'
  },
  inputStyle2: {
    fontSize: 20,
    fontFamily: 'normal'
  },

  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderColor: "#aaa",
    borderRadius: 5,
    borderWidth: 1,
    width: '100%'
  },
  searchIcon: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    paddingTop: 0,
    paddingRight: 10,
    paddingBottom: 0,
    paddingLeft: 10,
    backgroundColor: '#f1f1f1',
    color: '#424242',
    fontFamily: 'normal',
    fontSize: 20
  },
})
