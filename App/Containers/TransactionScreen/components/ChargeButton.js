import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import QMButton from '../../QMButton'
import { remainingAmount } from '../../PaymentScreen/processPayment'
import { connect } from 'react-redux'
import { ApplicationStyles } from '../../../Themes'
import FlagActions from '../../../Redux/FlagRedux'
import { updatePayment } from '../../../Redux/PaymentRedux'
import I18n from 'react-native-i18n'

class ChargeButton extends React.Component {
  onPressCharge = () => {
    const {navigate, ticket, setPaymentProcessing, updatePayment} = this.props

    const remaining = remainingAmount(ticket)

    updatePayment({
      receiveAmount: Number(remaining),
      totalAmount: Number(remaining)
    })
    setPaymentProcessing(true)
    navigate('PaymentScreen')
  }

  hasLineItems () {
    const {ticket} = this.props
    if (ticket && ticket.lineItems) {
      return ticket.lineItems.length > 0
    }

    return false
  }

  renderButton () {
    return (
      <QMButton
        //style={[styles.primaryBtn, {padding: 5, elevation: 0}]}
        btnType='charge'
        onPress={() => this.onPressCharge()}
        //full
      >{I18n.t('CHARGE')}</QMButton>
    )
  }

  render () {
    return this.hasLineItems() ? this.renderButton() : <View/>;
  }
}

ChargeButton.propTypes = {
  ticket: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})

const {setPaymentProcessing} = FlagActions
const mapDispatchToProps = {
  setPaymentProcessing,
  updatePayment
}

export default connect(null, mapDispatchToProps)(ChargeButton)
