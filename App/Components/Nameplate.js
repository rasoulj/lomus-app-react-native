import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, TextInput, View, Text, Image } from 'react-native'
import { ApplicationStyles, Colors } from '../Themes'
import {toast} from "../Utils/toast"


export default class Nameplate extends Component {
  static propTypes = {
    value: PropTypes.object,
    size: PropTypes.string,
    style: PropTypes.string
  }

  getStyle = (style) => {
    let result = []
    if (this.props.size && this.props.size === 'lg') {
      result.push(styles.nameplate)
    } else {
      result.push(styles.smallNameplate)
    }

    if (style) {
      result.push(style)
    }

    return result
  }

  static getImage(image) {
    return image ? {uri: image, headers: Nameplate.header} : require("../Images/na.png")
  }

  static header = {Authorization: 'Basic YWRtaW46YWRtaW4='}

  render () {
    const {value, style, url, merchantId, imgSize, ...rest} = this.props

    return url ? <Image source={{uri: url, headers: Nameplate.header}} style={{width: imgSize, height: imgSize}} /> : <Text style={this.getStyle(style)} {...rest}>{value}</Text>
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  nameplate: {
    padding: 7,
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: Colors.primary,
    color: Colors.white,
    fontSize: 35
  },
  smallNameplate: {
    padding: 4,
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: Colors.primary,
    color: Colors.white,
    fontSize: 18
  }
})
