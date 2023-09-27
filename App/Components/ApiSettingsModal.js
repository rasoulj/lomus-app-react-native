import React, { Component } from 'react'
import { View, Text, ScrollView, TextInput } from 'react-native'
import { Colors } from '../Themes'
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import publicApi from '../Services/PublicApi'
import AppConfig from '../Config/AppConfig'
import {getIp, setIp} from '../Services/RasXPrint'


export default class ApiSettingsModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newApiUrl: '',
      newIP: '',
      currentIP: ''
    }

    getIp().then(ip => this.setState({currentIP: ip}));
  }

  render () {
    let activeURL = publicApi.getApiUrl()

    return (
        <Animatable.View
          animation='fadeIn'
          duration={300}
          style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(76,0,153,0.1)',
            position: 'absolute'
          }}
        >
          <Animatable.View animation='zoomIn'
            duration={300}
            style={{
              elevation: 24,
              width: '80%',
              height: '80%',
              top: '10%',
              left: '10%',
              backgroundColor: Colors.white
            }}
          >
            <View style={{ flex: 1 }} >
              <Icon name='close' size={40} style={{ alignSelf: 'flex-start', paddingTop: 20, paddingRight: 20 }} onPress={() => this.props.close()} />
              <ScrollView>
                <View style={{ flex: 1, alignItems: 'center' }} >
                  <Text style={{
                    flex: 1,
                    fontSize: 30,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>API SETTINGS</Text>
                  <SettingLine title='Active API URL:' url={activeURL} />
                  <SettingLine title='Example API URL format:' url='http://yourapiurl' />
                  <SettingLine title='Default SHAP API URL:' url={AppConfig.apiUrl} />
                  <SettingLine title='Current Printer IP:' url={this.state.currentIP} />
                  <View style={{ flex: 1, alignSelf: 'center', width: '70%', paddingTop: '5%' }} >
                    <TextInput
                      onChangeText={(val) => this.setState({newApiUrl: val})}
                      onSubmitEditing={() => {
                        let apiUrl = this.state.newApiUrl // Cache it
                        if (apiUrl !== '') { // Check if input is not an empty string.
                          publicApi.setApiUrl(apiUrl) // Set new url
                          this.setState({newApiUrl: apiUrl}) // --> FORCEUPDATE?
                        }
                      }}
                      value={this.state.newApiUrl}
                      keyboardType='default'
                      style={{ flex: 1, fontSize: 30 }}
                      selectionColor={Colors.primary}
                      underlineColorAndroid={Colors.primary}
                      placeholder='Enter API URL'
                    />
                  </View>
                  <View style={{ flex: 1, alignSelf: 'center', width: '70%', paddingTop: '5%' }} >
                    <TextInput
                      onChangeText={(val) => this.setState({newIP: val})}
                      onSubmitEditing={() => {
                        let ip = this.state.newIP // Cache it
                        //if (apiUrl !== '') { // Check if input is not an empty string.
                        setIp(ip).then(() => this.setState({newIP: ip, currentIP: ip})) // Set new url
                        //this.setState({newIP: ip}) // --> FORCEUPDATE?
                        //}
                      }}
                      value={this.state.newIP}
                      keyboardType='default'
                      style={{ flex: 1, fontSize: 30 }}
                      selectionColor={Colors.primary}
                      underlineColorAndroid={Colors.primary}
                      placeholder="Enter Remote Printer's IP"
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </Animatable.View>
        </Animatable.View>
    )
  }
}

class SettingLine extends Component {
  render () {
    let { title, url } = this.props
    return (
      <View style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row', paddingLeft: '10%', paddingTop: '1%' }} >
        <Text style={{ flex: 2, alignText: 'left', fontSize: 20, fontWeight: 'bold' }}>{title} </Text>
        <Text style={{ flex: 3, alignText: 'left', paddingLeft: 20, fontSize: 30 }}>{url}</Text>
      </View>
    )
  }
}
