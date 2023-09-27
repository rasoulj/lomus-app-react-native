import React, { Component } from 'react'

export default class SellInfoScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        //title: I18n.t('Payment_Processed'),
        title: <Text style={styles.hStyle}>{I18n.t('SellInfo')}</Text>,
        headerLeft: <Text />
    })



}