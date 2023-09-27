import React, { Component } from 'react'
import * as Progress from 'react-native-progress';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { Colors, ApplicationStyles } from '../Themes'

export default class ProgressBar extends Component {
  render() {
    const {loading, children} = this.props
    if (loading) {
        //return <ProgressBarAndroid styleAttr="Inverse" progress={this.props.progress} color={Colors.primary} />
      return (<View style={{alignItems: 'center'}}>
        {this.props.progress <= 0.98
          ? <Progress.Circle showsText={true} color={Colors.primary} progress={this.props.progress} size={200} thickness={10} borderWidth={3} />
          : <ActivityIndicator size={200} color={Colors.primary} />
        }
      </View>)
    }
    return children ? <View>{children}</View> : <Text>Loading...</Text>
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})
