import React, { Component } from 'react'
import { StyleSheet, ActivityIndicator, Text, View, ProgressBarAndroid, ProgressBar } from 'react-native'
import { Colors, ApplicationStyles } from '../Themes'

export default class Loader extends Component {
  render() {
    const {loading, children, color} = this.props
    if (loading) {
      if (color) {
        //return <ProgressBarAndroid styleAttr="Inverse" progress={this.props.progress} />
        return <ActivityIndicator size={80} color={color} />
      } else {
        //return <ProgressBarAndroid styleAttr="Inverse" progress={this.props.progress} color={Colors.primary} />
        return <ActivityIndicator size={80} color={Colors.primary} />
      }
    }
    return children ? <View>{children}</View> : <Text>Loading...</Text>
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})
