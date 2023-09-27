import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Colors, ApplicationStyles } from '../Themes'
import Gradient from './Gradient'

export default class QMScrollView extends Component {
  state = {
    topShadow: false
  }

  render() {
    const {...rest} = this.props
    return (
      <View style={styles.mainContainer}>
        {this.state.topShadow ? <Gradient
          width={12}
          horizontal={true}
          inverse={true}
          color='#000'
          maxOpacity={0.1}
          style={{top: 0}}/> : undefined}
        <ScrollView
          onScroll={(e) => {
            let scrollPos = e.nativeEvent.contentOffset.y
            if (this.state.topShadow !== !!scrollPos) {
              this.state.topShadow = !!scrollPos
              this.forceUpdate()
            }
          }}
          scrollEventThrottle={16}
          {...rest}>
          {this.props.children}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})
