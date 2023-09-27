import React, { Component } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import Button from 'react-native-button'
import { Metrics, ApplicationStyles, Colors } from '../Themes'
import { connect } from 'react-redux'

import { SaleTXService, DiscountService, LineItemService } from '../Realm/RealmService'
import Discounts from '../Components/Discounts'
import LeftHeader from '../Components/LeftHeader'
import {saleId} from '../Redux/SalesRedux'
import I18n from 'react-native-i18n'
class DiscountScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: I18n.t('Discount') ,
    headerLeft: <LeftHeader navigation={navigation} />
  })

  constructor (props) {
    super(props)
    this.state = {
      text: '0',
      selectedDiscounts: [],
      avaliableDiscounts: [],
      swipedItemName: null
    }
  }

  componentWillMount() {
    const { screenType, id } = this.props.navigation.state.params

    if (screenType === 'ticketDiscount') {
      this.salesTx = this.props.saleId ? SaleTXService.getById(this.props.saleId) : {
        lineItems: []
      }
      this.salesTx.discounts.map((value) => {
        this.state.selectedDiscounts.push(value.id)
      })
    } else if (screenType === 'itemDiscount') {
      this.swipedItem = LineItemService.getById(id)
      this.setState({swipedItemName: this.swipedItem.itemVariation.name.toString()}) // => Get the item's name
      this.swipedItem.discountList.map((value) => {
        this.state.selectedDiscounts.push(value.id)
      })
    }
    this.setState({
      avaliableDiscounts: DiscountService.getAll()
    })
  }

  applyDiscount() {
    const { screenType } = this.props.navigation.state.params
    if (screenType === 'ticketDiscount') {
      SaleTXService.write(() => {
        this.salesTx.discounts = []
        this.state.selectedDiscounts.map((id) => {
          let discount = DiscountService.getById(id)
          this.salesTx.discounts.push(discount)
        })
      })
    } else if (screenType === 'itemDiscount') {
      LineItemService.write(() => {
        this.swipedItem.discountList = []
        this.state.selectedDiscounts.map((id) => {
          let discount = DiscountService.getById(id)
          this.swipedItem.discountList.push(discount)
        })
      })
    }
    this.props.navigation.goBack()
  }

  checkboxPress = (value) => {
    if (this.state.selectedDiscounts.includes(value.id)) {
      let index = this.state.selectedDiscounts.indexOf(value.id)
      this.state.selectedDiscounts.splice(index, 1)
    } else {
      this.state.selectedDiscounts.push(value.id)
    }
    this.forceUpdate()
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Discounts discountList={this.state.avaliableDiscounts}
                   checkedList={this.state.selectedDiscounts}
                   name={this.state.swipedItemName}
                   checkboxPress={(value) => this.checkboxPress(value)}
        />
        <Button title="Apply Discount"
                color="#fb5f26"
                style={[styles.primaryBtn, {margin: '10%'}]}
                containerStyle={styles.primaryBtnContainer}
                keyboardType='numeric'
                onPress={() => this.applyDiscount()}
        >{I18n.t('Apply_Discount')}</Button>
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    saleId: saleId(state)
  }
}

export default connect(mapStateToProps)(DiscountScreen)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin,
    backgroundColor: Colors.white
  }
})
