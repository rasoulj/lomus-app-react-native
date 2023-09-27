import React, { Component } from 'react'
import { Alert, StyleSheet, Text, View, NativeModules, Dimensions, Image } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../Themes'
import Barcode from 'react-native-barcode-builder'
import moment from 'moment-jalaali'
import { connect } from 'react-redux'
import QRCode from 'react-native-qrcode';

import AppConfig from '../Config/AppConfig'


import Triangle from './Triangle'
import Currency from '../Transforms/Currency'
import ViewShot from 'react-native-view-shot'

import PrinterAndroid from '../Services/PrinterAndroid'
import EmailActions from '../Redux/EmailRedux'
import I18n from 'react-native-i18n'
import {toast, tdeb} from "../Utils/toast"

import {getInit} from '../Services/RasPayment'
import {xprint} from '../Services/RasXPrint'
import store from "react-native-simple-store";

//const XPrinterRas = NativeModules.XPrinterRas;

const NoRial = amount => Currency(amount, 0, '')

const prn = Metrics.prn;

class AmountRow extends Component {
  renderQ(quantity, price) {
    return (
      quantity > 1 ? (
        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Text style={[styles.receiptText1, {fontSize: prn.S}]}>{quantity}</Text>
          <Text style={[styles.receiptText1, {fontSize: prn.S}]}> x </Text>
          <Text style={[styles.receiptText1, {fontSize: prn.S}]}>{price}</Text>
        </View>
      ): (<View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Text style={[styles.receiptText1, {fontSize: prn.S}]}>{I18n.t('one')}</Text>
        </View>
      )
    )
  }

  render () {
    const {quantity, price, total} = this.props
    return (

 <View style={[styles.flexRow, {alignItems: 'center'}]}>

   <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
     <View>
       {this.renderQ(quantity, price)}
     </View>
     <View>
       <Text style={[styles.receiptText1,{textAlign: 'right', fontSize: prn.S}]}>{total}</Text>
     </View>

   </View>

 </View>


    )
  }
}
class Line extends Component {
  renderLine = () => {
    const {number} = this.props

    // Create `n` number of dashes
    let dashes = [...Array(number)]
      .map(n => (<Text style={{flex: 1, color: Colors.black, fontSize: prn.L}}>- </Text>))
    return (<View style={styles.flexRow}>{dashes}</View>)
  }
  render () {
    return (
      <View style={[styles.flexRow, {alignSelf: 'center'}]}>
        {this.renderLine()}
      </View>
    )
  }
}

