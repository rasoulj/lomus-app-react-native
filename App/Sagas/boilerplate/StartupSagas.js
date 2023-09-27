import { put, select } from 'redux-saga/effects'
import { is } from 'ramda'

// process STARTUP actions
export function * startup (action) {
  if (__DEV__ && console.tron) {
    // fully customized!
    const subObject = { a: 1, b: [1, 2, 3], c: true }
    subObject.circularDependency = subObject // osnap!
  }
}
