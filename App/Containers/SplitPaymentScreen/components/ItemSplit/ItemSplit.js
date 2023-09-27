import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import LineItemChoice from '../LineItemChoice'
import { connect } from 'react-redux'
import { currentPayment, putIntoCurrentSplit, updatePayment } from '../../../../Redux/PaymentRedux'
import { createSplitTicket, splitTicket } from '../../../../Redux/SalesRedux'
import sanitizeDecimal from '../../../PaymentScreen/sanitizeDecimal'
import PaymentArea from '../../../PaymentScreen/components/PaymentArea'
import processPayment, { remainingAmount } from '../../../PaymentScreen/processPayment'
import TotalAndRemainingAmounts from '../../../PaymentScreen/components/TotalAndRemainingAmounts'
import excludeSplitTicketItemsFromMainTicket from './splitTicketItems'
import I18n from 'react-native-i18n'
class ItemSplit extends React.Component {
  setProcessing = (val) => {
    this.props.processingStatus(val)
    this.setState({
      processing: val
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      updated: new Date(),
      processing: false
    }
  }

  onLineUpdate () {
    const remaining = this.calculateSplitTotal()
    this.props.updatePayment({
      receiveAmount: Number(remaining),
      totalAmount: Number(remaining)
    })
    this.setState({updated: new Date()})
  }

  savePayment () {
    const {ticket, splitTicket, payment, merchantId, userId, navigation} = this.props
    this.setProcessing(true)// Processing payments
    const onSuccess = () => {
      console.tron.display({
        name: '🌩 On onSuccess dont fo transaction failed screen',
        value: {
          ticket,
          splitTicket,
          payment
        }
      })
      if (payment.method === 'CREDIT') {
        navigation.navigate('CardSwipeScreen', {ticketId: splitTicket.id, isRemaining: false})
      } else {
        navigation.navigate('ProcessedScreen', {ticketId: splitTicket.id})
      }
      excludeSplitTicketItemsFromMainTicket({splitTicket, ticket})
      this.setProcessing(false)
    }
    const onFailure = (err) => {
      console.tron.display({
        name: '☄️ ON FAILUREEE',
        value: {
          err
        }
      })
      navigation.navigate('TransactionFailedScreen', {splitType: 'ITEM', errorMessage: I18n.t('Error_split')})
      this.setProcessing(false)
    }
    return processPayment({ticket: splitTicket, payment, merchantId, userId})
      .then(onSuccess)
      .catch(onFailure)
  }

  renderLineItemChoices () {
    return this.props.ticket.lineItems.map(item => (
      <LineItemChoice
        key={item.id}
        item={item}
        ticket={this.props.ticket}
        splitTicket={this.props.splitTicket}
        onUpdate={() => this.onLineUpdate()}
      />
    ))
  }

  calculateSplitTotal () {
    const {splitTicket} = this.props
    return sanitizeDecimal(splitTicket.totalPrice)
  }

  renderSplitTotal () {
    const total = this.calculateSplitTotal()

    return (
      <TotalAndRemainingAmounts remaining={remainingAmount(this.props.splitTicket)} totalPrice={total} />
    )
  }

  renderPaymentArea () {
    const {payment, splitTicket} = this.props
    return (
      <PaymentArea
        navigation={this.props.navigation}
        ticket={splitTicket}
        payment={payment}
        onSavePayment={() => this.savePayment()}
        price={this.calculateSplitTotal()}
        splitType='ITEM' // --> To check inputs and other staff based on the split method
      />
    )
  }

  render () {
    const {splitTicket} = this.props
    if (!splitTicket) {
      return false
    }

    return (
      <View>
        {this.renderLineItemChoices()}
        {this.renderSplitTotal()}
        {this.renderPaymentArea()}
      </View>
    )
  }
}

ItemSplit.propTypes = {
  ticket: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => ({
  payment: currentPayment(state),
  splitTicket: splitTicket(state),
  merchantId: state.api.merchantId.toString(),
  userId: state.emp.selectedEmployee.id
})

export default connect(
  mapStateToProps,
  {putIntoCurrentSplit, createSplitTicket, updatePayment}
)(ItemSplit)
