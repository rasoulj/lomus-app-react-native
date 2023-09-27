import UUID from '../../Utils/UUID'

const createDummyCreditCardDetails = () => ({
  method: 'VISA',
  // TODO: update this to real data from swipe
  confirmationCode: 'AUTH CODE EXAM PLE1',
  referenceNo: 'REF_NO_EXAMPLE1',
  paymentCard: {
    id: UUID(),
    cardHolderName: 'JOHN DOE',
    expirationDate: '1218',
    securityCode: '252',
    type: 'VISA',
    cardNumber: '1432'
  }
})

export default createDummyCreditCardDetails
