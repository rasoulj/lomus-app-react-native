import { AppNavigation } from '../../Navigation/ReduxNavigation'

export const reducer = (state, action) => {
  const newState = AppNavigation.router.getStateForAction(action, state)
  return newState || state
}
