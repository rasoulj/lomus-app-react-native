import React from 'react'
import PropTypes from 'prop-types'
import { CategoryService, ItemService } from '../../Realm/RealmService'
import NavigationLine from './NavigationLine'
import NameSortedItems from '../../Components/NameSortedItems'
import {View, ScrollView, I18nManager, Text, Image, StyleSheet, TouchableOpacity} from "react-native"
import GridView from 'react-native-super-grid';
import {ApplicationStyles, Colors} from "../../Themes";
import Gradient from '../../Components/Gradient'
import Nameplate from "../../Components/Nameplate";

const IGNORED_CATEGORIES = ['Gift Cards', 'Discounts']


export default class Subcategory extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      categoryId: this.props.categoryId
    }
  }

  items (categoryId) {
    //const {categoryId} = this.state

    // Get cat and items
    let category = CategoryService.getById(categoryId)
    let allItems = ItemService.getAll()

    // If all items cat
    if (category.name === 'All Items') {
      return allItems
    } else {
      // Find the items of sleceted cat
      let itemsOfCategory = allItems.filter(item => !!item.category)
        .filter(item => item.category.id === category.id)
      // Find the subcats of cat
      let subCatsOfCategory = category.subCategory
      let itemsAndCats = []
      // Add subcats of cat
      subCatsOfCategory.map(sub => {
        itemsAndCats.push(sub)
      })
      // Add items of cat
      itemsOfCategory.map(item => {
        itemsAndCats.push(item)
      })
      return itemsAndCats
    }
  }


  mainItems () {
    return CategoryService.getAll().filter(({name}) => !IGNORED_CATEGORIES.includes(name))
  }

  renderItem (item) {
    return <NavigationLine item={item} navigation={this.props.navigation} />
  }

  render0 () {
    return (
      <NameSortedItems items={this.items()} renderItem={item => this.renderItem(item)} />
    )
  }



  renderMainItem(item) {


    return (<TouchableOpacity onPress={() => {this.setState({categoryId: item.id}); console.log(item.image)}}>
      <View>
      <View style={[this.state.categoryId == item.id ? styles.borView3 : styles.borView2]}>
        <Image resizeMode={'center'} style={{alignSelf: 'center', borderRadius: 100, width: 100, height: 100, margin: 15, zIndex: 0}} source={Nameplate.getImage(item.image)} />
      </View>
      <View>
        <Text style={[styles.text, { color: Colors.dark_indigo, alignSelf: 'center', fontSize: 22, fontFamily: 'normal' }]}>{item.name}</Text>
      </View>
    </View>
    </TouchableOpacity>)
  }

  render () {
    return (<View style={{flex: 1, flexDirection: 'column'}}>
      <View>
        <ScrollView horizontal style={{ flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}>
          <GridView
            itemWidth={150}
            items={this.mainItems()}
            itemDimension={150}
            spacing={0}
            fixed={true}
            renderItem={(item) => this.renderMainItem(item)} />
        </ScrollView>
      </View>
      <Gradient
        width={30}
        horizontal
        inverse
        color='#000'
        maxOpacity={0.1}
        style={{top: 170}} />
      <View style={{paddingTop: 20}}>
        <GridView
          itemWidth={155}
          items={this.items(this.state.categoryId)}
          itemDimension={150}
          spacing={10}
          fixed={true}
          renderItem={(item) => this.renderItem(item)} />
      </View>
    </View>)
  }

}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,

  lineWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    elevation: 2,
    backgroundColor: 'white',

    margin: 10,
    borderRadius: 25,
    padding: 0,
    height: 200,
    flex: 1,
    flexDirection: 'column'
  },

  borView2: {
    borderWidth: 2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 10
  },
  borView3: {
    borderWidth: 2,
    borderColor: 'gold',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 10
  },
})

Subcategory.propTypes = {
  categoryId: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
}
