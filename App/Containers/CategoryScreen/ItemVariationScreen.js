import React from 'react'
import PropTypes from 'prop-types'
import { ItemService } from '../../Realm/RealmService'
import NavigationLine from './NavigationLine'
import NameSortedItems from '../../Components/NameSortedItems'
import LeftHeader from '../../Components/LeftHeader'
import {View, TouchableOpacity, StyleSheet, ScrollView} from "react-native"
import GridView from 'react-native-super-grid';
import {ApplicationStyles, Colors, Fonts} from "../../Themes";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import QMButton from "../QMButton";
import Gradient from '../../Components/Gradient'
import I18n from 'react-native-i18n'

const Footer = ({children, height}) => (
  <View>
    <Gradient
      width={30}
      horizontal
      inverse
      color='#000'
      maxOpacity={0.1}
      style={{bottom: height}} />
    <View style={styles.footer}>
      {children}
    </View>
  </View>
)


export default class ItemVariationScreen extends React.Component {

  renderItem (item) {
    return <NavigationLine navigation={this.props.navigation} item={item} />
  }

  items () {
    let lines = []

    let itemVariations = ItemService.getById(this.props.itemId).itemVariations
    itemVariations.map(itemVariation => {
      if (itemVariation.parentId === this.props.categoryId) {
        lines.push(itemVariation)
      }
    })

    return lines
  }

  goBack() {
    this.props.navigation.goBack()
  }

  renderFooter() {
    return (
        <View style={{flex: 1, flexDirection: 'row', marginTop: 100, justifyContent: 'center'}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <QMButton full btnType='blue' onPress={() => this.goBack()} >
              {I18n.t('GO_BACK')}
            </QMButton>
          </View>
        </View>
    )
  }


  render () {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container} >
          <View style={{flex: 1, flexDirection: 'column'}}>
            <GridView
              itemWidth={155}
              items={this.items()}
              itemDimension={150}
              spacing={10}
              fixed={true}
              renderItem={(item) => this.renderItem(item)} />
          </View>
        </ScrollView>
        {this.renderFooter()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,

  totalAmountLabel: {
    ...Fonts.style.normal,
    paddingVertical: 10,
    color: Colors.textInverse,
    textAlign: 'center',
    flex: 1
  },
  totalAmountValue: {
    ...Fonts.style.normal,
    paddingVertical: 7,
    color: Colors.textInverse,
    textAlign: 'right',
    fontWeight: '900',
    flex: 1,
    marginRight: 25,
    fontFamily: 'normal'
  },
  footer: {
    height: 100,
    flexDirection: 'row',
    //backgroundColor: Colors.gray,
    //paddingTop: 8,
    //paddingLeft: 8,
    //borderStyle: 'solid',
    borderWidth: 0,
    //borderColor: Colors.primary,
    //elevation: 5,
    //paddingRight: 10
  }
})


ItemVariationScreen.propTypes = {
  itemId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired
}
