import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Image } from 'react-native'

import QMButton from '../../QMButton'
import TotalDiscount from '../../../Components/TotalDiscount'

import { ApplicationStyles, Colors } from '../../../Themes'
import Currency from '../../../Transforms/Currency'
import ResetTicketButton from '../../ResetTicketButton'
import LineItemDetails from './LineItemDetails'

import I18n from 'react-native-i18n'
import Fonts from "../../../Themes/Fonts";
import Icon from 'react-native-vector-icons/Ionicons'

export default class TicketDetails extends React.Component {
  taxes () {
    return this.props.ticket.taxAmount
  }

  renderRowPrice(price, icon, title, clr) {
    return (<View style={{flex: 1, flexDirection: 'row'}}>
      <Icon name={icon} size={40} style={{color: 'rgb(177,182,204)'}} />
      <Text style={styles.priceText}>&nbsp;&nbsp;&nbsp;{I18n.t(title)}</Text>
      <Text style={[styles.priceText, {color: clr}]}> {Currency(price)}</Text>
    </View>)
  }

  renderLineItems () {
    const {ticket} = this.props
    const lineItems = ticket.lineItems

    var lines = lineItems.map(line => (
      <LineItemDetails key={line.id} line={line} navigate={this.props.navigate} />
    )).reverse()

    return lineItems.length > 0 ? lines : <Image style={{width: "100%"}} source={require("../../../Images/empty_basket.png")} />
  }

  totalDiscountAmount (index) {
    const {ticket} = this.props
    return ticket.discounts[index].discountAmount(ticket.itemSubtotalWithoutTicket)
  }

  renderTicketLevelDiscounts () {
    const {ticket, navigate} = this.props

    return ticket.discounts.map((value, index) => (
      <TotalDiscount
        key={index}
        value={value}
        navigate={navigate}
        amount={this.totalDiscountAmount(index)}
      />
    ))
  }

  renderDiscountsSection () {
    const {ticket, navigate} = this.props
    const {subtotalPrice, taxAmount, totalPrice} = ticket

    return (
      <View>
        <View style={styles.subSection}>
          {this.renderTicketLevelDiscounts()}
        </View>
        {ticket.discounts && ticket.discounts.length > 0 &&
        <View style={{paddingTop: 10, borderBottomWidth: 1, borderBottomColor: '#ddd'}} />
        }
        <View style={styles.subSection}>
          {this.renderRowPrice(subtotalPrice, 'ios-restaurant', 'Sub_Total', 'black')}
          {this.renderRowPrice(taxAmount, 'ios-copy', 'tax', 'black')}
        </View>
        <View style={{paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#ddd'}} />
        <View style={styles.subSection}>
          {this.renderRowPrice(totalPrice, 'ios-cash', 'total3', Colors.ui_back)}
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

  render () {
    // : <Image style={{width: "100%"}} source={require("../../Images/empty_basket.png")} />}

    return (
      <View style={styles.section}>
        {this.renderLineItems()}
        {this.renderDiscountsSection()}
      </View>
    )
  }
}

TicketDetails.propTypes = {
  ticket: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired
}

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
