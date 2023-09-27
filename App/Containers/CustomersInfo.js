import React, {Component} from "react";
import I18n from "react-native-i18n";

import {
  Text, View, Modal, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


export default class CustomersInfo extends Component {
  constructor(props) {
    super(props)
  }

  renderBody() {
    return (<View/>)
  }

  renderDetail() {
    return (<View/>)
  }

  render() {

    return (
      <View>
        <Modal
          visible={this.props.visible}
          animationType={'slide'}
          onRequestClose={this.props.closeReq}>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
            <View style={{flex: 0.07, alignItems: 'flex-start'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 0.07}}>
                  <Icon name='close' size={40} style={{ alignSelf: 'flex-start', paddingTop: 5, paddingRight: 5 }} onPress={this.props.closeReq} />
                </View>
                <View style={{flex: 0.93, alignItems: 'center'}}>
                  <Text style={[{fontSize: 25, alignSelf: 'center', fontFamily: 'normal'}]}>{I18n.t('CustomersInfo')}</Text>
                </View>
              </View>

            </View>
            <View style={{flex: 0.93, alignItems: 'center', justifyContent: 'center', width: "100%"}} >
              <View style={{flexDirection: 'row', flex: 1, width: "100%"}}>
                <View style={{flex: 0.55, backgroundColor: 'white', borderColor: 'gray', borderRadius: 20, borderWidth: 3, margin: 10}}>
                  {this.renderBody()}
                </View>
                <View style={{flex: 0.45, backgroundColor: 'white', borderColor: 'gray', borderRadius: 20, borderWidth: 3, margin: 10, alignItems: 'center'}}>
                  {this.renderDetail()}
                </View>
              </View>

            </View>
          </View>

        </Modal>
      </View>
    );
  }

}
