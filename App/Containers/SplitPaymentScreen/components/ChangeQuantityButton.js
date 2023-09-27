import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors } from '../../../Themes/index'

// TODO this can probably be re-used elsewhere. please research
export default class ChangeQuantityButton extends React.Component {
  render () {
    const {type = 'plus', onPress, size, disabled} = this.props
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <Icon
          name={`${type}-circle`}
          size={size}
          color={Colors.primary}
        />
      </TouchableOpacity>
    )
  }
}

ChangeQuantityButton.defaultProps = {
  type: 'plus',
  size: 30,
  disabled: false
}

ChangeQuantityButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.number,
}
