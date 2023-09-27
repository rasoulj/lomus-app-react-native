import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors, ApplicationStyles } from '../Themes'

export default class Discounts extends Component {
  getGradientLines = (numLines, color, maxOpacity, inverse) => {
    let ratio = (100 * maxOpacity) / numLines
    let result = []

    const addLine = (i) => {
      result.push(
        <View style={{
          backgroundColor: color,
          opacity: (ratio * i) / 100,
          flex: 1
        }} />)
    }

    if (inverse) {
      for (let i = numLines - 1; i >= 0; i--) {
        addLine(i)
      }
    } else {
      for (let i = 0; i < numLines; i++) {
        addLine(i)
      }
    }

    return result
  }

  render() {
    const {width, horizontal, inverse, color, maxOpacity, style, ...rest} = this.props
    const numLines = width * 4

    let gradStyle

    if (horizontal) {
      gradStyle = {
        height: width,
        width: '100%'
      }
    } else {
      gradStyle = {
        flexDirection: 'row',
        height: '100%',
        width: width
      }
    }

    gradStyle.elevation = 5
    gradStyle.position = 'absolute'

    return (
      <View style={[gradStyle, style]} {...rest}>
        {this.getGradientLines(numLines, color, maxOpacity, inverse)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})
