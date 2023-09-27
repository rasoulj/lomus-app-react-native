import React from 'react'
import { StyleSheet, Text, ScrollView } from 'react-native'
import QMButton from './QMButton'
import { connect } from 'react-redux'
import ApiActions from '../Redux/ApiRedux'
import FlagActions from '../Redux/FlagRedux'
import { currentPayment } from '../Redux/PaymentRedux'
import { activeTicket, splitTicket, createNewTicket } from '../Redux/SalesRedux'
import processPayment, { remainingAmount } from './PaymentScreen/processPayment'
import { ApplicationStyles, Colors } from '../Themes'
import Loader from '../Components/Loader'
import excludeSplitTicketItemsFromMainTicket from './SplitPaymentScreen/components/ItemSplit/splitTicketItems'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import I18n from 'react-native-i18n'
class TransactionFailedScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    header: null
  })

  constructor(props) {
    super(props)
    const {splitType, errorMessage} = this.props.navigation.state.params
    this.state = {
      trying: false,
      splitType: splitType,
      errorMessage: errorMessage
    }
  }

  setProcessing(val) {
    this.setState({trying: val})
  }

  newTransaction = () => {
    this.props.setPaymentProcessing(false)
    this.props.createNewTicket()
    this.props.navReset()
  }


  isRemaining () {
    if (remainingAmount(this.getTheRetryTicket()) <= 0) {
      return false
    } else {
      return true
    }
  }

  isCardPayment () {
    const {payment} = this.props
    if (payment.method === 'CREDIT') {
      return true
    } else {
      return false
    }
  }

  isSplitItem() {
    // Get the split type of error to determine ticket
    if (this.state.splitType === 'ITEM') {
      return true
    } else {
      return false
    }
  }

  getTheRetryTicket() {
    // Change ticket if error happened in split by item process
    const {ticket, splitTicket} = this.props
    if (this.isSplitItem()) {
      return splitTicket
    } else {
      return ticket
    }
  }

  executeRetryPayment () {
    this.setProcessing(true)
    const onSuccess = () => {
      if (this.isCardPayment()) {
        navigation.navigate('CardSwipeScreen', {paymentId: payment.id, ticketId: retryTicket.id, isRemaining: this.isRemaining()})
      } else {
        navigation.navigate('ProcessedScreen', {ticketId: retryTicket.id})
      }
      if (this.isSplitItem()) {
        excludeSplitTicketItemsFromMainTicket({splitTicket, ticket})
      }
      this.setProcessing(false)
    }
    const onFailure = () => {
      setTimeout(() => this.setProcessing(false), 1000)
    }
    const {splitTicket, ticket, merchantId, userId, payment, navigation} = this.props
    let type = 'retry' // Say payment process that this is retry
    let retryTicket = this.getTheRetryTicket()
    return processPayment({ticket: retryTicket, payment, merchantId, userId, type})
      .then(onSuccess)
      .catch(onFailure)
  }

  render () {
    return (
      <ScrollView style={[styles.mainContainer, styles.mainScrollView]}>
        <ErrorHeader errorMessage={this.state.errorMessage} />
        <Icon style={{alignSelf: 'center', color: Colors.white}}
              size={150}
              name='cloud-off-outline' />
        <Text style={[styles.header, { color: Colors.white }]}
        >{I18n.t('Connection_Lost')}</Text>
        <Loader loading={this.state.trying} color={Colors.white} >
          <QMButton full
            onPress={() => this.executeRetryPayment()}
            btnType='error'
          >{I18n.t('TRY_AGAIN')}</QMButton>
          <QMButton
            onPress={() => this.newTransaction()}
            btnType='error'
          >{I18n.t('CANCEL_TRANSACTION')}</QMButton>
        </Loader>
      </ScrollView>
    )
  }
}

class ErrorHeader extends React.Component {
  render() {
    return (
      <Text style={[styles.header, { color: Colors.white }]}
      >{this.props.errorMessage}</Text>
    )
  }
}

ErrorHeader.defaultProps = {
  errorMessage: I18n.t('Transaction_Cancelled')
}

const mapStateToProps = (state) => ({
  payment: currentPayment(state),
  ticket: activeTicket(state),
  splitTicket: splitTicket(state),
  remaining: remainingAmount(activeTicket(state)),
  merchantId: state.api.merchantId.toString(),
  userId: state.emp.selectedEmployee.id
})

const {navReset} = ApiActions
const {setPaymentProcessing} = FlagActions
export default connect(mapStateToProps, {createNewTicket, navReset, setPaymentProcessing})(TransactionFailedScreen)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  mainScrollView: {
    paddingTop: '5%',
    backgroundColor: '#fc5863',
    paddingLeft: '10%',
    paddingRight: '10%'
  }
})
