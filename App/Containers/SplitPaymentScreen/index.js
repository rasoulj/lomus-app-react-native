import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'
import ScrollView from '../../Components/QMScrollView'
import ItemSplit from './components/ItemSplit/ItemSplit'
import QMButton from '../QMButton'
import Loader from '../../Components/Loader'
import { connect } from 'react-redux'
import { currentPayment } from '../../Redux/PaymentRedux'
import { activeTicket, createSplitTicket } from '../../Redux/SalesRedux'
import { ApplicationStyles } from '../../Themes/index'
import AmountSplit from './components/AmountSplit'
import I18n from 'react-native-i18n'
class SplitPaymentScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: I18n.t('Split_Payment'),
    headerLeft: <View />
  })

  constructor (props) {
    super(props)
    this.state = {
      splitBy: 'amount'
    }
  }

  renderSplitType () {
    switch (this.state.splitBy) {
      case 'items':
        return <ItemSplit ticket={this.props.ticket} navigation={this.props.navigation} processingStatus={(status) => this.processingStatus(status)} />
      case 'amount':
        return <AmountSplit ticket={this.props.ticket} navigation={this.props.navigation} processingStatus={(status) => this.processingStatus(status)} />
      default:
        return false
    }
  }

  processingStatus(status) {
    this.setState({
      processing: status
    })
  }

  renderSplitChoiceButtons () {
    const {splitBy} = this.state
    return (
      <View style={styles.splitChoiceHeader}>
        <Text style={[styles.header, {textAlign: 'right', flex: 1}]}>{I18n.t('Split_by')}</Text>
        <View style={{flexDirection: 'row'}}>
          <QMButton
            isSelected={splitBy === 'amount'}
            onPress={() => this.setState({splitBy: 'amount'})}>
            {I18n.t('Amount')}
          </QMButton>
          <QMButton
            isSelected={splitBy === 'items'}
            disabled={this.isTicketPartiallyPaid()}
            onPress={() => this.onChooseSplitByItems()}>
            {I18n.t('Items')}
          </QMButton>
        </View>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          {this.state.processing && <Text style={[styles.header]}>{I18n.t('Preparing_Transaction')}</Text>}
          <Loader loading={this.state.processing}>
            <View style={styles.section}>
              <QMButton
                onPress={() => this.props.navigation.goBack()}
                disabled={this.isTicketPartiallyPaid()}
              >{I18n.t('GO_BACK')}</QMButton>
              {this.renderSplitChoiceButtons()}
              {this.renderSplitType()}
            </View>
          </Loader>
        </ScrollView>
      </View>
    )
  }

  isTicketPartiallyPaid () {
    const {ticket} = this.props
    return ticket.paymentTXs.length > 0
  }

  onChooseSplitByItems () {
    this.setState({splitBy: 'items'})
    this.props.createSplitTicket()
  }
}

SplitPaymentScreen.propTypes = {
  prop: PropTypes.string.isRequired
}
const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  splitChoiceHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}
})

const mapStateToProps = (state) => ({
  payment: currentPayment(state),
  ticket: activeTicket(state)
})

export default connect(
  mapStateToProps, {createSplitTicket}
)(SplitPaymentScreen)
