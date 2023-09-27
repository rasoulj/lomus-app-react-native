import React, { Component } from 'react'
import { StyleSheet, Picker, ScrollView, Text, View, Image, NetInfo, Alert, NativeModules} from 'react-native'
import CheckBox from 'react-native-checkbox';

import QMInput from './QMInput'
import Button from './QMButton'
import Loader from '../Components/Loader'
import ProgressBar from '../Components/ProgressBar'

import { connect } from 'react-redux'
import { Metrics, ApplicationStyles, Colors } from '../Themes'
import ApiActions from '../Redux/ApiRedux'

import I18n from 'react-native-i18n'

import AboutUs from "./AboutUs"

import PrinterAndroid from '../Services/PrinterAndroid'
import {toast, tdeb} from "../Utils/toast"
import publicApi from '../Services/PublicApi'
import { actionCreators } from '../Redux/SalesRedux'

const Q20RasTransactionModule = NativeModules.Q20RasTransactionModule;
const XPrinterRas = NativeModules.XPrinterRas;

const {createNewTicket} = actionCreators

/*
const storeKey =  "initVal28";
const Q20RasTransactionModule = NativeModules.Q20RasTransactionModule;
const doPayment = amount => {
  return new Promise(function (resolve, reject) {
    var doVerify = (info, ReferenceNum) => {
      Q20RasTransactionModule.doVerify(AppConfig.apiUrl, {
        UserId: info.UserId,
        Password: info.Password,
        ReferenceNum: ReferenceNum
      }).then(mes => {
        var resp = JSON.parse(mes);
        if(resp.Result == "erSucceed") resolve("OK");
        else reject("Error in verification");
      }).catch(err => reject(JSON.stringify(err)));
    }

    var innerDoPayment = (init, amount) => {

      var info = PublicApi.getPayInfo();
      Q20RasTransactionModule.doPayment(AppConfig.apiUrl, {
        Amount: amount,
        //TerminalSerial: info.TerminalSerial,
        //PinPadSerial: info.PinPadSerial,
        TerminalID: init.terminalId,
        MerchantID: init.merchantId,
        UserId: info.UserId,
        Password: info.Password,
        KSN: init.ksnKey
      }).then(mes => {
        var resp = JSON.parse(mes);
        if(resp.ResponseCode != "00") {
          reject("'00' not recieved!");
          return;
        }
        doVerify(info, resp.referenceNum);
      }).catch(err => reject(JSON.stringify(err)));
    };

    var doInit = () => {
      return Q20RasTransactionModule.doInit(AppConfig.apiUrl, PublicApi.getPayInfo());
    }

    var setKeys = init => {
      return new Promise(function (resolveSetKey, rejectSetKey) {
        tdeb(init);
        Q20RasTransactionModule.injectPinKey(init.pinKey).then(p => {
          tdeb(p);
          Q20RasTransactionModule.injectThreeKey(init.tikKey, init.ksnKey, init.kcvKey).then(q => {
            tdeb(q);
            resolveSetKey("INIT Keys Done!");
          }).catch(erq => {
            tdeb(erq);
            rejectSetKey(JSON.stringify(erq))
          });
        }).catch(er => {
          tdeb(er);
          rejectSetKey(JSON.stringify(er))
        });
      });
    }

    store.get(storeKey).then(res => {
      if (!res) {
        doInit().then(inits => {
          var init = JSON.parse(inits);
          setKeys(init).then(mes => {
            store.update(storeKey, init);
            innerDoPayment(init, amount);
            toast(mes);
          }).catch(ee => Alert.alert("*** Error: Keys transfer failed!"));
        }).catch(err => reject("err - doInit"));
      } else {
        innerDoPayment(res, amount);
      }
    }).catch(err => reject("Failed to read " + storeKey));
  });
}

//*/


