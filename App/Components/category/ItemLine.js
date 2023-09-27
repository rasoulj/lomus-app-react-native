import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes'
import Nameplate from '../Nameplate'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Currency from '../../Transforms/Currency'
import { connect } from 'react-redux'
import stringHash from 'string-hash'
import {toast} from "../../Utils/toast"
import publicApi from '../../Services/PublicApi'
import I18n from "react-native-i18n";

const colors = ['#FF02A9', '#4D08FF', '#009D45', '#210535']

class ItemLine extends Component {
  getItemInitials = (item) => {
    return item.name.substring(0, 2)
  }

  getItemColor () {
    const colorChoice = stringHash(this.props.item.name) % colors.length
    return colors[colorChoice]
  }

  alakiDebug(item) {
    const {value, style, image, merchantId, ...rest} = item
    publicApi.getImage(merchantId, image).then(res => toast(JSON.stringify(res))).catch(err => toast(JSON.stringify(err)))
  }

  countMahsoul(amount) {
    return (amount > 0) ? amount + ' ' + I18n.t('product_count') : I18n.t('product_count_unknown')
  }


  render() {
    //const {category, amount, onPress, ...rest} = this.props
    const {item, sign, amount, onPress, onLongPress, ...rest} = this.props

    return (
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
        <View style={[styles.lineWrapper]}>
          <View style={{flex: 0.5, borderRadius: 25, zIndex: 100}}>
            <Image
              borderTopRightRadius={25}
              borderTopLeftRadius={25}
              style={{width: "100%", height: "100%", zIndex: 0}}
              source={Nameplate.getImage(item.image)} />
          </View>
          <View style={{flex: 0.5}}>
            <Text style={[styles.text, { color: Colors.dark_indigo, alignSelf: 'center', fontSize: 22, fontFamily: 'normal' }]}>{item.name}</Text>
            {amount > 0 && <Text style={[styles.text, {color: 'gray', fontSize: 15}]}>{this.countMahsoul(amount)}</Text>}
            {
              item.price > 0 && <Text style={[styles.text, {color: Colors.green, fontSize: 20}]}>
                {Currency(item.price)}
                {/*&nbsp;&nbsp;&nbsp;<Icon name='cash' size={35} style={{color: 'darkgray'}}/>*/}
              </Text>
            }
          </View>

          {/*<Text style={[styles.text, {color: 'gray', fontSize: 25}]}>{this.countMahsoul(amount)}</Text>*/}
        </View>

      </TouchableOpacity>
    )
  }



  render3() {
    const {item, sign, amount, onPress, onLongPress, ...rest} = this.props
    const backgroundColor = this.props.processingPayment ? Colors.charcoal_grey : this.getItemColor()
    return (
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
        <View style={styles.lineWrapperMain}>
          <View style={[styles.absView, styles.lineArrow, styles.borView]}>
            {sign && !this.props.processingPayment &&
              <Icon name={sign} size={40} style={{ paddingLeft: 0, color: sign == 'plus' ? Colors.green : Colors.ui_back }} />}
            {/*<Icon name='chevron-left' size={40} style={{ color: Colors.ui_back, fontWeight: '100' }} />*/}
          </View>
          <View style={[styles.absView, styles.lineImage, styles.borView]} >
            <Nameplate
              value={this.getItemInitials(item)}
              url={item.image}
              imgSize={70}
              style={[styles.nameplate, { backgroundColor: backgroundColor }]} />
          </View>
          <View style={[styles.categoryWrapper, styles.borView]}>
            <Text style={[styles.text, { color: Colors.dark_indigo, alignSelf: 'center', fontSize: 40, fontFamily: 'normal' }]}>{item.name}</Text>
            {amount > 0 && <Text style={[styles.text, {color: 'gray', fontSize: 25}]}>{this.countMahsoul(amount)}</Text>}
            {
              item.price > 0 && <Text style={[styles.text, {color: Colors.green, fontSize: 25}]}>
                {Currency(item.price)}&nbsp;&nbsp;&nbsp;
                <Icon name='cash' size={35} style={{color: 'darkgray'}}/>
              </Text>
            }
          </View>
        </View>

      </TouchableOpacity>
    )
  }

  render2() {
    const {item, sign, amount, onPress, onLongPress, ...rest} = this.props
    const backgroundColor = this.props.processingPayment ? Colors.charcoal_grey : this.getItemColor()
    return (<TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}>
        <View style={styles.lineWrapper}>
          <View style={styles.nameplateView} >
            <Nameplate
              value={this.getItemInitials(item)}
              url={item.image}
              imgSize={90}
              style={[styles.nameplate, { backgroundColor: backgroundColor }]} />
          </View>
          <View style={[styles.addBottomLine, { flex: 8, flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }]}>
            <View style={styles.itemWrapper} >
              <Text style={[styles.text, { color: Colors.dark_indigo, alignSelf: 'flex-start', fontSize: 25 }]}>{item.name}
                {(amount > 0) ? ` (${amount})` : undefined }</Text>
            </View>
            {item.price > 0 ? (<Text style={[styles.text, { fontSize: 22, color: Colors.dark_indigo }]}>{Currency(item.price)}</Text>) : undefined}
            <View style={{ flex: 1 }}>
              {sign && !this.props.processingPayment
                ? <Icon name={sign} size={30} style={{ paddingLeft: 0, color: Colors.metallic_blue }} /> : undefined}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }


}


const mapStateToProps = (state) => {
  return {
    processingPayment: state.flag.processingPayment
  }
}

export default connect(mapStateToProps)(ItemLine)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  lineWrapper2: {
    padding: 5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  lineWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    elevation: 2,
    backgroundColor: 'white',

    marginTop: 5,
    borderRadius: 25,
    padding: 0,
    height: 170,
    flex: 1,
    flexDirection: 'column'
  },
  itemWrapper: {
    flex: 8,
    alignSelf: 'flex-start'
  },
  addBottomLine: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: Colors.black
  },
  nameplate: {
    textAlign: 'center',
    borderRadius: 5,
    height: 45,
    width: 45,
    alignItems: 'center'
  },
  nameplateView: {
    flex: 1,
    alignSelf: 'flex-start',
    paddingRight: 50
  }
})
