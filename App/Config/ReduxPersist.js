import immutablePersistenceTransform from '../Services/ImmutablePersistenceTransform'
import { AsyncStorage } from 'react-native'

// More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const REDUX_PERSIST = {
  active: true,
  reducerVersion: '1.0',
  storeConfig: {
    storage: AsyncStorage,
    blacklist: [ ], // 'nav'   reducer keys that you do NOT want stored to persistence here
    whitelist: ['api', 'emp', 'nav', 'nav2', 'sales', 'flag'], // Optionally, just specify the keys you DO want stored to
    // persistence. An empty array means 'don't store any reducers' -> infinitered/ignite#409

    // TODO: bring back? Was causing issues when we persist nav state
    transforms: [immutablePersistenceTransform]
  }
}

export default REDUX_PERSIST
