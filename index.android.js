import './App/Config/ReactotronConfig'
import { AppRegistry, Alert, BackHandler, I18nManager } from 'react-native'
//import ReactNative from 'react-native'
import App from './App/Containers/App'
import DeviceInfo from 'react-native-device-info'
import RNFS from 'react-native-fs'



import {I18n} from 'react-native-i18n'

//ReactNative.I18nManager.allowRTL(true);

I18nManager.forceRTL(true);

const saveErrorMessageLocally = (message, path) => {
  RNFS.writeFile(path, message, 'utf8')
    .then((success) => {
      console.log('CRASH LOG PATH:', path)
    })
    .catch((err) => {
      console.log('CRASH LOGGING ERROR:', err.message)
    })
}

const errorHandlerJS = (e, isFatal) => {
  let date = new Date().toISOString().replace(/\s/g, '')
  let path = RNFS.DocumentDirectoryPath + `/crashreport${date}.txt`
  let errorMessage = `
  ---Crash Log Saved---
  Path: ${path}

  ---Date---
  ${date}

  ---Error---
  Error Name:
  ${e.name}

  Error Message:
  ${e.message}

  Error Stack:
  ${e.stack}

  ---Device Data---
  Manufacturer: ${DeviceInfo.getManufacturer()}
  Brand: ${DeviceInfo.getBrand()}
  Model: ${DeviceInfo.getModel()}
  Device Name: ${DeviceInfo.getDeviceName()}
  Country: ${DeviceInfo.getDeviceCountry()}
  `

  saveErrorMessageLocally(errorMessage, path)
  Alert.alert(
     I18n.t('Unexpected_error_occurred'),
      errorMessage,
    [ // Buttons
      {
        text: I18n.t('Close_Application'),
        onPress: () => BackHandler.exitApp()
      }
    ],
    { cancelable: false }
  )
}

if (!__DEV__) { // Use default react-native red screen if not dev
  global.ErrorUtils.setGlobalHandler(errorHandlerJS)
  console.error = (message, error) => global.ErrorUtils.reportError(error) // sending console.error so that it can be caught
}

AppRegistry.registerComponent('IndigoApp', () => App)
