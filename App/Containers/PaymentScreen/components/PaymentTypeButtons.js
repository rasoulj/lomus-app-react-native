import React, { Component } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import QMButton from '../../QMButton'
import I18n from 'react-native-i18n'

export default class PaymentTypeButtons extends Component {
  getImage(payType) {
    return payType == 'CASH' ? require('../../../Images/CASH.png') : require('../../../Images/CREDIT.png')
  }

  render () {
    const {selected, onPaymentTypeChange} = this.props
    return (
      <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
        {['CREDIT', 'CASH'].map(paymentType => (
          <View style={{flex: 1, flexDirection: 'column'}}>
            <TouchableOpacity style={{height: 143, width: 218, alignSelf: 'center'}} onPress={() => onPaymentTypeChange(paymentType)} >
              <Image style={{height: 143, width: 218, alignSelf: 'center'}} source={this.getImage(paymentType)}/>
            </TouchableOpacity>

            <View key={paymentType} style={{flex: 1}}>
              <QMButton
                key={paymentType}
                btnType='choice'
                onPress={() => onPaymentTypeChange(paymentType)}
                isSelected={selected === paymentType}
              >{I18n.t(paymentType)}</QMButton>
            </View>
          </View>
        ))}
      </View>
    )
  }
}
/*
 {['CASH', 'CREDIT', 'DEBIT', 'OTHER'].map(paymentType => (
          <View key={paymentType} style={{flex: 1}}>
            <QMButton
              key={paymentType}
              onPress={() => onPaymentTypeChange(paymentType)}
              isSelected={selected === paymentType}
            >{paymentType}</QMButton>
          </View>
        ))}
        */
