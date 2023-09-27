import React from 'react'
import { connect } from 'react-redux'
import { currentPayment, savePayment, updatePayment } from '../../../Redux/PaymentRedux'
import { activeTicket } from '../../../Redux/SalesRedux'
import { View } from 'react-native'
import sanitizeDecimal from '../../PaymentScreen/sanitizeDecimal'
import SplitPaymentButtons from './SplitPaymentButtons'
import PaymentArea from '../../PaymentScreen/components/PaymentArea'
import Loader from '../../../Components/Loader'
import PropTypes from 'prop-types'
import processPayment, { remainingAmount } from '../../PaymentScreen/processPayment'
import TotalAndRemainingAmounts from '../../PaymentScreen/components/TotalAndRemainingAmounts'
import I18n from 'react-native-i18n'
class AmountSplit extends React.Component {
  setSplitAmount = (val) => {
    const totalPrice = sanitizeDecimal(this.props.ticket.totalPrice)
    const price = totalPrice / val
    // TODO this is repeated too many times. Maybe extract an `updatePaymentAmounts` method?
    this.props.updatePayment({
      receiveAmount: sanitizeDecimal(Number(price)),
      totalAmount: sanitizeDecimal(Number(price))
    })
    this.setState({
      splitAmount: val
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      splitAmount: 2
    }
  }

  setProcessing (processing) {
    this.props.processingStatus(processing)
  }

  paymentAreaPrice () {
    return sanitizeDecimal(this.getTicketTotal() / this.state.splitAmount)
  }

  getTicketTotal () {
    const {ticket} = this.props
    return sanitizeDecimal(ticket.totalPrice)
  }

  isRemaining () {
    let remaining = remainingAmount(this.props.ticket)
    if (remaining > 0) {
      return true
    } else {
      return false
    }
  }

  executeSavePayment () {
    const onSuccess = () => {
      setTimeout(() => this.setProcessing(false), 10)
      if (payment.method === 'CREDIT') {
        navigation.navigate('CardSwipeScreen', {ticketId: ticket.id, isRemaining: this.isRemaining()})
      } else {
        if (!this.isRemaining()) {
          navigation.navigate('ProcessedScreen', {ticketId: ticket.id})
        }
      }
    }

    const onFailure = () => {
      navigation.navigate('TransactionFailedScreen', {splitType: 'AMOUNT', errorMessage: I18n.t('Error_split_amount')})
      this.setProcessing(false)
    }

    const {ticket, merchantId, userId, payment, navigation} = this.props
    return processPayment({ticket, payment, merchantId, userId})
      .then(onSuccess)
      .catch(onFailure)
  }

  savePayment () {
    this.setProcessing(true)// Processing payments
    this.executeSavePayment()
  }

  render () {
    const {navigation, ticket, payment} = this.props
    return (
      <View style={{paddingBottom: 20}}>
        <SplitPaymentButtons
          setSplitAmount={(val) => this.setSplitAmount(val)}
          selected={this.state.splitAmount}
        />
        <TotalAndRemainingAmounts
          remaining={remainingAmount(this.props.ticket)}
          totalPrice={this.getTicketTotal()}
        />
        <PaymentArea
          navigation={navigation}
          ticket={ticket}
          payment={payment}
          onSavePayment={() => this.savePayment()}
          price={this.paymentAreaPrice()}
          splitType='AMOUNT'
        />
      </View>
    )
  }
}

AmountSplit.propTypes = {
  ticket: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  payment: currentPayment(state),
  ticket: activeTicket(state),
  merchantId: state.api.merchantId.toString(),
  userId: state.emp.selectedEmployee.id
})

export default connect(
  mapStateToProps,
  {updatePayment, savePayment}
)(AmountSplit)
