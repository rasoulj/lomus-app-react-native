import { NativeModules } from 'react-native'

const Transaction = NativeModules.Q20TransactionModule

class TransactionService {

  connect () {
    return Transaction.connect()
  }

  disconnect () {
    return Transaction.disconnect()
  }

  transact (amount) {
    if (typeof amount !== 'string') {
      amount = amount.toString()
    }
    return Transaction.transact(amount)
  }

}

export default new TransactionService()
