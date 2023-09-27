import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes'
import I18n from 'react-native-i18n'
import ImageBackground from "../../Utils/ImageBackground"

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Nameplate from "../Nameplate";

export default class CategoryLine extends Component {

  countMahsoul(amount) {
    return (amount > 0) ? amount + ' ' + I18n.t('product_count') : I18n.t('product_count_unknown')
  }

  render() {
    const {category, amount, onPress, ...rest} = this.props



    return (
      <TouchableOpacity onPress={onPress} >
          <View style={[styles.lineWrapper]}>
            {/*<View style={[styles.absView, styles.lineArrow, styles.borView]}>
              <Icon name='chevron-left' size={40} style={{ color: Colors.ui_back, fontWeight: '100' }} />
            </View>
            <View style={[styles.absView, styles.lineImage, styles.borView]} >
              <Icon name='folder-outline' size={45} style={{ color: Colors.dark_indigo }}/>
            </View>*/}

            <View style={{flex: 0.7, borderRadius: 25, zIndex: 100}}>
              <Image borderTopRightRadius={25} borderTopLeftRadius={25} style={{width: "100%", height: "100%", zIndex: 0}} source={Nameplate.getImage(category.image)} />
            </View>
            <View style={{flex: 0.3}}>
              <Text style={[styles.text, { color: Colors.dark_indigo, alignSelf: 'center', fontSize: 35, fontFamily: 'normal' }]}>{category.name}</Text>
            </View>

              {/*<Text style={[styles.text, {color: 'gray', fontSize: 25}]}>{this.countMahsoul(amount)}</Text>*/}
          </View>

      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,

  lineWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    elevation: 2,
    backgroundColor: 'white',

    margin: 10,
    borderRadius: 25,
    padding: 0,
    height: 200,
    flex: 1,
    flexDirection: 'column'
  },

  addBottomLine: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: Colors.black
  }
})
