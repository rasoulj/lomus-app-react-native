import HockeyApp from 'react-native-hockeyapp'
import AppConfig from '../Config/AppConfig'

export default function () {
  if (AppConfig.hockeyApp.isEnabled()) {
    HockeyApp.configure(AppConfig.hockeyApp.appId, true)
    HockeyApp.start()
    // HockeyApp.checkForUpdate() // optional
  }
}
