import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Colors, ApplicationStyles } from '../Themes'
import * as Animatable from 'react-native-animatable'

export default class ConnectionBar extends Component {
  render() {
    return (
      <Animatable.View
        animation='fadeInRight'
        duration={200}
        style={styles.connectionBarView}>
        <Text style={styles.connectionBarText}>NO CONNECTION</Text>
      </Animatable.View>
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  connectionBarView: {
    elevation: 10,
    width: '20%',
    top: '12%',
    left: '80%',
    position: 'absolute',
    backgroundColor: '#fc5863',
    alignItems: 'center',
    padding: '1%'
  },
  connectionBarText: {
    fontSize: 18,
    color: Colors.white
  }
})
