import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'

import LineQuantityAdjust from './LineQuantityAdjust'
import LineItemDiscount from '../../../Components/LineItemDiscount'
import Nameplate from '../../../Components/Nameplate'

import QMButton from '../../QMButton'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Swipeout from 'react-native-swipeout'

import { ApplicationStyles, Colors } from '../../../Themes/index'
import Currency from '../../../Transforms/Currency'
import { LineItemService } from '../../../Realm/RealmService'
import I18n from 'react-native-i18n'
import stringHash from "string-hash";




class LineSwipeout2 extends React.Component {
  updateLineQuantity (line) {
    if (line.quantity === 0) {
      LineItemService.delete(line)
    }
  }

  render () {
    const {line, navigate} = this.props
    return (
      <Swipeout
        backgroundColor={Colors.white}
        left={[{
          backgroundColor: Colors.white,
          onPress: () => navigate('DiscountScreen', {screenType: 'itemDiscount', id: line.id}),
          component: <View style={{padding: 10}}>
            <QMButton
              onPress={() => navigate('DiscountScreen', {screenType: 'itemDiscount', id: line.id})}
              full>
              {I18n.t('Discount')}
            </QMButton>
          </View>
        }]}
        right={[{
          backgroundColor: Colors.white,
          component: <LineQuantityAdjust
            line={line}
            onChange={line => this.updateLineQuantity(line)}
          />
        }]}
        autoClose
        buttonWidth={200}>
        {this.props.children}
      </Swipeout>
    )
  }

}

class LineSwipeout extends React.Component {

  render () {
    const {line, navigate} = this.props
    return (
      <Swipeout
        backgroundColor={Colors.white}
        left={[{
          backgroundColor: Colors.white,
          onPress: () => navigate('DiscountScreen', {screenType: 'itemDiscount', id: line.id}),
          component: <View style={{padding: 10}}>
            <QMButton
              onPress={() => navigate('DiscountScreen', {screenType: 'itemDiscount', id: line.id})}
              full>
              {I18n.t('Discount')}
            </QMButton>
          </View>
        }]}
        right={[{
          backgroundColor: Colors.white,
          component: <LineQuantityAdjust
            line={line}
            onChange={line => this.updateLineQuantity(line)}
          />
        }]}
        autoClose
        buttonWidth={200}>
        {this.props.children}
      </Swipeout>
    )
  }

}

const colors = ['#FF02A9', '#4D08FF', '#009D45', '#210535']

const DefH = 90

export default class LineItemDetails extends React.Component {
  lineDiscountAmount = (line, index) => {
    return line.discountList[index].discountAmount(line.subtotalPrice)
  }
  renderLineDiscounts () {
    const {line, navigate} = this.props

    return line.discountList.map((value, index) => (
      <LineItemDiscount
        id={line.id}
        key={index}
        amount={this.lineDiscountAmount(line, index)}
        value={value}
        navigate={navigate}
      />
    ))
  }

  revText (text) {
    return text.split(' ').reverse().join(' ')
  }

