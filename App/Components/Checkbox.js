import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { ApplicationStyles, Colors } from '../Themes'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PropTypes from 'prop-types'

// TODO rename to CheckboxWithLabel
export default class Checkbox extends Component {
  checkboxIconName () {
    return this.props.checked ? 'checkbox-marked' : 'checkbox-blank-outline'
  }

  renderAmount () {
    return (
      <Text style={styles.checkboxAmount}>
        ({this.props.amount})
      </Text>
    )
  }

  renderLabel () {
    return (
      <Text style={styles.checkboxLabel}>
        {this.props.label}
      </Text>
    )
  }

  render () {
    const {label, amount, onPress} = this.props
    return (
      <TouchableOpacity onPress={onPress} style={styles.checkboxView}>
        <Icon size={25} style={styles.checkboxIcon} name={this.checkboxIconName()} />
        {label && this.renderLabel()}
        {amount && this.renderAmount()}
      </TouchableOpacity>
    )
  }
}

Checkbox.defaultProps = {
  amount: null
}

Checkbox.propTypes = {
  onPress: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  amount: PropTypes.string
}

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  checkboxView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
    paddingLeft: '5%'
  },
  checkboxIcon: {
    paddingRight: '3%',
    color: Colors.black
  },
  checkboxLabel: {
    fontSize: 20
  },
  checkboxAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: '1%'
  }
})
