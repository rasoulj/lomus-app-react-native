import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import QMButton from './QMButton'
import Receipt from '../Components/Receipt'
import ScrollView from '../Components/QMScrollView'
import Currency from '../Transforms/Currency'

import { ApplicationStyles, Colors } from '../Themes'

import ApiActions from '../Redux/ApiRedux'
import { actionCreators as SalesActions } from '../Redux/SalesRedux'
import FlagActions from '../Redux/FlagRedux'
import { connectRealm } from 'react-native-realm'
import SendEmail from './components/SendEmail'
import I18n from 'react-native-i18n'
class ProcessedScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    //title: I18n.t('Payment_Processed'),
    title: <Text style={styles.hStyle}>{I18n.t('Payment_Processed')}</Text>,
    headerLeft: <Text />
  })

  state = {
    isEmail: false,
    isPrint: false,
    isBoth: false,
    emailTriggered: false
  }

  componentDidMount() {
    console.log("Processed Screen completed ....")
  }

  getTotalReceivedAmount = () => this.getTicket().totalPrice

  getTotalReceivedAmount2 = () => {
    let ticket = this.getTicket()
    let receivedAmount = 0
    if (ticket.paymentTXs) {
      ticket.paymentTXs.map(payment => {
        if (payment.receiveAmount) {
          receivedAmount += payment.receiveAmount
        }
      })
    }
    return receivedAmount
  }

  getChange = () => {
    let ticket = this.getTicket()
    let change = 0
    if (ticket.paymentTXs) {
      ticket.paymentTXs.map(payment => {
        if (payment.changeAmount) {
          change += payment.changeAmount
        }
      })
    }
    return change
  }

  getTicket = () => {
    return this.props.activeTicket
  }

  // TODO We might use componentWillUnmount maybe?
  newTransaction = () => {
    this.props.setPaymentProcessing(false)
    this.props.createNewTicket()
    this.props.navReset()
  }

  buttonPressed = (button) => {
    if (button === I18n.t('EMAIL')) {
      this.setState({
        email: undefined,
        isEmail: !this.state.isEmail,
        isPrint: false,
        isBoth: false
      })
    } else if (button === I18n.t('PRINT')) {
      if (!this.state.isPrint) {
        this.receipt.takeScreenshotAndPrint()
        //this.receipt.takeScreenshotAndPrint()
      }
      this.setState({
        isEmail: false,
        isPrint: !this.state.isPrint,
        isBoth: false
      })
    } else if (button === I18n.t('BOTH')) {
      if (!this.state.isBoth) {
        this.receipt.takeScreenshotAndPrint()
      }
      this.setState({
        email: undefined,
        isEmail: false,
        isPrint: false,
        isBoth: !this.state.isBoth
      })
    } else if(button == I18n.t('NO_THANKS')) this.onDismiss()
  }

  isButtonPressed = (button) => {
    if (button === I18n.t('EMAIL')) {
      return this.state.isEmail
    } else if (button === I18n.t('PRINT')) {
      return this.state.isPrint
    } else if (button === I18n.t('BOTH')) {
      return this.state.isBoth
    }
  }

  onDismiss () {
    //this.props.navigation.navigate('PaymentScreen')
    this.newTransaction();
  }

  renderLoader () {
    return (
      <View style={{paddingBottom: 30, flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 2}} />
        <View style={{flex: 1}}>
          <ActivityIndicator size={40} color={Colors.primary} />
        </View>
        <View style={{flex: 5}}>
          <Text style={[styles.text, {textAlign: 'right'}]}>{I18n.t('EMAIL_SENT')}</Text>
        </View>
      </View>
    )
  }

  renderEmailInput () {
    const onSendEmail = (email) => {
      this.setState({emailTriggered: true})
      this.receipt.sendReceipt(email)
    }

    return <SendEmail onSend={email => onSendEmail(email)} />
  }

  renderEmailSendoutStatus () {
    if (!this.props.emailResult) {
      return this.renderLoader()
    }

    const status = this.props.emailResult === 'queued' ? I18n.t('EMAIL_SENT') : I18n.t('EMAIL_SENDING_FAILED')
    return (
      <View style={{paddingBottom: 30, flex: 1, alignItems: 'center'}}>
        <Text style={[styles.text, {textAlign: 'center', fontSize: 25}]}>
          {status}
        </Text>
      </View>
    )
  }

  renderEmailSection () {
    if (this.state.emailTriggered) {
      return this.renderEmailSendoutStatus()
    }
    return this.renderEmailInput()
  }

  renderReceiptOptions () {
    //return [I18n.t('EMAIL'), I18n.t('PRINT'), I18n.t('BOTH')].map(option => (
    return [I18n.t('PRINT'), I18n.t('NO_THANKS')].map(option => (
      <View key={option} style={{flex: 1}}>
        <QMButton
          key={option}
          isSelected={this.isButtonPressed(option)}
          onPress={() => this.buttonPressed(option)}
        >
          {option}
        </QMButton>
      </View>
    ))
  }

  shouldRenderEmailSection () {
    return this.state.isEmail || this.state.isBoth
  }

  render () {

    const sale = this.getTicket()

    return (
      <View style={[styles.mainContainer, styles.halfView]}>
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Text style={[styles.header, {marginTop: -30}]}>
             {I18n.t('Out_of')} {Currency(this.getTotalReceivedAmount())}
            </Text>
            <Text style={[styles.text, {marginTop: -20}]}>
              {I18n.t('Change')} {Currency(this.getChange())}
            </Text>
            <Text style={[styles.header]}>{I18n.t('Thank_you')}</Text>
            <Text style={[styles.header, {textAlign: 'left'}]}>{I18n.t('need_receipt')}</Text>
            <View style={{flex: 1, flexDirection: 'row', paddingBottom: '5%'}}>
              {this.renderReceiptOptions()}
            </View>
            {this.shouldRenderEmailSection() && this.renderEmailSection()}
            {/*<QMButton onPress={() => this.onDismiss()}>
             {I18n.t('NO_THANKS')}
            </QMButton>*/}
          </View>
          <View style={{marginBottom: 20, backgroundColor: Colors.gray, padding: 20}}>
            <Receipt
              onRef={ref => (this.receipt = ref)}
              sale={sale}
              doPaymentRes={this.props.doPaymentRes}
              merchant={this.props.merchant}
            />
          </View>
          <View style={styles.section}>
            <QMButton full onPress={() => { this.newTransaction() }}>
             {I18n.t('NEW_TRANSACTION')}
            </QMButton>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const RealmConnected = connectRealm(ProcessedScreen, {
  schemas: ['SaleTX'],
  mapToProps: (results, realm, ownProps) => ({
    realm,
    activeTicket: results.saleTxes.find(item => item.id === ownProps.navigation.state.params.ticketId),
    doPaymentRes: ownProps.navigation.state.params.doPaymentRes
  })
})

const mapStateToProps = (state) => ({
  merchant: state.api.merchant,
  selectedEmployee: state.emp.selectedEmployee,
  sendingEmail: state.email.sendingEmail,
  emailResult: state.email.emailResult
})

const mapDispatchToProps = (dispatch) => {
  return {
    createNewTicket: () => dispatch(SalesActions.createNewTicket()),
    navReset: () => dispatch(ApiActions.navReset()),
    setPaymentProcessing: (val) => dispatch(FlagActions.setPaymentProcessing(val))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RealmConnected)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})
