import React from 'react'
import { connect } from 'react-redux'
import View from 'react-native'
import QMButton from './QMButton'
import { actionCreators } from '../Redux/SalesRedux'
import I18n from 'react-native-i18n'

const {createNewTicket} = actionCreators

class ResetTicketButton extends React.Component {
  render () {
    return (
      <QMButton
        btnType='reset'
        onPress={() => this.props.createNewTicket()}
      >{I18n.t('RESET_TICKET')}</QMButton>
    )
  }
}

export default connect(null, {createNewTicket})(ResetTicketButton)
