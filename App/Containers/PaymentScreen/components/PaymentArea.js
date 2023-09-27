import React from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import QMButton from '../../QMButton'
import PaymentTypeButtons from './PaymentTypeButtons'
import { ApplicationStyles } from '../../../Themes'
import PropTypes from 'prop-types'
import PaymentLine from './PaymentLine'
import { getChangeAmount, remainingAmount } from '../processPayment'
import { connect } from 'react-redux'
import { updatePayment } from '../../../Redux/PaymentRedux'
import I18n from 'react-native-i18n'

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})

const isInvalidCreditAmount = (ticket, payment) => {
  const changeAmount = getChangeAmount(ticket, payment) // Get the difference
  if (payment.method === 'CREDIT') { // -> If payment is card update payment to VISA method
    if (changeAmount > 0) {
      return true
    }
  }
  return false
}

// TODO this is a generic component that needs to live in a different directory
class PaymentArea extends React.Component {
  isPaymentMethodSupported () {
    const {payment} = this.props
    const paymentType = payment.method
    return paymentType === 'CASH' || this.isCreditCardPayment()
  }

  isInvalidInputAmount () {
    const {ticket, payment, splitType} = this.props

    console.log('splitType: ' + splitType)

    if (splitType === 'ONE') { // Input cant be less that total..!
      //console.log(ticket.totalPrice + ' > ' + payment.receiveAmount)
      if (ticket.totalPrice > payment.receiveAmount + 1) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  isCreditCardPayment () {
    return this.props.payment.method === 'CREDIT'
  }

  roundToN = (val, n) => {
    return Math.ceil(val / n) * n
  }


  renderPaymentAmountSuggestions () {
    // Changes suggestions by split amount
    const {price, updatePayment} = this.props
    const onChange = (val) => {
      updatePayment({
        receiveAmount: Number(val),
        totalAmount: Number(val)
      })
    }

    if (!this.isPaymentMethodSupported()) {
      return (
        <Text style={[styles.header, {marginTop: 5, marginBottom: 3}]}>
          {this.props.payment.method} Coming Soon...
        </Text>
      )
    }

    return (
      <PaymentLine
        price={price}
        selected={this.props.payment.receiveAmount}
        onChange={onChange}
        hideChoice={this.props.payment.method === 'CREDIT'} //TODO (Ras):  || true added for  hiding payment choices...
      />
    )
  }

  onProcessPayment1() {
    const {ticket, payment} = this.props
    Alert.alert(JSON.stringify(payment.receiveAmount));

  }

  onProcessPayment () {
    console.log("onProcessPayment")
    const {ticket, payment, navigation} = this.props
    if (isInvalidCreditAmount(ticket, payment)) {
      Alert.alert(I18n.t('Payment_Error'), I18n.t('Payment_Error_MSG'))
    } else if (this.isInvalidInputAmount()) {
      Alert.alert(I18n.t('Payment_Error'), I18n.t('Payment_Error_MSG2'))
    } else {
      this.props.onSavePayment()

      //navigation.navigate('ProcessedScreen', {ticketId: ticket.id});
    }
  }

  isReadyToProcess () {
    return !!this.props.payment.receiveAmount
  }

  render () {
    const {updatePayment, payment} = this.props
    return (
      <View>
        {/*<Text style={[styles.header, {textAlign: 'left'}]}>{I18n.t('Select_Payment_Type')}</Text>*/}
        <PaymentTypeButtons
          onPaymentTypeChange={(val) => updatePayment({method: val})}
          selected={payment.method}
        />


        <View style={{height: 120, marginTop: 20}}>
          {this.renderPaymentAmountSuggestions()}
        </View>

        <View style={{marginTop: 20, alignItems: 'center'}}>
          <QMButton
            btnType='green'
            onPress={() => this.onProcessPayment()}
            disabled={!this.isReadyToProcess()}
            full
          >
           {I18n.t('PROCESS_PAYMENT')}
          </QMButton>
        </View>
      </View>
    )
  }
}

PaymentArea.propTypes = {
  onSavePayment: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  price: PropTypes.number.isRequired,
  splitType: PropTypes.string.isRequired
}

export default connect(null, {updatePayment})(PaymentArea)
