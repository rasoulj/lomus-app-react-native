import React from 'react'
import PropTypes from 'prop-types'
import { CategoryService, ItemService } from '../../Realm/RealmService'
import CategoryLine from '../../Components/category/CategoryLine'
import NameSortedItems from '../../Components/NameSortedItems'
import {Text, View} from "react-native"
import GridView from 'react-native-super-grid';

const IGNORED_CATEGORIES = ['Gift Cards', 'Discounts']

const isItsOwnCategory = (item) => {
  if (!item || !item.category) {
    return false
  }

  const result = item.category.id === item.id
  if (result) {
    console.tron.display({
      name: 'item is its own category!',
      value: {
        item
      }
    })
  }
  return result
}

export default class InitScreen extends React.Component {
  lineClick ({id, name}) {
    let screenType = 'subcat'
    let title = `(${name})`
    this.props.navigation.navigate('CategoryScreen', {
      id,
      screenType,
      title
    })
  }

  renderItem (item) {
    let subcategoryAmount = 0

    if (item.parentId) {
      console.tron.display({
        name: 'warning! we are skipping an item on the init screen',
        value: {item}
      })
      return false
    }

    // Search for parent categories only
    if (item.itemClass === 'DEPARTMENT') {
      // Get the lenght of sub cats
      let subcats = Object.keys(item.subCategory).length
      // Find any item related to that cat
      let subitems = ItemService.getAll().filter(isItsOwnCategory).length
      subcategoryAmount = subcats + subitems
      // subcategoryAmount = subcats
    } else if (item.itemClass === 'ALL_ITEMS') {
      subcategoryAmount = Object.keys(ItemService.getAll()).length
    } else if (item.itemClass === 'GIFTCARDS') {
      // Get lenght of all gift cards here
    } else if (item.itemClass === 'DISCOUNTS') {
      // Get lenght of all gift cards here
    }

    return (
      <CategoryLine key={item.id}
                    category={item}
                    amount={subcategoryAmount}
                    onPress={() => this.lineClick(item)} />
    )
  }

  items () {
    return CategoryService.getAll().filter(({name}) => !IGNORED_CATEGORIES.includes(name))
  }

  /*
  render () {
    return (
      <NameSortedItems items={this.items()} renderItem={item => this.renderItem(item)} />
    )
  }
  //*/



  render() {
    return (<GridView itemWidth={200} items={this.items()} itemDimension={150} fixed={true}  renderItem={(item) => this.renderItem(item)} />)
  }
}

InitScreen.propTypes = {
  navigation: PropTypes.object.isRequired
}
