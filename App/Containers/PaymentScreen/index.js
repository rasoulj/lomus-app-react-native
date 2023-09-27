import React, { Component } from 'react'
import {Alert, NativeModules, StyleSheet, Text, View, FlatList} from 'react-native'
import ScrollView from '../../Components/QMScrollView'
import QMButton from '../QMButton'
import { connect } from 'react-redux'
import { ApplicationStyles } from '../../Themes/index'
import Loader from '../../Components/Loader'
import { activeTicket, createNewTicket } from '../../Redux/SalesRedux'
import PaymentArea from './components/PaymentArea'
import sanitizeDecimal from './sanitizeDecimal'
import LeftHeader from '../../Components/LeftHeader'
import TotalAndRemainingAmounts from './components/TotalAndRemainingAmounts'
import { currentPayment } from '../../Redux/PaymentRedux'
import processPayment, { remainingAmount } from './processPayment'
import ApiActions from '../../Redux/ApiRedux'
import FlagActions from '../../Redux/FlagRedux'
import I18n from 'react-native-i18n'
import {tdeb, toast} from "../../Utils/toast";
import AppConfig from "../../Config/AppConfig";
import store from "react-native-simple-store";
import Currency from "../../Transforms/Currency";
import {Colors} from "../../Themes";
import Icon from 'react-native-vector-icons/Ionicons'
import Gradient from '../../Components/Gradient'





class PaymentScreen extends Component {
  static navigationOptions = ({navigation, setPaymentProcessing}) => ({
    //title: I18n.t('Payment') ,
    title: <Text style={styles.hStyle}>{I18n.t('Payment')}</Text>,
    headerLeft: <LeftHeader navigation={navigation} cancelPaymentProcessing />
  })

  state = {
    processing: false,
    isSplitPayment: false,
    splitAmount: 1,
    type: "normal"
  }

  setProcessing = (val) => {
    this.setState({processing: val})
  }

  getTotalPrice = () => {
    // TODO this sanetizeDecimal thing needs to go to the domain object. Search for other occurrences
    return sanitizeDecimal(this.props.ticket.totalPrice)
  }

  componentWillMount () {
    // **** //
    // *** --> Every time we open the app, this looks for remaining and if there is none,
    // *** --> it resets the ticket even if app was closed in processed screen
    // **** //
    const {ticket} = this.props
    if (remainingAmount(ticket) <= 0) {
      // Set timeout func makes this async..!
      // => Perevents Reduces may not dispatch acrtions error on start up
      setTimeout(() => {
        this.props.navReset()
        this.props.createNewTicket()
        this.props.setPaymentProcessing(false)
      }, 0)
    }
  }


  executeSavePayment () {

    var startTime = new Date();

    const onSuccess = () => {

      //console.log(((new Date() - startTime)/1000)+"  (secs)");

      console.log("End of SavePayment")

      if (payment.method === 'CREDIT') {
        //console.log(payment.method)

        navigation.navigate('CardSwipeScreen', {
          paymentId: payment.id,
          ticketId: ticket.id,
          isRemaining: false,
          amount: this.getTotalPrice()+"",
          loading: true,
          setRetry: () => this.setRetry()
        })
        //navigation.navigate('CardSwipeScreen', {paymentId: payment.id, ticketId: ticket.id, isRemaining: false, amount: this.getTotalPrice()+"", loading: true, setRetry: this.setRetry().bind(this)})
        //this.swipCard(true)
        //tdeb(ticket)

        /*
        doPayment(this.getTotalPrice()+'').then(res => {
          if(res == "OK") {
            navigation.navigate('ProcessedScreen', {ticketId: ticket.id})
          }
        })
        //*/

      } else {
        //try {

          navigation.navigate('ProcessedScreen', {ticketId: ticket.id})

        /*
        } catch (err) {
          console.log("**Er in navigation")
          console.log(err)
        }
        //*/
      }
      //*/

      this.setProcessing(false)
    }
    const onFailure = (err) => {
      console.log(err)
      navigation.navigate('TransactionFailedScreen', {splitType: 'ONE', errorMessage: I18n.t('Transaction_Cancelled')})
      //swipCard(false)
      //Alert.alert("Error");
      this.setProcessing(false)
    }



    let type = this.state.type
    const {ticket, merchantId, userId, payment, navigation} = this.props

    console.log(type)

    return processPayment({ticket, payment, merchantId, userId, type})
      .then(onSuccess)
      .catch(onFailure)
  }

  setRetry() {
    this.setState({type: "retry"});
  }

