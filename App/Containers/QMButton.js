import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import Button from 'react-native-button'
import { ApplicationStyles, Colors, Metrics } from '../Themes'
import PropTypes from 'prop-types'
import Fonts from "../Themes/Fonts";




const btnSize = Metrics.btnSize

export default class QMButton extends Component {
  render () {
    // isSelected - If this button should be highlighted as currently selected
    // full - Is the button an outline or filled in
    const {isSelected, full, hide, btnType, ...rest} = this.props
    if (hide) {
      return (
        <View />
      )
    }

    let style = []

    if (full) {
      style[0] = styles.primaryBtn
    } else {
      style[0] = isSelected ? styles.primaryBtnActive : styles.primaryBtnOutline
    }

    if(btnType == 'choice') {
      style[1] = {
        padding: 14,
        paddingTop: 16,
        paddingBottom: 17,
        fontFamily: Fonts.type.base,
        fontSize: Metrics.btnSize,
        fontWeight: '400',
        letterSpacing: 0.19,
        textAlign: 'center',
        color: Colors.text,
        borderRadius: 33.3,
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderWidth: isSelected ? 1 : 0,
        borderColor: Colors.primary,
        elevation: isSelected ? 3 : 0
      }
    }

    if (btnType === 'reset') {
      style[1] = {
        borderColor: Colors.gray,
        color: Colors.text,
        fontFamily: 'normal',
        fontWeight: '400',
        fontSize: btnSize,
        width: 250
      }
    }

    if (btnType === 'green') {
      style[1] = {
        borderColor: 'rgb(52,219,103)',
        color: Colors.white,
        fontFamily: 'normal',
        fontWeight: '400',
        fontSize: btnSize,
        width: 250,
        backgroundColor: 'rgb(52,219,103)'
      }
    }

    if (btnType === 'charge') {
      style[1] = {
        borderColor: 'rgb(52,219,103)',
        color: Colors.white,
        fontFamily: 'normal',
        fontWeight: '400',
        fontSize: btnSize,
        width: 350,
        backgroundColor: 'rgb(52,219,103)'
      }
    }

    if (btnType === 'blue') {
      style[1] = {
        borderColor: 'rgb(46,60,86)',
        color: Colors.white,
        fontFamily: 'normal',
        fontWeight: '400',
        fontSize: btnSize,
        width: 250,
        backgroundColor: 'rgb(46,60,86)'
      }
    }
    if (btnType === 'blue2') {
      style[1] = {
        borderColor: 'rgb(46,60,86)',
        color: Colors.white,
        fontFamily: 'normal',
        fontWeight: '400',
        fontSize: btnSize,
        width: 100,
        backgroundColor: 'rgb(46,60,86)'
      }
    }

    if (btnType === 'green2') {
      style[1] = {
        borderColor: 'rgb(52,219,103)',
        color: Colors.white,
        fontFamily: 'normal',
        fontWeight: '400',
        fontSize: btnSize,
        width: 150,
        verticalAlign: 'bottom',
        backgroundColor: 'rgb(52,219,103)'
      }
    }

    if (btnType === 'paymentOffer') {
      style[1] = {
        borderColor: 'rgb(46,60,86)',
        color: Colors.white,
        fontFamily: 'normal',
        fontWeight: '400',
        fontSize: btnSize,
        backgroundColor: 'rgb(46,60,86)',
        borderRadius: 10
      }
    }

    if (btnType === 'danger') {
      style[1] = {
        borderColor: Colors.red,
        color: Colors.red,
        fontFamily: 'normal',
        fontWeight: '400',
        fontSize: btnSize
      }
    }

    if (btnType === 'error' && full) {
      style[1] = {
        borderColor: Colors.white,
        borderWidth: 3,
        color: '#fc5863',
        backgroundColor: Colors.white,
        fontFamily: 'normal',
        fontWeight: '400',
        fontSize: btnSize
      }
    } else if (btnType === 'error') {
      style[1] = {
        borderWidth: 3,
        borderColor: Colors.white,
        color: Colors.white,
        fontFamily: 'normal',
        fontWeight: '400',
        fontSize: btnSize
      }
    }

    return (
      <Button
        style={style}
        containerStyle={styles.primaryBtnOutlineContainer}
        styleDisabled={styles.primaryBtnDisabled}
        {...rest}
      />
    )
  }
}

QMButton.defaultProps = {
  full: false,
  hide: false,
  isSelected: false,
  btnType: 'info'
}

QMButton.propTypes = {
  hide: PropTypes.bool,
  full: PropTypes.bool,
  isSelected: PropTypes.bool,
  btnType: PropTypes.string,
  children: PropTypes.node.isRequired
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen
})
