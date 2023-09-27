import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/index'
import Currency from '../../Transforms/Currency'
import Gradient from '../../Components/Gradient'
import ScrollView from '../../Components/QMScrollView'
import FlagActions from '../../Redux/FlagRedux'
import { connectRealm } from 'react-native-realm'
import configureHockeyApp from '../../Utils/configureHockeyApp'
import { actionCreators, saleId } from '../../Redux/SalesRedux'
import TicketDetails from './components/TicketDetails'
import ChargeButton from './components/ChargeButton'
import UpcSearch from './components/UpcSearch'
import I18n from 'react-native-i18n'
import ResetTicketButton from '../../Containers/ResetTicketButton'
import ReduxCategoryNavigation from '../../Navigation/CategoryNavigation'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from "../../Themes/Colors";
import SellInfo from "../../Containers/SellInfo";

const {createNewTicket} = actionCreators

// Flag to not let a barcode be scanned multiple times during one scan
let checkingBarcode = false

const Footer = ({children, height}) => (
  <View>
    <Gradient
      width={30}
      horizontal
      inverse
      color='#000'
      maxOpacity={0.1}
      style={{bottom: height}} />
    <View style={styles.footer}>
      {children}
    </View>
  </View>
)

class TransactionScreen extends Component {

  static navigationOptions = ({navigation}) => ({
    //title: I18n.t('Transactions')
    title: <Text style={styles.hStyle}>{I18n.t('Transactions')}</Text>,
    headerLeft: <Image source={require("../../Images/logo.png")} style={{width: 50, height: 50, marginLeft: 10}} />

    //headerStyle: styles.hStyle,
    //headerTitleStyle: styles.hStyle
  })
  //*/

  constructor(props) {
    super(props)

    this.state = {
      adLeft: 40,
      delta: 10,
      c1: Colors.primary,
      c2: Colors.white,
      id: 1,
      selectedChoice: 0
    }

  }

  /*
  componentDidMount() {
    setInterval(() => {
      if(this.state.id == 1) this.setState({c1: Colors.white, c2: Colors.primary, id: 0})
      else this.setState({c2: Colors.white, c1: Colors.primary, id: 1})
      console.log(this.state.adLeft);

      //if(this.state.adLeft >= 320 || this.state.adLeft <= 20) this.setState({delta: -this.state.delta})
      //this.setState({adLeft: this.state.adLeft+this.state.delta})
    }, 1000);
  }
  //*/

  componentWillMount () {
    configureHockeyApp()

    // Note: setTimeout is used here because it seems like a race condition happens in redux on a simple function call.
    // Need to try removing it in the future to see if it's fixed itself
    setTimeout(() => {
      const {activeTicket} = this.props
      // Note: The reason for checking if it's an empty ticket is that we need to subscribe to changes in that ticket
      // if the app has been reloaded which clears the previous listener
      if (!activeTicket || activeTicket.isEmpty) {
        this.props.createNewTicket()
        this.props.setPaymentProcessing(false)
      }
    }, 0)
  }

  componentWillUpdate (nextProps, nextState) {
    // If we just scanned something
    if (nextProps.scanned.item && !checkingBarcode) {
      checkingBarcode = true
      this.upcLookup(nextProps.scanned.item.data)
    }
  }

  renderAd() {
    return (
      <View style={{
        position: 'absolute',
        right: 10,  //left: this.state.adLeft,
        bottom: 100,
        zIndex: 10000,
        width: 320,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.primary,
        backgroundColor: this.state.c1
      }}>
        <Text style={[styles.text, {fontSize: 25, color: this.state.c2}]}>{I18n.t('Ad')}</Text>
      </View>
    )
  }

  renderFooter () {
    const {activeTicket} = this.props

    return (
      <Footer>
        {/*
        <View style={{flex: 2}}>
          <Text style={[styles.totalAmountLabel, {fontSize: Metrics.btnSize}]}>{I18n.t('total3')}</Text>
        </View>
        <View style={{flex: 2}}>
          <Text style={[styles.totalAmountLabel, {fontSize: Metrics.btnSize}]}>{Currency(activeTicket.totalPrice)}</Text>
        </View>
        <ChargeButton ticket={activeTicket} navigate={this.props.navigation.navigate} />*/}
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ChargeButton ticket={activeTicket} navigate={this.props.navigation.navigate} />
          </View>
          {/*<View style={{width: '50%', alignItems: 'center', justifyContent: 'center'}}>
            <ResetTicketButton />
          </View>*/}
        </View>



      </Footer>
    )
  }

