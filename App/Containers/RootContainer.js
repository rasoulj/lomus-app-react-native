import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, NetInfo, Text, Image, TouchableOpacity} from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import ReduxCategoryNavigation from '../Navigation/CategoryNavigation'
import { connect } from 'react-redux'
import ApiActions from '../Redux/ApiRedux'
import StartupActions from '../Redux/boilerplate/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'
import LoginScreen from '../Containers/LoginScreen'
import Drawer from 'react-native-drawer'
import DrawerMenu from '../Components/DrawerMenu'
import Gradient from '../Components/Gradient'
import ItemInformationModal from '../Components/ItemInformationModal'
import ApiSettingsModal from '../Components/ApiSettingsModal'
import ConnectionBar from '../Components/ConnectionBar'
import { ApplicationStyles, Fonts, Metrics, Colors } from '../Themes/'
import I18n from 'react-native-i18n'
import Icon from 'react-native-vector-icons/Ionicons'
import {toast, tdeb} from "../Utils/toast"

class RootContainer extends Component {
  constructor() {
    super()
    this.state = {
      drawerOffset: null,
      showItemInformation: false,
      id: null,
      showApiSettings: false,
      connection: true,
      adPassed: true
    }
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ connection: isConnected })
  }

  componentWillUnmount () {
    NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange)
  }

  componentDidMount () {
    NetInfo.isConnected.addEventListener('change', this.handleConnectionChange)
    NetInfo.isConnected.fetch().done(isConnected => this.setState({ connection: isConnected }))
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
    var {height, width} = Dimensions.get('window')
    if (height > width) {
      this.screen = 'horizontal'
      this.setState({drawerOffset: 0.5})
    } else {
      this.screen = 'vertical'
      this.setState({drawerOffset: 0.7})
    }
  }

  onLayout(e) {
    var {height, width} = Dimensions.get('window')
    if (height > width) {
      this.screen = 'horizontal'
      this.setState({drawerOffset: 0.5})
    } else {
      this.screen = 'vertical'
      this.setState({drawerOffset: 0.7})
    }
  }

  closeItemInformation = () => {
    this.setState({
      showItemInformation: false,
      id: null
    })
  }

  openItemInformation = (id) => {
    this.setState({
      showItemInformation: true,
      id: id
    })
  }

  renderAd() {
    const m = 50;
    var text = {fontFamily: "normalb", fontSize: 50, alignSelf: 'flex-start'}
    var cell = {flex: 0.34, backgroundColor: 'powderblue', margin: m, borderRadius: 20, justifyContent: 'center'}
    var cellT = {flex: 0.2, backgroundColor: 'powderblue', marginTop: m, marginBottom: 20, marginRight: m, marginLeft: m, borderRadius: 20, justifyContent: 'center'}
    var cellC = {flex: 0.5, flexDirection: 'row', backgroundColor: 'rgb(255,206,255)', marginTop: 20, marginBottom: 20, marginRight: m, marginLeft: m, borderRadius: 20, justifyContent: 'center'}
    var cellB = {flex: 0.3, marginTop: 20, marginBottom: m, marginRight: m, marginLeft: m, borderRadius: 20}

    var clm = {flex: 0.5, flexDirection: 'column', justifyContent: 'space-between', }
    var row = {flex: 1, flexDirection: 'row', height: "100%", width: "100%", backgroundColor: 'white'}

    let notYet = () => toast(I18n.t('not_impl'))

    let renRow = (cls, icon, ad, bg, act) => {
      return (<View style={[cls, {backgroundColor: bg}]}>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 0.2, justifyContent: 'center'}}>
              <TouchableOpacity onPress={act}>
                <Icon name={icon} size={60}/>
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.8, justifyContent: 'center', paddingLeft: 20}}>
              <TouchableOpacity onPress={act}>
                <Text style={text}> {I18n.t(ad)}</Text>
              </TouchableOpacity>
            </View>
          </View>

      </View>)
    }

    return (<View style={row}>

      <View style={[clm]}>
        {renRow(cellT, 'ios-basket', 'Ad4', 'powderblue', () => this.setState({adPassed: true}))}
        <View style={cellC}>
          <Image source={require("../Images/ad.png")} style={{width: 480, height: 254, alignSelf: 'center'}} />
        </View>
        <View style={cellB}>
          <Image source={require("../Images/payesh_logo.jpg")} style={{width: 180, height: 180, alignSelf: 'center'}} />
        </View>
      </View>
      <View style={clm}>
        {renRow(cell, 'ios-rose', 'Ad1', 'rgb(174,255,247)', notYet)}
        {renRow(cell, 'ios-book', 'Ad2', 'rgb(255,174,174)', notYet)}
        {renRow(cell, 'ios-restaurant', 'Ad3', 'rgb(174,174,255)', notYet)}
      </View>

    </View>)
  }

  render () {
    /*
    if(!this.state.adPassed) {
      return this.renderAd();
    }
    //*/

    if (!this.props.loggedIn) {
      return (
        <View style={styles.applicationView}>
          <LoginScreen apiSettingsOpen={() => this.setState({showApiSettings: true})} />
          {!this.state.connection && <ConnectionBar/> }
          {this.state.showApiSettings && <ApiSettingsModal close={() => this.setState({showApiSettings: false})} />}
        </View>
      )
    }

    return (
      <View style={styles.applicationView} onLayout={this.onLayout.bind(this)}>
        {!this.state.connection && <ConnectionBar/> }
        <Drawer
          ref={ref => (this._drawer = ref)}
          side='right'
          type='static'
          captureGestures={'open'}
          panOpenMask={0.1}
          content={ <DrawerMenu drawerClose={() => {
            this._drawer.close()
          }}/> }
          tapToClose={true}
          openDrawerOffset={this.state.drawerOffset}
          closedDrawerOffset={-5}
          tweenHandler={(ratio) => ({
            main: { opacity: (2 - ratio) / 2 }
          })}
        >
          <View style={[styles.applicationView, {flexDirection: 'row'}]}>
            {(this.screen === 'vertical2') && (
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
            )}
            <View style={{flex: 2, elevation: 5}}>
              <ReduxNavigation
                ref={(ref) => { this.rightNav = ref }}
                userLogout={this.props.userLogout}
                drawerOpen={() => { this._drawer.open() }}
                drawerClose={() => { this._drawer.close() }}
              />
            </View>
          </View>
        </Drawer>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.api.loggedIn
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  userLogout: () => dispatch(ApiActions.userLogout())
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  applicationView: {
    flex: 1,
    backgroundColor: '#EDE7F1'
  },
  textIndigo: {
    color: Colors.primary
  },
  container: {
    flex: 1,
    width: 'max-content',
    backgroundColor: Colors.background
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    margin: Metrics.baseMargin
  },
  myImage: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  }
})
