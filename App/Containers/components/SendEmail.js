import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'

import QMButton from '../QMButton'
import QMInput from '../QMInput'
import I18n from 'react-native-i18n'
const isEmailValid = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export default class SendEmail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  isSendButtonActive () {
    return isEmailValid(this.state.email)
  }

  onSend () {
    this.props.onSend(this.state.email)
  }

  render () {
    return (
      <View style={{paddingBottom: 30, flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.emailInputView}>
          <QMInput
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            label={I18n.t('email_MSG')}
            height={50}
            keyboardType='email-address'
            onSubmitEditing={() => this.sendEmail()}
          />
        </View>
        <View style={{flex: 1, paddingRight: 20, alignSelf: 'flex-end'}}>
          <QMButton
            isSelected={this.isSendButtonActive()}
            onPress={() => this.onSend()}
            disabled={!this.isSendButtonActive()}
          >
           {I18n.t('SEND')}
          </QMButton>
        </View>
      </View>
    )
  }
}

SendEmail.propTypes = {
  onSend: PropTypes.func.isRequired
}

const styles = {
  emailInputView: {
    flex: 3,
    paddingLeft: 20,
    paddingRight: 20
  }
}
