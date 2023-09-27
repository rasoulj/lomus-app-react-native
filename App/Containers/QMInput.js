import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import TextField from 'react-native-md-textinput'
import { ApplicationStyles, Colors } from '../Themes'

export default class QMInput extends Component {
  focus() {
    this.refs.input.focus();
    //console.log("QMInput.focus()");
  }

  render() {
    const {...rest} = this.props


    return (
      <TextField
        ref="input"
        labelStyle={{fontFamily: 'normal', fontSize: 18}}
        style={styles.field}
        labelColor={Colors.primary}
        borderColor={Colors.primary}
        highlightColor={Colors.text}
        selectionColor={Colors.primary}
        height={50}
        {...rest}
      />
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})
