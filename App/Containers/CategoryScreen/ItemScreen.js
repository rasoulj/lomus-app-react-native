import React from 'react'
import PropTypes from 'prop-types'
import { ItemService } from '../../Realm/RealmService'
import NavigationLine from './NavigationLine'
import NameSortedItems from '../../Components/NameSortedItems'

export default class ItemScreen extends React.Component {
  items () {
    const {subcategoryId} = this.props
    let lines = []

    let items = ItemService.getAll()
    items.map(item => {
      if (item.parentId === subcategoryId) {
        lines.push(item)
      }
    })
    return lines
  }

  renderItem (item) {
    return <NavigationLine item={item} navigation={this.props.navigation} />
  }

  render () {
    return (
      <NameSortedItems items={this.items()} renderItem={item => this.renderItem(item)} />
    )
  }
}

ItemScreen.propTypes = {
  navigation: PropTypes.string.isRequired,
  subcategoryId: PropTypes.string.isRequired,
}
