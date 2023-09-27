import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { connect } from 'react-redux'

import { ApplicationStyles } from '../../Themes'
import ApiActions from '../../Redux/ApiRedux'

import BarcodeService from '../../Services/BarcodeService'
import { SaleTXService } from '../../Realm/RealmService'
import LeftHeader from '../../Components/LeftHeader'

import BarcodeScanner from './BarcodeScanner'

class CameraScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Barcode Scan`,
    headerLeft: <LeftHeader navigation={navigation} />
  })

  constructor(props) {
    super(props)
    this.hasRead = false
  }

  render() {
    return (
      <View style={styles.container}>
        <BarcodeScanner
          onBarCodeRead={this.barcodeScan}
          style={{ flex: 1 }}
        />
      </View>
    )
  }

  barcodeScan = (result) => {
    if (this.hasRead) {
      return
    }

    this.hasRead = true

    console.tron.display({
      name: '📸 barcodeScan',
      preview: result.data,
      value: {
        result
      }
    })

    //  --Get the item of barcode-- //
    BarcodeService.scanUpc(SaleTXService.getAll()[0], result.data)
    this.props.navigation.goBack()
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    barcodeSuccess: (result) => dispatch(ApiActions.barcodeComplete(result))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 12,
    margin: 10,
    width: 120,
    height: 55,
    fontSize: 21,
    textAlign: 'center'
  }
})
