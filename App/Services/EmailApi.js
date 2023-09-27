import { NativeModules } from 'react-native'

const ReceiptMail = NativeModules.ReceiptMail

class EmailService {
  sendReceiptEmail = (email, encoded, senderName) => {
    return new Promise((resolve, reject) => {
      ReceiptMail.sendReceipt(email, encoded, err => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }
}

export default new EmailService()
