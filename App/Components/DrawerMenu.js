import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { ApplicationStyles, Colors, Fonts } from '../Themes'
import ApiActions from '../Redux/ApiRedux'
import EmployeeActions from '../Redux/EmployeeRedux'
import { UserAccountService } from '../Realm/RealmService'
import I18n from 'react-native-i18n'
import Nameplate from '../Components/Nameplate'
import AboutUs from "../Containers/AboutUs"
import {toast} from "../Utils/toast"
import {doInitPayment, getSwVersion} from "../Services/RasPayment"
import SellInfo from "../Containers/SellInfo";
import CustomersInfo from "../Containers/CustomersInfo";

class DrawerContent extends Component {
  state = {
    salesPeople: [],
    salesPerson: null,
    showAbout: false,
    showSellInfo: false,
    showCustomersInfo: false,
    swVersion: '(NA)'
  }

  constructor(props) {
    super(props)
    this.resultArray = []
  }

  componentWillMount() {
    let users = UserAccountService.getAll()
    this.setState({
      salesPeople: users
    })

    getSwVersion().then(swVersion => {
      /*
      console.log("swVersion.length: " + swVersion.length)
      for(var i=0; i<swVersion.length; i++) {
        console.log(i + ": " + swVersion[i])
      }
      console.log("swVersion: " + swVersion.slice(1))
      //*/
      this.setState({swVersion: swVersion.slice(1)})
    });

  }

  renderUser= (value) => {
    return (
      <TouchableOpacity
        style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: '10%'}}
          onPress={() => {
            this.props.setEmployee(value)
            this.props.drawerClose()
          }}
      >
        <Nameplate value={this.getUserInitials(value)} url={value.image} imgSize={16} />
        <Text style={styles.drawerLabel}>{value.displayName}</Text>
      </TouchableOpacity>
    )
  }

  getUserInitials = (user) => {
    //toast(JSON.stringify(user))
    return user.firstName.substring(0, 1) + user.lastName.substring(0, 1)
  }

  renderAboutUs() {
    return (
      <TouchableOpacity onPress={() => this.setState({showAbout: true})}
                        style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: '10%'}}>
        <IonIcon name='md-help-circle' size={25} style={styles.icon}/>
        <Text style={styles.drawerLabel}>{I18n.t('about_us')}</Text>
        <AboutUs visible={this.state.showAbout} closeReq={() => this.setState({showAbout: false})}/>
      </TouchableOpacity>
    )
  }

  renderLogout() {
    return (<TouchableOpacity onPress={() => this.props.userLogout()}
                              style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: '10%'}}>
        <Icon name='logout' size={25} style={styles.icon}/>
        <Text style={styles.drawerLabel}>{I18n.t('Logout')}</Text>
      </TouchableOpacity>
    )
  }

  renderVersion() {
    return (<View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: '10%'}}>
        <Text style={styles.drawerLabelEn}>Q20 SW Ver: {this.state.swVersion}</Text>
      </View>
    )
  }


  keyTransfer() {
    doInitPayment().then(mes => Alert.alert(mes)).catch(err => Alert.alert(JSON.stringify(err)))
  }

  renderKeyTransfer() {
    return (<TouchableOpacity onPress={() => this.keyTransfer()}
                              style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: '10%'}}>
        <Icon name='key' size={25} style={styles.icon}/>
        <Text style={styles.drawerLabel}>{I18n.t('KeyTransfer')}</Text>
      </TouchableOpacity>
    )
  }


  renderSellInfo() {
    //console.log(this.props)

    return (<TouchableOpacity onPress={() => this.setState({showSellInfo: true})}
                              style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: '10%'}}>
        <Icon name='cart' size={25} style={styles.icon}/>
        <Text style={styles.drawerLabel}>{I18n.t('SellInfo')}</Text>
        <SellInfo visible={this.state.showSellInfo} closeReq={() => this.setState({showSellInfo: false})} merchant={this.props.merchant} />
      </TouchableOpacity>
    )
  }

  renderCustomersInfo() {
    return (<TouchableOpacity onPress={() => this.setState({showCustomersInfo: true})}
                              style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: '10%'}}>
        <IonIcon name='md-person' size={25} style={styles.icon}/>
        <Text style={styles.drawerLabel}>{I18n.t('CustomersInfo')}</Text>
        <CustomersInfo visible={this.state.showCustomersInfo} closeReq={() => this.setState({showCustomersInfo: false})} merchant={this.props.merchant} />
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <View style={styles.drawerBack}>
        <View style={styles.drawerHeader}>
          {(this.props.currentEmployee) ? (
              <View style={{ marginLeft: 10 }}>
                <Nameplate value={this.getUserInitials(this.props.currentEmployee)} size='lg' />
              </View>
            ) : (
              <Icon name='account-alert' size={60} style={styles.drawerHeaderIcon}></Icon>
            )}
          {(this.props.currentEmployee) ? (
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.userName}>{this.props.currentEmployee.displayName}</Text>
                <Text style={styles.userStatus}>{I18n.t('loggedin')}</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.userStatus}>{I18n.t('No_logged_user')}</Text>
              </View>
            )}
        </View>
        <View style={styles.drawerMain}>
          <ScrollView style={styles.drawerScroll}>
            {this.state.salesPeople && this.state.salesPeople.map(value => this.renderUser(value))}
            {/*this.renderSellInfo()*/}
            {/*this.renderCustomersInfo()*/}
            {this.renderKeyTransfer()}
            {this.renderAboutUs()}
            {this.renderLogout()}
            {this.renderVersion()}
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
    currentEmployee: state.emp.selectedEmployee
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userLogout: () => dispatch(ApiActions.userLogout()),
    setEmployee: (value) => dispatch(EmployeeActions.setEmployee(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  footerText: {
    ...Fonts.style.normal,
    paddingVertical: 7,
    color: Colors.black,
    textAlign: 'center',
    fontWeight: '900',
    flex: 1
  },
  drawerBack: {
    flex: 1
  },
  drawerHeader: {
    backgroundColor: Colors.white,
    paddingLeft: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  drawerMain: {
    backgroundColor: Colors.white,
    flex: 4
  },
  drawerScroll: {
    paddingTop: '5%',
    paddingLeft: '5%'
  },
  drawerLabel: {
    fontFamily: 'normal',
    fontWeight: '400',
    textAlign: 'left',
    fontSize: 15,
    marginLeft: 15,
    color: Colors.black
  },
  drawerLabelEn: {
    fontWeight: '400',
    textAlign: 'left',
    fontSize: 15,
    marginLeft: 15,
    color: Colors.black
  },
  drawerHeaderIcon: {
    paddingTop: '1%',
    paddingLeft: '1%',
    color: '#1E0034'
  },
  icon: {
    paddingLeft: '2%',
    paddingRight: '2%',
    color: '#1E0034'
  },
  userName: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'normal'
  },
  userStatus: {
    fontFamily: 'normal'
  }
})