  renderChoices() {
    return (<View style={{height: 300}}>
      {["md-restaurant", "md-contacts", "md-stats"].map((p, i) => (<View style={{flexDirection: 'row', flex: 1}}>
        <TouchableOpacity onPress={() => this.setState({selectedChoice: i})} style={{flexDirection: 'row', flex: 1}}>
          <View style={{flex: 0.15, height: 50, borderRadius: 5}}>
            { i == this.state.selectedChoice && <Image style={{height: 50, width: 11}} source={require("../../Images/sel.png")} />}
          </View>
          <View style={{flex: 0.85, marginBottom: 50, alignItems: 'center'}}>
            <Icon size={50} style={{color: Colors.white}} name={p}></Icon>
          </View>
        </TouchableOpacity>
        </View>
      ))}
    </View>)
  }



  renderTransaction() {
    const {activeTicket} = this.props
    const {navigate} = this.props.navigation

    const {lineItems} = activeTicket

    return (<View style={{flexDirection: 'row', flex: 1}}>

      <View style={{flex: 2}}>
        <ReduxCategoryNavigation openItemInfo={(id) => this.openItemInformation(id)} />
        <Gradient
          width={16}
          color='#000'
          maxOpacity={0.07}
          style={{ right: 0 }}/>
        {this.state.showItemInformation ? (
          <ItemInformationModal close={() => this.closeItemInformation()} itemId={this.state.id} />
        ) : undefined }
      </View>

      <View style={{flex: 1}}>
        <ScrollView style={styles.container} nestedScrollEnabled>
          <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
            <View style={{flex: 0.45, alignItems: 'flex-end'}}><Text style={styles.hStyle}>{I18n.t('basket') + "  " }</Text></View>
            <View style={{backgroundColor: Colors.secondary, borderRadius: 20, width: 35, height: 35, flex: 0.08}}><Text style={[styles.hStyle, {color: Colors.white}]}>{lineItems.length}</Text></View>
            <View style={{flex: 0.4, alignItems: 'flex-end'}}>
              {lineItems.length > 0 && <TouchableOpacity onPress={() => this.props.createNewTicket()}>
                <Icon name={'ios-trash'} size={40} style={{marginRight: 40, color: Colors.secondary}}/>
              </TouchableOpacity>}
            </View>
          </View>
          <UpcSearch ticket={activeTicket} navigate={navigate} />
          <TicketDetails ticket={activeTicket} navigate={navigate} />
        </ScrollView>
        {this.renderFooter()}
      </View>

    </View>)
  }

  render () {
    const {activeTicket} = this.props
    if (!activeTicket) {
      return false
    }

    const {navigate} = this.props.navigation
    return (
      <View style={[styles.mainContainer, {flexDirection: 'row'}]}>
        {/*this.renderAd()*/}

        <View style={{width: 65, backgroundColor: Colors.secondary, justifyContent: 'center'}}>
          {this.renderChoices()}
        </View>

        {this.state.selectedChoice == 0 && this.renderTransaction()}

        {this.state.selectedChoice == 2 && <SellInfo merchant={this.props.merchant} />}

      </View>
    )
  }
}

const RealmConnected = connectRealm(TransactionScreen, {
  schemas: ['SaleTX'],
  mapToProps: (results, realm, ownProps) => ({
    realm,
    activeTicket: results.saleTxes.find(item => item.id === ownProps.saleId)
  })
})

const mapStateToProps = (state) => {
  return {
    user: state.api.user,
    barcode: state.api.barcode,
    scanned: state.api.scanned,
    saleId: saleId(state),
    merchant: state.api.merchant
  }
}

const {setPaymentProcessing} = FlagActions
const mapDispatchToProps = {
  createNewTicket,
  setPaymentProcessing
}

export default connect(mapStateToProps, mapDispatchToProps)(RealmConnected)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,

  totalAmountLabel: {
    ...Fonts.style.normal,
    paddingVertical: 10,
    color: Colors.textInverse,
    textAlign: 'center',
    flex: 1
  },
  totalAmountValue: {
    ...Fonts.style.normal,
    paddingVertical: 7,
    color: Colors.textInverse,
    textAlign: 'right',
    fontWeight: '900',
    flex: 1,
    marginRight: 25,
    fontFamily: 'normal'
  },
  footer: {
    height: 100,
    flexDirection: 'row',
    //backgroundColor: Colors.gray,
    //paddingTop: 8,
    //paddingLeft: 8,
    //borderStyle: 'solid',
    borderWidth: 0,
    //borderColor: Colors.primary,
    //elevation: 5,
    //paddingRight: 10
  }
})
