import React from 'react'
import { Text, View } from 'react-native'
import ChangeQuantityButton from './ChangeQuantityButton'
import Checkbox from '../../../Components/Checkbox'
import { connect } from 'react-redux'
import { itemQuantityInCurrentSplit } from '../../../Redux/PaymentRedux'
import PropTypes from 'prop-types'
import { addItemVariationToTicket, updateLineQuantity } from '../../../Services/BarcodeService'

class LineItemChoice extends React.Component {
  findLinesInSplitTicket () {
    return this.props.splitTicket.refAsArray('lineItems')
      .filter(line => line.itemVariation.id === this.props.item.itemVariation.id)
  }

  isAddedToCurrentSplit () {
    const length = this.findLinesInSplitTicket().length
    return length > 0
  }

  itemInSplitTicket () {
    return this.findLinesInSplitTicket()[0]
  }

  itemQuantityInSplitTicket () {
    if (!this.isAddedToCurrentSplit()) {
      return 0
    }
    const itemInSplitTicket = this.itemInSplitTicket()
    return itemInSplitTicket.quantity
  }

  onValueChange (quantity) {
    if (this.isAddedToCurrentSplit()) {
      const itemFromSplitTicket = this.itemInSplitTicket()
      updateLineQuantity(itemFromSplitTicket, quantity)
    } else {
      const {item} = this.props
      addItemVariationToTicket(item.itemVariation, this.props.splitTicket, quantity)
    }
    this.props.onUpdate()
  }

  onCheckboxPress () {
    const {item} = this.props
    const isAdded = this.isAddedToCurrentSplit()
    const quantity = isAdded ? 0 : item.quantity

    console.tron.display({
      name: '😡 checkbox press',
      value: {
        item,
        quantity,
        isAdded
      }
    })
    this.onValueChange(quantity)
  }

  render () {
    const {item} = this.props

    const quantityAddedToCurrentSplit = this.itemQuantityInSplitTicket()

    return (
      <View style={{ flex: 1, alignItems: 'center' }} >
        <View style={styles.lineItemChoice}>
          <View style={{ flex: 3 }} >
            <Checkbox
              checked={this.isAddedToCurrentSplit()}
              label={`${item.itemVariation.name} (${item.quantity})`}
              onPress={() => this.onCheckboxPress()}
            />
          </View>
          <View style={styles.quantityControls}>
            <ChangeQuantityButton
              onPress={() => this.onValueChange(quantityAddedToCurrentSplit - 1)}
              type='minus'
              size={35}
              disabled={quantityAddedToCurrentSplit === 0} />
            <Text style={styles.quantity}>
              {quantityAddedToCurrentSplit}
            </Text>
            <ChangeQuantityButton
              onPress={() => this.onValueChange(quantityAddedToCurrentSplit + 1)}
              type='plus'
              size={35}
              disabled={quantityAddedToCurrentSplit === item.quantity}
            />
          </View>
        </View>
      </View>
    )
  }
}

LineItemChoice.propTypes = {
  item: PropTypes.object.isRequired,
  ticket: PropTypes.object.isRequired,
  splitTicket: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired
}

const styles = {
  lineItemChoice: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    paddingTop: 5
  },
  quantityControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: 90
  },
  quantity: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 20
  }
}

const mapStateToProps = (state, props) => ({
  quantityAddedToCurrentSplit: itemQuantityInCurrentSplit(state, props.item)
})

export default connect(
  mapStateToProps
)(LineItemChoice)
