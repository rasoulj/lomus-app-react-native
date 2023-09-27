import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TextInput } from 'react-native'
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/Ionicons'

import QMButton from '../../QMButton'
import QMInput from '../../QMInput'
import BarcodeService from '../../../Services/BarcodeService'
import { ApplicationStyles, Colors } from '../../../Themes'


import I18n from 'react-native-i18n'
export default class UpcSearch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      upc: ''
    }
  }

  upcLookup (upc) {
    BarcodeService.scanUpc(this.props.ticket, upc)
    this.setState({upc: ''})
    //console.log(upc)
    setTimeout(() => {
      this.refs.upcLookup.focus();
    }, 10);


  }

  render () {



    const {navigate} = this.props
    return (
      <View style={styles.section}>
        <View style={{flex: 1, flexDirection: 'row', marginTop: -20}}>
          {/*
          <View style={{flex: 1, flexDirection: 'row', width: '70%', justifyContent: 'flex-end'}}>
            <Icon style={styles.searchIcon} name="search-web" size={30} color="#aaa"/>
            <QMInput
              onChangeText={(val) => {
                this.setState({upc: val})
              }}
              onSubmitEditing={() => this.upcLookup(this.state.upc)}
              value={this.state.upc}
              label={I18n.t('enter_upc')}
              keyboardType='numeric'
              height={50}
              style={styles.upcInputStyle}
              ref="upcLookup"
            />
          </View>
          */}
          <View style={styles.searchSection}>
            <Icon style={styles.searchIcon} name="ios-search" size={30} color="#aaa"/>
            <TextInput
              keyboardType='numeric'
              style={styles.input}
              value={this.state.upc}
              placeholder={I18n.t('enter_upc')}
              onChangeText={(val) => {
                this.setState({upc: val})
              }}
              underlineColorAndroid="transparent"
              ref="upcLookup"
              onSubmitEditing={() => this.upcLookup(this.state.upc)}
            />
          </View>
          <View style={{width: '25%', paddingLeft: 0, paddingTop: 30, justifyContent: 'flex-start', alignContent: 'center'}}>
            <Icon
              name='md-barcode'
              alignSelf='flex-start'
              backgroundColor={Colors.ui_back}
              onPress={() => navigate('CameraScreen')}
              size={50}
              style={{marginLeft: 10, color: Colors.ui_back}}
            />
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <QMButton
            onPress={() => this.upcLookup(this.state.upc)}
            hide={!this.state.upc}
            full
          >{I18n.t('search_upc')}</QMButton>
        </View>
      </View>
    )
  }
}

UpcSearch.propTypes = {
  navigate: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  upcInputStyle: {
    fontSize: 20,
    width: 350
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderColor: "#aaa",
    borderRadius: 5,
    borderWidth: 1,
    width: '70%'
  },
  searchIcon: {
    padding: 10,


  },
  input: {
    flex: 1,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 0,
    backgroundColor: '#f1f1f1',
    color: '#424242',
    fontFamily: 'normal',
    fontSize: 20
  },
})
