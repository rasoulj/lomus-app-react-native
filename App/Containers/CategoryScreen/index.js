import React, { Component } from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { ApplicationStyles, Colors } from '../../Themes/index'
import ItemScreen from './ItemScreen'
import LeftHeader from '../../Components/LeftHeader'
import SubcategoryScreen from './SubcategoryScreen'
import InitScreen from './InitScreen'
import ItemVariationScreen from './ItemVariationScreen'
import {saleId} from '../../Redux/SalesRedux'
import ImageBackground from "../ImageBackground"

import I18n from 'react-native-i18n'

class CategoryScreen extends Component {


  static navigationOptions = ({navigation, screenProps}) => ({
    //title: navigation.state.params ? navigation.state.params.title : I18n.t('Categories'),
    //headerLeft: navigation.state.params ? <LeftHeader navigation={navigation} /> : <View />,
    //header: <View style={{backgroundColor: Colors.ui_back}}><Text style={styles.hStyle}>{navigation.state.params ? navigation.state.params.title : I18n.t('Categories')}</Text></View>,
    //titleStyle: styles.hStyle,
    //header: null,
    title: navigation.state.params ? navigation.state.params.screenType : <Text>init</Text>,
    headerLeft: navigation.state.params ? <LeftHeader navigation={navigation} /> : <View />,

    header: null

  })
  //*/

  screen () {
    const params = this.params()
    return params ? params.screenType : 'init'
  }

  params () {
    return this.props.navigation.state.params
  }

  renderBody () {
    const {navigation} = this.props
    const params = this.params()

    switch (this.screen()) {
      case 'init':
        return <InitScreen navigation={navigation} />
      case 'subcat':
        return <SubcategoryScreen categoryId={params.id} navigation={navigation} />
      case 'item':
        return <ItemScreen navigation={navigation} subcategoryId={params.id} />
      case 'itemVariation':
        return <ItemVariationScreen navigation={navigation} itemId={params.id} categoryId={this.params().catId} />
    }
    //*/
  }

  bgImage() {
    var sc = this.screen();

    console.log(sc);

    if(sc == 'init') return require('../../Images/init.png');
    else return require('../../Images/subcat2.png');
  }

  render () {
    return (
      <View style={[styles.mainContainer]}>
        <ImageBackground source={this.bgImage()} style={{width: '100%', height: '100%'}}>

        <ScrollView style={styles.container}>
          <View style={styles.section}>
            {this.renderBody()}
            {this.showItemInformation ? (
              View
            ) : undefined}
          </View>
        </ScrollView>
        </ImageBackground>

      </View>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    saleId: saleId(state),
    processingPayment: state.flag.processingPayment
  }
}

export default connect(mapStateToProps)(CategoryScreen)

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})
