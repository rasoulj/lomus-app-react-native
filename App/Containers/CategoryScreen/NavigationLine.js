import React from 'react'
import PropTypes from 'prop-types'

import CategoryLine from '../../Components/category/CategoryLine'
import ItemLine from '../../Components/category/ItemLine'
import { addItemVariationToTicket } from '../../Services/BarcodeService'
import { connect } from 'react-redux'
import {saleId, activeTicket} from '../../Redux/SalesRedux'

import {View, Text} from "react-native"

class NavigationLine extends React.Component {
  getTicket = () => {
    return this.props.activeTicket
  }



  // TODO this is duplicated
  addItemToTicket (obj) {
    if (this.props.processingPayment) {
      return
    }
    addItemVariationToTicket(obj, this.getTicket())
  }

  constructor(props) {
    super(props)


  }

  navigate ({screenType, item: {id, name}}) {
    const title = `Item (${name})`

    this.props.navigation.navigate('CategoryScreen', {
      id,
      screenType,
      title
    })
  }

  navigateToItem (item) {
    this.navigate({screenType: 'item', item})
  }

  navigateToItemVariation (item) {
    this.navigate({screenType: 'itemVariation', item})

  }

  renderSingleItem (item) {
    return (
      <ItemLine key={item.id}
                item={item}
                sign='plus'
                onPress={() => this.addItemToTicket(item)}
                onLongPress={() => this.props.navigation.openItemInfo(item.id)}
      />
    )
  }

  render () {
    const {item} = this.props

    if (item.itemType === 'CATEGORY') {
      const subcategoryAmount = Object.keys(item.items).length
      return (
        <CategoryLine key={item.id}
                      category={item}
                      amount={subcategoryAmount}
                      onPress={() => this.navigateToItem(item)} />
      )
    }

    if (item.itemType === 'PRODUCT') {
      const variations = Object.keys(item.itemVariations).length



      if (variations > 1) {
        // --> If item has more than one item variation
        return (
          <ItemLine key={item.id}
                    item={item}
                    sign='chevron-left'
                    amount={variations}
                    onPress={() => this.navigateToItemVariation(item)} />
        )
      } else {
        // --> If item has only one item variation
        return this.renderSingleItem(item.itemVariations[0])
      }
    }

    const isAVariation = item.itemType === undefined
    if (isAVariation) {
      return this.renderSingleItem(item)
    }

    console.tron.display({
      name: 'Warning! Unsupported item type',
      value: {
        item,
        itemType: item.itemType
      }
    })
    return false
  }
}

NavigationLine.propTypes = {
  navigation: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired
}

export default connect(state => ({
  saleId: saleId(state),
  processingPayment: state.flag.processingPayment,
  activeTicket: activeTicket(state)
}))(NavigationLine)
