import React, { Component } from 'react';
import { Text, View, Button, Modal, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'



export default class AboutUs extends Component {
  render() {
    return (
      <View>
        <Modal
          visible={this.props.visible}
          animationType={'slide'}
          onRequestClose={this.props.closeReq}>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
            <View style={{height: "10%", backgroundColor: '', alignItems: 'flex-start'}}>
              <Icon name='close' size={40} style={{ alignSelf: 'flex-start', paddingTop: 5, paddingRight: 5 }} onPress={this.props.closeReq} />
            </View>
            <View style={{height: "90%", alignItems: 'center', justifyContent: 'center'}} >
              <Image
                style={{width: '50%', height: '50%'}}
                source={require('../Images/logo.png')}
              />
            </View>
          </View>

        </Modal>
      </View>
    );
  }
}
