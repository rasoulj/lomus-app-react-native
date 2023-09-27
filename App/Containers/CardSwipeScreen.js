import React, { Component } from 'react'
import {StyleSheet, ScrollView, View, Text, Alert, NativeModules} from 'react-native'
import { connect } from 'react-redux'
import Button from './QMButton'
import Loader from '../Components/Loader'
import {ApplicationStyles, Colors} from '../Themes'
import I18n from 'react-native-i18n'
import {tdeb, toast} from "../Utils/toast";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {doPayment} from "../Services/RasPayment"

class CardSwipeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: I18n.t('Swipe_Card'),
    headerLeft: <Text />
  })

  state = {
    loading: true, //this.props.navigation.state.params.loading,
    startTime: new Date(),
    errorMessage: I18n.t("PaymentFailed")
  }

  componentDidMount () {
    //const {loading} = this.props.navigation.state.params;
    //if(loading)
    //setTimeout(() => this.dop(), 10);
    console.log("Start of CardSwip")
    this.dop()
  }



  dop() {
    const {amount, ticketId} = this.props.navigation.state.params;
    this.setState({loading: true});

    var startDate = new Date();
    //console.log("1: " + ((startDate - this.state.startTime)/1000)+"  (pre-secs)");



    doPayment(amount).then(doPaymentRes => {
      console.log("end of doVerify & navigation to ProcessedScreen");
      this.props.navigation.navigate('ProcessedScreen', {ticketId, doPaymentRes})
    }).catch(err => {
      console.log("catch: " + JSON.stringify(err))
      var errorMessage = I18n.t("PaymentFailed")
      if(err && err.CardHolderErrorDesc) errorMessage = err.CardHolderErrorDesc;
      this.setState({loading: false, errorMessage});
    });
  }


  cancelPayment () {
    //this.props.navigation.state.params.setRetry();
    //this.props.navigation.goBack();// navigate('PaymentScreen')
    this.props.navigation.navigate('PaymentScreen')
  }

  componentWillMount() {
  }

  componentDidMount2 () {
    let paymentId = this.props.navigation.state.params.id
    const {isRemaining, ticketId} = this.props.navigation.state.params


    setTimeout(() => {
      this.props.navigation.navigate('PSPContactingScreen', {
        id: paymentId,
        isRemaining,
        ticketId
      })
      this.forceUpdate()
    }, 2000)
    //*/
  }

  interruptPayment() {
    this.setState({loading: false});
    this.cancelPayment()
  }

  render() {
    return (
      <View style={[styles.mainContainer, styles.halfView]}>
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.header}>{I18n.t('Swipe_your_Card')}</Text>
            {this.state.loading && <Button
              onPress={() => this.interruptPayment()}
            >{I18n.t("interruptPayment")}</Button>}
            <Loader loading={this.state.loading}>
              <Icon style={{alignSelf: 'center', color: Colors.red}}
                    size={150}
                    name='cloud-off-outline' />
              <Text style={[styles.header, {color: Colors.red}]}>{this.state.errorMessage}</Text>
              <Button
                onPress={() => this.dop()}
              >{I18n.t("Retry")}</Button>
              <Button
                onPress={() => this.cancelPayment()}
              >{I18n.t("CancelPayment")}</Button>

            </Loader>
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

export default connect(mapStateToProps, mapDispatchToProps)(CardSwipeScreen)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})