  renderItemQuantityMultiplier () {
    const {line} = this.props

    return (
      <View style={{flex: 3, flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Text style={styles.text}>
          {(line.quantity)}
        </Text>
        <Text style={styles.text}> x </Text>
        <Text style={styles.text}>
          {Currency(line.itemVariation.price)}
        </Text>
      </View>
    )
  }

  renderLineNameAndPrice () {
    const {line} = this.props
    const hasMoreThanOneItem = line.quantity > 1

    return (

      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Text style={[styles.multipleItemMultiplier, {fontSize: 22, fontFamily: 'normal'}] }>{Currency(line.subtotalPrice)}</Text>
        </View>

        {hasMoreThanOneItem && this.renderItemQuantityMultiplier()}
      </View>
    )
  }

  getItemInitials = (item) => {
    return item.name.substring(0, 2)
  }
  getItemColor () {
    const colorChoice = stringHash(this.props.line.itemVariation.name) % colors.length
    return colors[colorChoice]
  }

  updateLineQuantity (line) {
    if (line.quantity === 0) {
      LineItemService.delete(line)
    }
  }

  incQuantity(inc) {

  }

  renderNameImage() {
    const {line} = this.props

    let item = line.itemVariation;


    return (
      <View style={{height: DefH, flex: 0.5}}>
        <View style={{flex: 5, flexDirection: 'row', alignItems: 'flex-start'}}>
          {/*<View style={[styles.nameplateView]} >
            <Nameplate
              value={this.getItemInitials(item)}
              url={item.image}
              imgSize={80}
              style={[styles.nameplate, styles.borView, { backgroundColor: this.getItemColor() }]} />
          </View>*/}

          <View style={{flex: 3}}>
            <Text style={[styles.text, { color: Colors.dark_indigo, fontSize: 22, fontFamily: 'normal', textAlign: 'left', alignSelf: 'flex-start'}]}>{item.name}</Text>
            <Text style={[styles.text, { color: Colors.green, fontSize: 18, fontFamily: 'normal', textAlign: 'left', fontWeight: '100', alignSelf: 'flex-start'}]}>{Currency(line.subtotalPrice)}</Text>
          </View>
        </View>
      </View>
    )
  }

  getQuantity = () => {
    return this.props.line.quantity + ''
  }

  valueChanged (val) {
    let newText = val + ''

    LineItemService.update({
      id: this.props.line.id,
      quantity: Number(newText)
    })

    this.forceUpdate()

    if (this.props.onChange) {
      this.props.onChange(this.props.line)
    }

    this.updateLineQuantity(this.props.line);
    //*/
  }



  renderItemCount() {
    const {line} = this.props
    let iconStyle = [{color: Colors.ui_back, borderRadius: 40, height: 42}, styles.borView]
    return (
      <View style={{flex: 0.35, flexDirection: 'row', height: DefH}}>
        <Icon name='plus' size={40} style={iconStyle} onPress={() => this.valueChanged(Number(this.getQuantity()) + 1)} />
        <Text style={[styles.text, {fontSize: 30}]}>&nbsp;&nbsp;{this.getQuantity()}&nbsp;&nbsp;</Text>
        <Icon name='minus' size={40} style={iconStyle} onPress={() => this.valueChanged(Number(this.getQuantity()) - 1)}/>
      </View>
    )
  }

  renderCountDelete() {
    const {line} = this.props
    return (
      <View style={{flex: 0.15, flexDirection: 'row', height: DefH}}>
          <Icon name='close' size={40} style={{color: Colors.ui_back} } onPress={() => this.valueChanged(0)} />
      </View>
    )
  }

  render() {
    const {line, navigate} = this.props

    return (
      <View style={{flex: 1, flexDirection: 'row', borderBottomColor: '#ddd', borderBottomWidth: 1, marginBottom: 30}}>
        {this.renderCountDelete()}
        {this.renderNameImage()}
        {this.renderItemCount()}
      </View>
    )
  }



  render33 () {
    const {line, navigate} = this.props

    return (
      <View>
        <LineSwipeout line={line} navigate={navigate}>
          <View style={{flex: 1, flexDirection: 'row', padding: 10, elevation: 3}}>
            <View style={{flex: 1, width: '80%'}}>
              {this.render3()}
            </View>
          </View>
          <View style={{elevation: 2, backgroundColor: Colors.primary}}>
            <View style={{borderBottomWidth: 1, borderBottomColor: '#BBB'}} />
          </View>
        </LineSwipeout>
      </View>
    )
  }


  render2 () {
    const {line, navigate} = this.props

    return (
      <View>
        <LineSwipeout line={line} navigate={navigate}>
          <View style={{flex: 1, flexDirection: 'row', padding: 10, elevation: 3}}>
            <View style={{flex: 1, width: '80%'}}>
              <View>
                <Text style={{color: Colors.text, fontSize: 20, textAlign: 'left', fontFamily: 'normal'}}>{line.itemVariation.name}</Text>
              </View>
              {this.renderLineNameAndPrice()}
              {this.renderLineDiscounts()}
            </View>
          </View>
          <View style={{elevation: 2, backgroundColor: Colors.primary}}>
            <View style={{borderBottomWidth: 1, borderBottomColor: '#BBB'}} />
          </View>
        </LineSwipeout>
      </View>
    )
  }

}

LineItemDetails.propTypes = {
  line: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  priceText: {
    color: Colors.text,
    fontSize: 20,
    textAlign: 'right'
  },
  multipleItemMultiplier: {
    color: Colors.primary,
    textAlign: 'left',
    fontWeight: '500',
    fontSize: 20
  },
  multipleItemMultiplierX: {
    color: Colors.primary,
    textAlign: 'right',
    fontSize: 18,
    fontFamily: 'normal',
    //writingDirection: 'rtl',
    //direction: 'rtl',
  },

  nameplate: {
    textAlign: 'center',
    borderRadius: 5,
    height: 80,
    width: 80,
    alignItems: 'center',
  },
  nameplateView: {
    flex: 1,
    alignSelf: 'flex-start',
    paddingRight: 50,

  }
})
