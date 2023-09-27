import React, { Component } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { ApplicationStyles, Colors } from '../Themes'


export default class Triangle extends Component {
  constructor(props) {
    super(props)

    const { amount } = this.props
    const { width } = Dimensions.get('window')
    this.widthOfTriangle = parseInt(width / (2 * amount))
  }

  renderTriangles = (amount) => {
    let triangles = []
    for (let i = 0; i < amount; i++) {
      triangles.push(
        <View key={i} style={[styles.triangle, {
          borderLeftWidth: this.widthOfTriangle,
          borderRightWidth: this.widthOfTriangle,
          borderBottomWidth: this.widthOfTriangle
        }]} />
      )
    }
    return triangles
  }

  render () {
    return (
      <View style={[styles.triangleBack, this.props.style]}>
        {this.renderTriangles(this.props.amount)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  triangleBack: {
    flex: 1,
    flexDirection: 'row',

    // Need to set this to indigo to match the background or else a white line appears randomly on some recipt sizes
    backgroundColor: Colors.gray
  },
  triangle: {
    width: 0,
    height: 0,
    // backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: Colors.gray,
    borderRightColor: Colors.gray,
    borderBottomColor: Colors.white
  }
})
