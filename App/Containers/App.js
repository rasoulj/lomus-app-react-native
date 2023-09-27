import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import { RealmProvider } from 'react-native-realm'
import { realm } from '../Realm/RealmService'
import codePush from "react-native-code-push";

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */


class App extends Component {
  state = {
    initializing: true,
    store: createStore(() => this.setState({initializing: false}))
  }

  render () {
    if (this.state.initializing) {
      // TODO display a splash screen instead, while the store is initializing
      return null
    }

    return (
      <Provider store={this.state.store}>
        <RealmProvider realm={realm}>
          <RootContainer />
        </RealmProvider>
      </Provider>
    )
  }
}

//App = codePush(App);


// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(codePush(App))
  : codePush(App)
