import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

import Loader from '../Components/Loader'
import { ApplicationStyles } from '../Themes'
import I18n from 'react-native-i18n'
class PSPContactingScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: I18n.t('Contacting_PSP'),
    headerLeft: <Text />
  })

  state = {
    loading: true
  }

  componentWillMount () {
    let paymentId = this.props.navigation.state.params.id
    const {isRemaining, ticketId} = this.props.navigation.state.params

    setTimeout(() => {
      if (isRemaining) {
        // TODO this needs to recognize if this is a split payment to go back to split payment screen.
        // Note that split payment screen creates a transaction so this will flush the unpaid ticket unless
        // it is handled in the item split screen
        this.props.navigation.navigate('SplitPaymentScreen', {
          id: paymentId
        })
      } else {
        this.props.navigation.navigate('ProcessedScreen', {
          id: paymentId,
          ticketId
        })
      }
      this.forceUpdate()
    }, 2000)
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.header}>{I18n.t('Contacting_PSP2')}</Text>
            <Loader loading={this.state.loading} />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PSPContactingScreen)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})
