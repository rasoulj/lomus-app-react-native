import React, { Component } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'

import { ApplicationStyles, Colors } from '../Themes'
import { ItemVariationService, ItemService } from '../Realm/RealmService'
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Currency from '../Transforms/Currency'
import Nameplate from './Nameplate'

export default class ItemInformationModal extends Component {
  constructor(props) {
    super(props)
    this.itemType =
    this.itemVariation = ItemVariationService.getById(props.itemId)
    if (this.itemVariation) {
      this.info = this.itemVariation
    } else {
      this.info = ItemService.getById(props.itemId).itemVariations[0]
    }
  }

  getRandomColor = () => {
    let random = Math.random()

    if (random < 0.25) {
      return '#FF02A9'
    } else if (random < 0.5) {
      return '#4D08FF'
    } else if (random < 0.75) {
      return '#009D45'
    }

    return '#210535'
  }

  render () {
    return (
        <Animatable.View
          animation='fadeIn'
          duration={300}
          style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(76,0,153,0.1)',
            position: 'absolute'
          }}
        >
          <Animatable.View animation='zoomIn'
            duration={300}
            style={{
              elevation: 24,
              margin: '10%',
              width: '80%',
              height: '80%',
              backgroundColor: Colors.white
            }}
          >
            <View style={{ flex: 1 }} >
              <Icon name='close' size={40} style={{ alignSelf: 'flex-end', paddingTop: 20, paddingRight: 20 }} onPress={() => this.props.close()} />
              <ScrollView>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                  <View style={{ flex: 1, paddingLeft: 50 }} >
                    <Nameplate
                      value={this.info.name.substring(0, 2)}
                      style={[styles.nameplate, { backgroundColor: this.getRandomColor() }]} />
                  </View>
                  <View style={{ flex: 3 }} >
                    <Text style={[styles.text, { fontSize: 22, color: Colors.black, alignSelf: 'flex-start' }]} >{this.info.name}</Text>
                    <Text style={[styles.text, { fontSize: 20, color: Colors.dark_indigo, alignSelf: 'flex-start' }]} >{Currency(this.info.price)}</Text>
                  </View>
                </View>
                <View style={{ flex: 3, paddingTop: 10, paddingLeft: 50, alignItems: 'flex-start' }} >
                  <Text style={[styles.text, { fontSize: 20, color: Colors.black }]} >Product Description</Text>
                  <Text style={[styles.text, { fontSize: 18, color: Colors.black, fontStyle: 'italic' }]} >{this.info.description}</Text>
                  <Text style={[styles.text, { fontSize: 18, color: Colors.dark_indigo }]} >UPC: {this.info.upc}</Text>
                  <Text style={[styles.text, { fontSize: 18, color: Colors.dark_indigo }]} >Inventory: n/a</Text>
                </View>
              </ScrollView>
            </View>
          </Animatable.View>
      </Animatable.View>
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  nameplate: {
    textAlign: 'center',
    borderRadius: 5,
    height: 80,
    width: 80,
    alignItems: 'center',
    paddingTop: '10%',
    paddingBottom: '10%',
    fontSize: 30
  }
})