  savePayment () {
    console.log("Start of SavePayment")
    this.setProcessing(true)// Processing payments
    this.executeSavePayment()
  }

  onClickSplitPayment () {
    this.props.navigation.navigate('SplitPaymentScreen')
  }

  renderBody () {
    const {processing} = this.state
    const totalPrice = this.getTotalPrice()
    const {remaining, ticket, payment} = this.props

    return (
      <View>
        {processing && <Text style={[styles.header]}>{I18n.t('Preparing_Transaction')}</Text>}
        <Loader loading={this.state.processing}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TotalAndRemainingAmounts totalPrice={totalPrice} remaining={remaining} />
            <View style={{flex: 1}}>
{/*
              <QMButton onPress={() => this.onClickSplitPayment()}>
                {I18n.t('Split_Payment')}
              </QMButton>
*/}
            </View>
          </View>
          <PaymentArea
            navigation={this.props.navigation}
            ticket={ticket}
            payment={payment}
            onSavePayment={() => this.savePayment()}
            price={this.getTotalPrice() / this.state.splitAmount}
            splitType='ONE'
          />
        </Loader>
      </View>
    )
  }

  renderItem(item) {

    const line = item.item

    return (<View style={{flex: 1, flexDirection: 'row', marginLeft: 20, marginRight: 20, height: 40, borderBottomWidth: 1, borderColor: "#ddd"}}>
      <View style={{flex: 0.5}}>
        <Text style={styles.field}>{line.itemVariation.name}</Text>
      </View>
      <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Text style={styles.field}>
          {(line.quantity)}
        </Text>
        <Text style={styles.field}> x </Text>
        <Text style={styles.field}>
          {Currency(line.itemVariation.price)}
        </Text>
      </View>
    </View>)
    //*/
  }

  renderRowPrice(price, icon, title, clr) {
    return (<View style={{flex: 1, flexDirection: 'row', marginLeft: 20}}>
      <Icon name={icon} size={40} style={{color: 'rgb(177,182,204)'}} />
      <Text style={styles.priceText}>&nbsp;&nbsp;&nbsp;{I18n.t(title)}</Text>
      <Text style={[styles.priceText, {color: clr}]}> {Currency(price)}</Text>
    </View>)
  }

  renderDiscountsSection () {
    const {ticket, navigate} = this.props
    const {subtotalPrice, taxAmount, totalPrice} = ticket

    return (
      <View style={{marginTop: 40}}>
        <View style={styles.subSection}>
          {this.renderRowPrice(subtotalPrice, 'ios-restaurant', 'Sub_Total', Colors.secondary)}
          {this.renderRowPrice(taxAmount, 'ios-copy', 'tax', Colors.secondary)}
        </View>
        <View style={{paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#ddd'}} />
        <View style={styles.subSection}>
          {this.renderRowPrice(totalPrice, 'ios-cash', 'total3', Colors.secondary)}
        </View>
        {/*<View style={{paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#ddd'}} />
        <View style={styles.subSection}>
          <QMButton onPress={() => navigate('DiscountScreen', {screenType: 'ticketDiscount'})}>
           {I18n.t('ADD_TICKET_DISCOUNT')}
          </QMButton>
          <ResetTicketButton />
        </View>*/}
      </View>
    )
  }


  renderTicket() {
    const {ticket} = this.props
    const lineItems = ticket.lineItems

    return (<ScrollView style={{flex: 1, backgroundColor: "#eee"}}>
      <FlatList data={lineItems} renderItem={(line) => this.renderItem(line)} style={{marginTop: 40}} />
      {this.renderDiscountsSection()}
    </ScrollView>)
  }

  render () {

    return (
      <View style={styles.mainContainer}>
        <View style={{flex: 3, flexDirection: 'row'}}>
          {this.renderTicket()}
          <Gradient
            width={16}
            color='#000'
            maxOpacity={0.07}
            style={{ right: 0 }}/>
          <View style={{flex: 2}}>
            <ScrollView style={[styles.container]}>
              <View style={styles.section}>
                {this.renderBody()}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  payment: currentPayment(state),
  ticket: activeTicket(state),
  remaining: remainingAmount(activeTicket(state)),
  merchantId: state.api.merchantId.toString(),
  userId: state.emp.selectedEmployee.id
})

const {navReset} = ApiActions
const {setPaymentProcessing} = FlagActions
export default connect(mapStateToProps, {createNewTicket, navReset, setPaymentProcessing})(PaymentScreen)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  subSection: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  priceText: {
    fontFamily: 'normal',
    color: "rgb(91,95,107)",
    fontSize: 23,
    textAlign: 'left',

  }
})