class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  }



  readSerials() {
    //this.props.login("jafar.azimi@tosantechno.com", "124578", "551332132");

    Q20RasTransactionModule.readSerials().then(p => {
      Alert.alert(JSON.stringify(p));
    }).catch(err => Alert.alert(JSON.stringify(err)));
  }



  /*
  static async dop (amount) {
    //await doPayment(amount)
    //Alert.alert("done")
    doPayment(amount).then(res => Alert.alert(JSON.stringify(res))).catch(err => Alert.alert("***Error: " + err));
  }

  static async dopr() {
    const init = await getInit()
    Alert.alert(init)
  }
  //*/


  state = {
    modalVisible: false,
    fetchingMerchants: false,

    // TODO: Remove
    email: '', //'jafar.azimi@tosantechno.com',
    password: '', //'124578',
    merchant: '',
    merchants: [],
    navigating: false,
    searching: false,
    showAbout: false,
    reLoadData: false
  }

  componentWillUpdate(nextProps, nextState) {
    console.tron.display({
      name: '🔐 Login componentWillUpdate',
      value: {
        nextProps,
        nextState
      }
    })

    if (nextProps.fetching) { // When app started login progress prepare new ticket
      this.props.createNewTicket()
    }
  }

  showNetworkAlert = () => {
    Alert.alert(I18n.t('Network_Error'), I18n.t('Network_Error_MSG'))
  }

  login2 = () => {
    toast(""+this.state.reLoadData);
  }

  login = () => {


    this.setState({ searching: true })
    NetInfo.isConnected.fetch().then(isConnected => { // Get network status again to make sure its not changed after getting merchant data
      if (isConnected) {
        console.log(JSON.stringify(this.state.merchant))
        this.props.login(this.state.email, this.state.password, this.state.merchant.id, this.state.reLoadData)
      } else {
        this.setState({ searching: false }) // Seacrhing go false to make user can login again
        this.showNetworkAlert()
      }
    })
  }

  getUserMerchants = () => {
    this.setState({ fetchingMerchants: true })
    NetInfo.isConnected.fetch().then(isConnected => { // Get network status
      if (isConnected) { // If connected make the call
        publicApi.getUserMerchants(this.state.email).then(response => {
          console.log(response)
          this.setState({ fetchingMerchants: false })
          this.props.clear() // Clears any existing login attempts
          if (response.ok) {

            console.log(JSON.stringify(response.data))

            this.setState({
              merchants: response.data,
              merchant: response.data[0]
            })
          } else { // User wasn't found
            this.setState({merchants: [], merchant: ''})
          }
        })
      } else { // Not connected..!
        this.setState({merchants: [], merchant: ''})
        this.setState({ fetchingMerchants: false })
        this.showNetworkAlert()
      }
    })
  }

  renderPickerItems(item) {
    return (
      <Picker.Item label={item.name} value={item} key={item.id} />
    )
  }

  render () {
    return (
      <View style={{flexDirection: 'row', flex: 1}}>
        <View style={{flex: 1}}>
          <Image
            style={{width: '100%', height: '100%'}}
            source={require('../Images/loginBackground.png')}
          />
        </View>
        <View style={[styles.mainContainer, {alignItems: 'center', flex: 1}]}>
          <ScrollView style={[styles.container]}>
            <View style={[styles.section, {width: 400}]}>
              <Text style={styles.header}>{I18n.t('welcome')} <Text
                style={{fontFamily: 'normal', color: Colors.primary}}>{I18n.t('Indigo')}</Text></Text>
              <QMInput
                value={this.state.email}
                label={I18n.t('email')}
                keyboardType='email-address'
                onChangeText={(val) => this.setState({email: val})}
                onBlur={() => this.getUserMerchants()}
                height={50}
                style={styles.inputStyle2}
              />
              <QMInput
                value={this.state.password}
                label={I18n.t('password')}
                keyboardType='numeric'
                onChangeText={(val) => this.setState({password: val})}
                height={50}
                secureTextEntry
                style={styles.inputStyle}
              />
              <View style={{marginTop: 30, marginBottom: 30}}>
              {(this.state.merchants.length > 0) ? ( // If no merchant, dont show the picker
                <Loader loading={this.state.fetchingMerchants}>
                  <Picker
                    style={styles.picker}
                    selectedValue={this.state.merchant}
                    onValueChange={(merchant) => {
                      console.log("merchant: " + JSON.stringify(merchant))
                      this.setState({merchant: merchant})
                    }}
                  >
                    {this.state.merchants.map((item) => this.renderPickerItems(item))}
                  </Picker>
                </Loader>
              ) : <Text style={[{ textAlign: 'center', fontSize: 20 }, styles.text]} >{I18n.t('No_Available_Merchant')}</Text>}
              </View>
              {/*<Text>{ this.props.progress.total >= 0 ? ((100.0*this.props.progress.current/this.props.progress.total).toFixed(0)+" % Loaded") : ""}</Text>*/}
              <ProgressBar loading={this.props.fetching} progress={1.0*this.props.progress.current/this.props.progress.total} >
                {/*<CheckBox  />*/}
                <View style={{ flexDirection: 'row' }}>
                  <CheckBox
                    value={this.state.reLoadData}
                    label={I18n.t('LoadAllData')}
                    labelStyle={styles.text}
                    onChange={checked => this.setState({ reLoadData: checked})}
                  />
                </View>
                <Button
                  //style={{ padding: 20, backgroundColor: Colors.primary}}
                  onPress={() => { this.login() }}
                  disabled={!this.state.merchants.length || !this.state.password.length || this.props.fetching}
                  full
                > {I18n.t('Login')}</Button>
                <Button
                  //style={{ padding: 20, color: Colors.primary}}
                  onPress={() => this.props.apiSettingsOpen()}
                >{I18n.t('API_SETTINGS')}</Button>
                {/*<Button
                  onPress={() => LoginScreen.dop('253700')}
                >{"Test Do Payment"}</Button>

                <Button
                  onPress={() => this.readSerials()}
                >{"Read Serials"}</Button>
                */}
                <Button
                  //style={{ padding: 20, color: Colors.primary}}
                  onPress={() => this.setState({showAbout: true})}
                >{I18n.t('about_us')}</Button>



                <AboutUs visible={this.state.showAbout} closeReq={() => this.setState({showAbout: false})}/>
              </ProgressBar>

{/*
              <Button
                style={styles.btnFarsi}
                onPress={() => this.props.demoError()}
                full
              >{I18n.t('JS_ERROR')}</Button>
              <Button
                style={styles.btnFarsi}
                onPress={() => PrinterAndroid.raiseTestNativeError()}
                full
              >{I18n.t('NATIVE_ERROR')}</Button>
*/}

            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.api.user,
    merchant: state.api.merchant,
    loggedIn: state.api.loggedIn,
    fetching: state.api.fetching,
    progress: state.api.progress
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createNewTicket: () => dispatch(createNewTicket()),
    login: (email, password, merchantId, reLoadData, navigation) => {
      dispatch(ApiActions.login(email, password, merchantId, reLoadData))
    },
    clear: () => dispatch(ApiActions.userLogout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain'
  },
  buttonContainer: {

    backgroundColor: '#2E9298',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  centered: {
    alignItems: 'center'
  },
  inputStyle2: {
    fontSize: 20,
    fontFamily: 'normal'
  }
})