class Receipt extends Component {
  renderDiscounts = (discount, line) => {
    let discountAmount = discount.discountAmount(line.subtotalPrice)
    return (
      <View style={[styles.flexRow, {alignItems: 'center'}]}>
        <View style={{flex: 1}}>
         <Text style={styles.receiptText1}>(-{NoRial(discountAmount)})</Text>
        </View>
        <View style={{flex: 2}}>
          <Text style={styles.receiptText1}>{discount.name}
            {discount.itemClass === 'PERCENT' ? (
              <Text style={{color: Colors.black}}> ({discount.amount}%)</Text>
            ) : undefined}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.receiptText1, {textAlign: 'left'}}>{I18n.t('Discount')}</Text>
        </View>
      </View>
    )
  }
  renderTicketDiscounts = (discount, sale) => {
    let discountAmount = discount.discountAmount(sale.itemSubtotalWithoutTicket)
    return (
      <View style={styles.flexRow}>
        <View style={{flex: 1}}>
           <Text style={[styles.receiptText2, {textAlign: 'right'}]}>(-{NoRial(discountAmount)})</Text>

        </View>
        <View style={{flex: 2}}>
          <Text style={styles.receiptText2}>{discount.name}
            {discount.itemClass === 'PERCENT' ? (
              < Text > ({discount.amount}%)</Text>
              ) : undefined}
          </Text>
        </View>
        <View style={{flex: 1}}>
            <Text style={styles.receiptText2, {textAlign: 'left'}}>{I18n.t('Discount')}</Text>
        </View>
      </View>
    )
  }
  renderItems = (lineItem) => {
    let name = lineItem.itemVariation.name
    let quantity = lineItem.quantity
    let price = NoRial(lineItem.itemVariation.price)
    let total = NoRial((lineItem.quantity * lineItem.itemVariation.price))

    let lineDiscountList = [] // this.props.lineDiscountList(lineItem)

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text style={{
            fontSize: prn.L,
            //fontWeight: '400',
            textAlign: 'left',
            paddingTop: 0, //15
            fontFamily: pfont,
            color: Colors.black
          }}>{name}</Text>
        </View>
        <AmountRow
          quantity={quantity}
          price={price}
          total={total}
        />
        {/* // --> Line Item Discounts
          lineItem.discountList.map((discount, index) => this.renderDiscounts(discount, lineItem))
        */}
      </View>
    )
  }

  renderCenter(txt) {
    return <View style={{flex: 1}}>
      <Text style={[styles.itemName]}>{txt}</Text>
    </View>
  }

  renderPair(line) {
    return (<View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{flex: 0.3, alignItems: 'flex-start'}}>
        <Text style={[styles.itemInfo]}>{line.k}</Text>
      </View>
      <View style={{flex: 0.7, alignItems: 'flex-end'}}>
        <Text style={[styles.itemInfo]}>{line.v}</Text>
      </View>
    </View>)
  }

  renderPaymentMethod = (payment) => {
    const paymentMethod = payment.method

    const {doPaymentRes, merchant, sale} = this.props;

    //console.log(merchant)

    let alert
    let received = ''
    let more = []
    if (paymentMethod === 'CASH' || !doPaymentRes) {
      if (payment.changeAmount > 0) {
        payment.changeAmount
        alert = I18n.t('Cash_Payment_Change')
        received = `${NoRial(payment.changeAmount)} از ${Currency(payment.receiveAmount)}`
      } else {
        alert = I18n.t('Cash_Payment')
        received = `${Currency(payment.receiveAmount)}`
      }
    } else if (paymentMethod === 'VISA') {
      alert = `VISA Approved\n**** **** **** ${payment.paymentCard.cardNumber}`
      received = `Received ${Currency(payment.receiveAmount)}`
    } else if (paymentMethod === 'DEBIT') {
      alert = 'Debit Approved'
    } else if(paymentMethod === 'CREDIT') {
      let maskPan = ''
      if(doPaymentRes) {
        maskPan = doPaymentRes.MaskPan
        if(maskPan) maskPan = maskPan.split('***').reverse().join('***')
      }
      //alert = I18n.t('payed_with_card') + maskPan
      alert = I18n.t('succ_opt')
      more = !doPaymentRes ? [] : [
        {k: I18n.t('date'), v: moment(sale.time).format('jYYYY/jM/jD - H:mm')},
        {k: I18n.t("peygiri_marja"), v: (doPaymentRes.ReferenceNum ? doPaymentRes.ReferenceNum : '') + "/" + (doPaymentRes.Trace ? doPaymentRes.Trace : '')},
        //{k: I18n.t("Trace"), v: doPaymentRes.Trace ? doPaymentRes.Trace : ''},
        //{k: I18n.t("ReferenceNum"), v: doPaymentRes.ReferenceNum ? doPaymentRes.ReferenceNum : ''},
        //{k: I18n.t("terminalId"), v: this.readFromInit('terminalId')},
        //{k: I18n.t("merchantId"), v: merchant ? merchant.id : ''},
        {k: I18n.t("terminal_pazirandeh"), v: (merchant ? merchant.id : '') + "/" + (this.readFromInit('terminalId'))},
        {k: doPaymentRes.IssuerName, v: maskPan},
      ]
      //received = `Received ${Currency(payment.receiveAmount)}`
    } else {
      alert = 'Unknown Payment Method'
    }

    //console.log(doPaymentRes)

    return (
      /*
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Text style={[styles.receiptText1,{textAlign: 'left', fontSize: prn.L}]}>{alert}</Text>
        </View>
        <View>
          <Text style={[styles.receiptText1,{textAlign: 'right', fontSize: prn.L}]}>{received}</Text>
        </View>

      </View>
      */


      <View>
        {paymentMethod != 'CASH' && this.renderShaparakLogo()}
        {paymentMethod != 'CASH' && <View>
          {this.renderCenter(merchant.name)}
          {[
            {k: I18n.t('postalCode'), v: merchant.postalCode},
            {k: I18n.t('phone'), v: merchant.phone},
          ].map(line => this.renderPair(line))}
          {this.renderLine(40)}
          {this.renderCenter(I18n.t('xarid_resid'))}
        </View>}
        <View style={[styles.itemInfoSection, {paddingTop: '0%'}]}>
          <View style={{flex: 1 ,alignSelf: 'flex-end'}}>
            {this.renderCenter(alert)}
            {received != '' && <View style={{flex: 1}}>
              <Text style={[styles.itemInfo, {fontSize: prn.L, color: Colors.black, textAlign: 'right'}]}>{received}</Text>
            </View>}
            {more.map((line) => this.renderPair(line))}
          </View>
        </View>

      </View>

    )
  }


  takeScreenshotAndPrint = () => {
    this.viewShot.capture().then(
      base64string => {

        xprint(base64string)
          .then(mes => console.log(mes))
          .catch(err => Alert.alert('Cannot access remote printer.'));

        PrinterAndroid.print( // Call native java fucntion to print
          base64string,
          (error) => {
            Alert.alert(I18n.t('Printer_Error'), I18n.t('Printer_Error_MSG'))
            console.tron.display({
              name: '🖨 امکان چاپ رسید وجود ندارد',
              value: error
            })
          }
        )
      }
    )
  }

  sendReceipt = (email) => {
    let senderName = this.props.merchant.name
    this.viewShot.capture().then(
      base64string => {
        this.props.sendEmail(email, base64string, senderName)
      }
    )
  }


  readFromInit(field) {
    return this.state && this.state && this.state.init && this.state.init[field] ? this.state.init[field] : ''
  }

  constructor (props) {
    super(props)
    this.viewShot = null
    this.triangleNumber = 50

    this.state = {
      init: {
        terminalId: '(N/A)',
        cur: {
          Day: -1,
          Number: 1,
          id: ''
        }
      }
    }

    store.get("CUR").then(old => {
      var cur = {Number: 1, id: this.props.sale.receiptId, Day: (new Date()).getDate()}
      if(old) {
        console.log("OLD: " + JSON.stringify(old))
        cur.Number = old.Number;
        if(cur.id != old.id) {
          cur.Number = cur.Day != old.Day ? 1 : cur.Number + 1;
        }
      }

      this.setState({cur: cur})
      store.update("CUR", cur);
      console.log("UPDATE: " + JSON.stringify(cur))

    });

  }
  componentDidMount () {
    this.props.onRef(this)

    getInit().then(init => this.setState({init: init}));


  }
  componentWillUnmount () {
    this.props.onRef(undefined)
  }




  normRecpId(sale) {
    return this.state.cur ? this.state.cur.Number : 0;
    //return cur.Number;
    //return (parseInt(sale.receiptId, 16)%900) + 100
  }

  renderLine(pad) {
    return (<View style={{flex: 1, height: pad}}>
      <View style={{flex: 0.5, borderBottomWidth: 1}} />
      <View style={{flex: 0.5, borderTopWidth: 1}} />
    </View>)
  }

  renderShaparakLogo() {
    return (<View style={{flex: 1, flexDirection: "row", justifyContent: 'center'}}>
      <Image style={{height: 161, width: 268, alignSelf: 'center'}} source={require("../Images/shaparak.png")}/>
    </View>)
  }

  renderHeaderBox() {
    const {sale, merchant, ...rest} = this.props

    const height = 120;
    let box = {flex: 0.2, borderColor: 'black', borderWidth: 2, height: height, alignItems: 'center'};
    let boxMain = {flex: 0.6, backgroundColor: 'white', height: height, justifyContent: 'center'};
    return (<View style={{flex: 1, flexDirection: "row"}}>
        <View style={box}>
          <Text style={[styles.S, {marginBottom: 10, marginTop: 10}]}>{I18n.t('Trans')}</Text>
          <Text style={styles.M}>{this.normRecpId(sale)}</Text>
        </View>
        <View style={boxMain}>
          <Text style={[styles.storeName]}>{merchant.name}</Text>
        </View>
        <View style={box}>
          <Text style={[styles.S, {marginBottom: 10, marginTop: 10}]}>{I18n.t('CustomerCode')}</Text>
          <Text style={styles.M}>123</Text>
        </View>
      </View>
    )
  }

  getCustomerName() {
    return I18n.t('DefaultCustomer')
  }

  getCustomerAddress() {

    const {merchant} = this.props
    console.log(merchant)
    var ad = ''
    if(merchant.city) ad = ad + merchant.city + I18n.t('sep')
    if(merchant.address) ad = ad + merchant.address
    return ad //merchant.city + I18n.t('sep') + merchant.address; //merchant.province + I18n.t('sep') +
  }



  renderMerchantInfo() {
    var ad = this.getCustomerAddress()
    //console.log("ad: " + ad)

    return (<View>
      {<Text style={styles.L}>{I18n.t('DearCustomer')+this.getCustomerName()}</Text>}
      {ad != '' && <Text style={styles.L}>{I18n.t('AddressTitle')+ad}</Text>}
      {!!this.props.merchant.phone && <Text style={styles.L}>{I18n.t('PhoneTitle')+this.props.merchant.phone}</Text>}
    </View>)
  }

  renderSummery() {

  }

  renderFactorRow(vals, isBlack, hasBorder, isBold) {
    const height = 50;
    const margin = 10;
    var box = {
      borderColor: 'black',
      borderWidth: hasBorder ? 2 : 0,
      height: height,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isBlack ? Colors.black : Colors.white,

    };
    var sideBox = [box, {flex: 0.45}]
    var numBox = [box, {flex: 0.1}]
    let text = [
      styles.S,
      {
        color: isBlack ? Colors.white : Colors.black,

        //fontWeight: isBold ? '200' : 'normal'
      }
    ]

    //console.log(vals)

    return (<View style={{flex: 1, flexDirection: "row"}}>
      <View style={[sideBox, {alignItems: 'flex-start'}]}>
        <Text style={[text, {marginLeft: margin}]}>{vals[0]}</Text>
      </View>
      <View style={numBox}>
        <Text style={[text, {fontSize: isBlack ? prn.S : prn.M,}]}>{vals[1]}</Text>
      </View>
      <View style={[sideBox, {alignItems: 'flex-end'}]}>
        <Text style={[text, {marginRight: margin, fontSize: isBlack ? prn.S : prn.M,}]}>{vals[2]}</Text>
      </View>
    </View>)
    //*/
  }

  renderTotal() {
    const {sale, merchant, ...rest} = this.props

    return (<View style={{flex: 1, flexDirection: 'row', marginTop: 13}}>

      <View style={{flex: 0.5, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: Colors.white}}>
        <Text style={[styles.L]}>{I18n.t('fhPayablePrice')}</Text>
      </View>
      <View style={{flex: 0.5, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.black}}>
        <Text style={[styles.L, {color: 'white', marginRight: 10}]}>{Currency(sale.totalPrice)}</Text>
      </View>
    </View>)

  }

  vSpace(space) {
    return (<View style={{height: space}}><Text>{' '}</Text></View>)
  }

  renderNovinPardakht() {
    const {sale, merchant, ...rest} = this.props
    if(!sale.paymentTXs.length) return (<View/>)

    var pt = sale.paymentTXs[0].method
    if(pt == 'CASH') return (<View/>)

    return (<View style={{flex: 1, flexDirection: 'row', marginTop: 13}}>
      <View style={{flex: 0.5, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: Colors.white}}>
        <Text style={[styles.S]}>{I18n.t('pardakht_novin_arian')}</Text>
      </View>
      <View style={{flex: 0.5, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: Colors.white}}>
        <Text style={[styles.S]}>{I18n.t('pardakht_novin_arian_tel')}</Text>
      </View>
    </View>)
  }

  renderFactor() {
    const {sale, merchant, ...rest} = this.props
    return (<View style={{flex: 1, flexDirection: "column", marginTop: 13}}>
        {this.renderFactorRow([I18n.t('fhProduct'), I18n.t('fhNum'), I18n.t('fhTotalPrice')], true)}
        {sale.lineItems.map(line => this.renderFactorRow([line.itemVariation.name, line.quantity, NoRial((line.quantity * line.itemVariation.price))], false, true))}
        {this.renderFactorRow([I18n.t('fhSubSum'), '', NoRial(sale.subtotalPrice)], false, false, true)}
        {this.renderLine(10)}
        {this.renderFactorRow([I18n.t('fhDiscount'), '', "0"], false, false)}
        {this.renderFactorRow([I18n.t('fhTax'), '', NoRial(sale.taxAmount)], false, false)}
        {this.renderLine(10)}
        <View style={{flex: 1, paddingTop: '2%'}} >
          {sale.paymentTXs.length ? this.renderPaymentMethod(sale.paymentTXs[0]) : <View/>}
          {/*sale.paymentTXs.map(payment => this.renderPaymentMethod(payment))*/}
        </View>
        {this.renderLine(10)}
        {this.renderTotal()}
        {this.renderNovinPardakht()}
        {this.renderLine(10)}
      </View>
    )
  }

  render () {
    const {sale, merchant, ...rest} = this.props
    var ad = this.getCustomerAddress();
    //console.log(JSON.stringify(sale))

    let ticketDiscountList = []

    // If we dont' have any data for the receipt
    if (!sale.paymentTXs || sale.paymentTXs.length === 0) {
      console.log("!sale.paymentTXs || sale.paymentTXs.length === 0")
      return (<View/>)
    }

    const payment = sale.paymentTXs[0]
    return (<View nativeID='receipt' style={[{
        backgroundColor: Colors.white,
        justifyContent: 'center'
      }]}>
        <Triangle amount={this.triangleNumber}/>
        <ViewShot ref={(viewShot) => { this.viewShot = viewShot }}
                  options={{format: 'png', result: 'base64', quality: 1}}
        >
          <View style={{backgroundColor: Colors.white, padding: 30, flex: 1}}>
            {this.renderHeaderBox()}
            {this.renderLine(40)}
            {this.renderMerchantInfo()}
            {this.renderFactor()}
            {this.vSpace(20)}
            <View style={{paddingTop: 20, paddingBottom: 20, alignItems: 'center'}}>
              <Text style={{fontSize: prn.S, color: Colors.black, fontFamily: pfont}}>{I18n.t('Thank_you')}</Text>
              <Text style={{fontSize: prn.S, color: Colors.black, fontFamily: pfont}}>{merchant.name}</Text>
              {ad != '' && <Text style={{fontSize: prn.S, color: Colors.black, fontFamily: pfont}}>{ad}</Text>}
            </View>
            <View style={{alignItems: 'center'}}>
              {sale.receiptId && <QRCode
                value={this.normRecpId(sale)}
                size={100}
                bgColor='black'
                fgColor='white'/>}
            </View>
          </View>
        </ViewShot>
        <Triangle amount={this.triangleNumber} style={styles.triangleDown}/>
      </View>
    )
  }

  render2 () {
    const {sale, merchant, ...rest} = this.props

    //console.log(JSON.stringify(sale))

    let ticketDiscountList = []

    // If we dont' have any data for the receipt
    if (!sale.paymentTXs || sale.paymentTXs.length === 0) {
      return (<View/>)
    }

    const payment = sale.paymentTXs[0]
    return (
      <View nativeID='receipt' style={[{
        backgroundColor: Colors.white,
        justifyContent: 'center'
      }]}>
        <Triangle amount={this.triangleNumber}/>
        <ViewShot ref={(viewShot) => { this.viewShot = viewShot }}
                  options={{format: 'png', result: 'base64', quality: 1}}
        >
          <View style={{backgroundColor: Colors.white, padding: 30, flex: 1}}>{/* Snaphot needs a background color */}
            <View style={{
              flex: 1,
              alignItems: 'center',
              paddingTop: '0%',
              paddingBottom: '0%',
              backgroundColor: Colors.white,
              color: Colors.black,
              alignContent: 'center'
            }}>
              <Text style={styles.storeName}>{merchant.name}</Text>
              <Text style={styles.storeAddress}>{merchant.province}{I18n.t('sep')}{merchant.city}{I18n.t('sep')}{merchant.address} </Text>
              <Text style={styles.storeAddress}>{merchant.postalCode}</Text>
              <Text style={styles.storeAddress}>{merchant.phone}</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Line number={50}/>
              <Text style={{color: Colors.black, fontFamily: pfont, direction: 'rtl', fontSize: prn.L}}>{moment(sale.time).format('jYYYY/jM/jD - H:mm')}</Text>
              {sale.receiptId && <Text style={{color: Colors.black, fontFamily: pfont, fontSize: prn.L}}>{I18n.t('Trans')}  {this.normRecpId(sale)}</Text>}
              <Line number={50}/>
            </View>
            {/* -- List Section  -- */}
            <View style={{flex: 1}}>
              { // --> Line Items
                sale.lineItems.map(line => this.renderItems(line))
              }
              <Line number={50}/>
              {/* -- Ticket Discount View -- */}
              <View style={{flex: 1, paddingTop: '1%'}}>
                {sale.discounts.map((discount, index) => this.renderTicketDiscounts(discount, sale))}
              </View>
              {/* -- Subtotal View -- */}
              <View style={[styles.flexRow, {paddingTop: 0}]}>
                <View style={{flex: 3, alignSelf: 'flex-end'}}>
                  <Text style={{fontSize: prn.L, textAlign: 'left', color: Colors.black, fontFamily: pfont}}>{I18n.t('Subtotal')}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontFamily: pfont, fontSize: prn.L, textAlign: 'right', color: Colors.black}}>{NoRial(sale.subtotalPrice)}</Text>
                </View>
              </View>
              {/* -- Tax View -- */}
              <View style={styles.flexRow}>
                <View style={{flex: 3, alignSelf: 'flex-end'}}>
                  <Text style={{fontSize: prn.L, textAlign: 'left', color: Colors.black, fontFamily: pfont}}>{I18n.t('Tax')}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: prn.L, textAlign: 'right', color: Colors.black, fontFamily: pfont}}>{NoRial(sale.taxAmount)}</Text>
                </View>
              </View>
              {/* -- Total View -- */}
              <View style={styles.flexRow}>
                <View style={{flex: 3, alignSelf: 'flex-end'}}>
                  <Text style={{fontSize: prn.L, textAlign: 'left', color: Colors.black, fontFamily: pfont}}>{I18n.t('Total')}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: prn.L, textAlign: 'right', color: Colors.black, fontFamily: pfont}}>{Currency(sale.totalPrice)}</Text>
                </View>
              </View>
              {/* -- Payment View -- */}
              <View style={{flex: 1, paddingTop: '2%'}} >
                {sale.paymentTXs.map(payment => this.renderPaymentMethod(payment))}
              </View>
            </View>
            <View style={[styles.flexRow, {alignSelf: 'center', paddingTop: '1%'}]}>
              <Line number={20}/>
              <Text style={{fontSize: prn.L, color: Colors.black, fontFamily: pfont}}>{I18n.t('Check_Closed')}</Text>
              <Line number={20}/>
            </View>
            <View style={{paddingTop: '1%', paddingBottom: '2%', alignItems: 'center', fontFamily: pfont}}>
              <Text style={{fontSize: prn.M, color: Colors.black, fontFamily: pfont}}>{I18n.t('Thank_you')}</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              {/*<Barcode value={sale.receiptId} format='CODE128' height={50} width={3} s/>*/}
              {sale.receiptId && <QRCode
                value={this.normRecpId(sale)}
                size={100}
                bgColor='black'
                fgColor='white'/>}
            </View>
          </View>
        </ViewShot>
        <Triangle amount={this.triangleNumber} style={styles.triangleDown}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sendingEmail: state.email.sendingEmail,
    emailResult: state.email.result
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendEmail: (email, base64string, senderName) => dispatch(EmailActions.sendEmail(email, base64string, senderName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Receipt)

const pfont = 'normal'
const pw = 'normal'
const styles = StyleSheet.create({
  ...ApplicationStyles.screen,

  S: {
    fontFamily: pfont,
    fontWeight: pw,
    fontSize: 28,
    color: Colors.black
  },
  L: {
    fontFamily: pfont,
    fontWeight: pw,
    fontSize: 40,
    color: Colors.black
  },
  M: {
    fontFamily: pfont,
    fontWeight: pw,
    fontSize: 48,
    color: Colors.black
  },
  X: {
    fontFamily: pfont,
    fontWeight: pw,
    fontSize: prn.X,
    color: Colors.black
  },
  XX: {
    fontFamily: pfont,
    fontWeight: pw,
    fontSize: prn.XX,
    color: Colors.black
  },

  receiptText1: {
    fontFamily: pfont,

    textAlign: 'left',
    //fontWeight: '400',
    fontSize: prn.L,
    color: Colors.black
  },
  receiptText2: {
    fontFamily: pfont,
    textAlign: 'right',
    //fontWeight: '400',
    fontSize: prn.L,
    color: Colors.black
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row'
  },
  receiptBack: {
    flex: 1
  },
  triangleDown: {
    transform: [
      {rotate: '180deg'}
    ]
  },
  storeName: {
    fontFamily: pfont,
    //fontWeight: '800',
    paddingBottom: '0%',
    fontSize: prn.XX,
    textAlign: 'center',
    color: Colors.black
  },
  storeAddress: {
    fontSize: prn.L,
    fontFamily: pfont,
    //fontWeight: '500',
    textAlign: 'center',
    color: Colors.black
  },
  storePhoneNum: {
    fontFamily: pfont,
    fontSize: prn.M,
    //fontWeight: '500',
    textAlign: 'center',
    color: Colors.black
  },
  banner: {
    fontFamily: pfont,
    textAlign: 'center',
    paddingTop: '5%',
    paddingBottom: '5%',
    //fontWeight: '500',
    color: Colors.black
  },
  date: {
    fontFamily: pfont,
    textAlign: 'center',
    paddingTop: '5%',
    paddingBottom: '5%',
    //fontWeight: '500',
    color: Colors.black
  },
  itemName: {
    fontFamily: pfont,
    //fontWeight: '400',
    fontSize: prn.L,
    color: Colors.black,
    textAlign: 'center',

  },
  itemInfo: {
    //fontWeight: '400',
    fontFamily: pfont,
    fontSize: prn.S,
    textAlign: 'left',
    color: Colors.black
  },
  itemTotal: {
    //fontWeight: '400',
    fontFamily: pfont,
    fontSize: prn.X,
    color: Colors.black
  },
  itemInfoSection: {
    fontFamily: pfont,
    flex: 1,
    flexDirection: 'row',
    padding: '1%'
  },
  subtotal: {
    fontFamily: pfont,
    //fontWeight: '500',
    paddingLeft: '2%',
    fontSize: prn.X,
    color: Colors.black
  }
})
