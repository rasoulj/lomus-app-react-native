import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'

export default class NameSortedItems extends React.Component {
  render () {
    const {items, renderItem} = this.props
    return (
      <View>
        {sortBy(items, 'name').map(x => renderItem(x))}
      </View>
    )
  }
}

NameSortedItems.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired
}
