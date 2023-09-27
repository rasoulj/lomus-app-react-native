import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { ApplicationStyles, Colors } from '../../../Themes/index'

import { LineItemService } from '../../../Realm/RealmService'

export default class InputNumber extends Component {
  onChanged (text) {
    let newText = ''
    let numbers = '0123456789'

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i]
      }
    }

    this.valueChanged(newText)
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
  }

  getQuantity = () => {
    return this.props.line.quantity + ''
  }

  render () {
    return (
      <View style={styles.inputView}>
        <View style={{flex: 2}}>
          <Icon
            name='minus-circle'
            onPress={() => this.valueChanged(Number(this.getQuantity()) - 1)}
            size={40}
            color={Colors.primary}
          />
        </View>
        <View style={{flex: 3, paddingRight: '10%', paddingLeft: '10%'}}>
          <TextInput
            keyboardType='numeric'
            onChangeText={(text) => this.onChanged(text)}
            value={this.getQuantity()}
            maxLength={3}
            style={{color: Colors.primary, textAlign: 'center', fontSize: 30}}
            selectionColor={Colors.primary}
            underlineColorAndroid={Colors.primary}
          />
        </View>
        <View style={{flex: 2}}>
          <Icon
            name='plus-circle'
            onPress={() => this.valueChanged(Number(this.getQuantity()) + 1)}
            size={40}
            color={Colors.primary}
          />
        </View>
      </View>
    )
  }
}

InputNumber.propTypes = {
  onChange: PropTypes.func.isRequired,
  line: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  inputView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingLeft: 20
  }
})
