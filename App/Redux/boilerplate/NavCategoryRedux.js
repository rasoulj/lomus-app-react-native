import { CategoryNavigation } from '../../Navigation/CategoryNavigation'

export const reducer = (state, action) => {
  const newState = CategoryNavigation.router.getStateForAction(action, state)
  return newState || state
}
