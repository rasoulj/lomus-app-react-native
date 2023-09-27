
export class LineItem {
  rewardCode: any;
  refundOriginalLineItemId: any;
  totalPrice: number;
  taxIds: string[];
  taxAmount: number;
  discountAmount: number;
  itemVariationId: string;
  modifierOptionAmount: number;
  modifierOptionIds: any;
  id: string;
  quantity: number;
  refundFee: number;
  discountIds: any;
  courseId: any;
  unitPrice: number;
  inventoryUpdate: number;
  note: string;
  refundType: any;
  customerGiftCard: any;
  returnQuantity: number;
  taxAmountIncluded: number;
}

export class PaymentCardType {
  VISA = 'VISA';
  MASTERCARD = 'MASTERCARD';
  AMEX = 'AMEX';
  DINERS = 'DINERS';
  DEBIT = 'DEBIT';
  DISCOVER = 'DISCOVER';
  OTHER = 'OTHER';
}

export class PaymentCard {
  cardHolderName: string;
  id: string;
  expirationDate: string;
  securityCode: string;
  type: string;
  cardNumber: string;
}

export class PaymentTX {
  status: string;
  time: Date;
  customerRewardId: any;
  confirmationCode: string;
  settleFailReason: any;
  paymentCard: PaymentCard;
  authAmount: number;
  changeAmount: number;
  settleFailResolve: any;
  method: string;
  signature: string;
  customerGiftCardId: any;
  customerAgeRange: any;
  id: string;
  referenceNo: string;
  customer: any;
  note: any;
  receiveAmount: number;
  totalAmount: number;
  customerPostalCode: any;
  customerGender: any;
}

export class SaleTX {
  status: any;
  time: Date;
  amount: number;
  tax: number;
  receiptId: any;
  referenceId: any;
  discount: number;
  taxIncluded: number;
  lineItems: LineItem[];
  deliveryStatus: any;
  id: string;
  salesPerson: any;
  refundFee: number;
  merchantId: string;
  tip: number;
  paymentTXs: PaymentTX[];
  note: any;
  groupId: any;
  refundFeeDescr: any;
  tableNumber: any;
  userId: string;
}

/**
 * Definition with optionals
 *
 *
 export class LineItem {
  rewardCode?: any;
  refundOriginalLineItemId?: any;
  totalPrice: number;
  taxIds: string[];
  taxAmount: number;
  discountAmount: number;
  itemVariationId: string;
  modifierOptionAmount: number;
  modifierOptionIds?: any;
  id: string;
  quantity: number;
  refundFee: number;
  discountIds?: any;
  courseId?: any;
  unitPrice: number;
  inventoryUpdate: number;
  note: string;
  refundType?: any;
  customerGiftCard?: any;
  returnQuantity: number;
  taxAmountIncluded: number;
}

 export class PaymentCardType {
  VISA = 'VISA';
  MASTERCARD = 'MASTERCARD';
  AMEX = 'AMEX';
  DINERS = 'DINERS';
  DEBIT = 'DEBIT';
  DISCOVER = 'DISCOVER';
  OTHER = 'OTHER';
}

 export class PaymentCard {
  cardHolderName: string;
  id: string;
  expirationDate: string;
  securityCode: string;
  type: string;
  cardNumber: string;
}

 export class PaymentTX {
  status: string;
  time: Date;
  customerRewardId?: any;
  confirmationCode: string;
  settleFailReason?: any;
  paymentCard: PaymentCard;
  authAmount: number;
  changeAmount: number;
  settleFailResolve?: any;
  method: string;
  signature: string;
  customerGiftCardId?: any;
  customerAgeRange?: any;
  id: string;
  referenceNo: string;
  customer?: any;
  note?: any;
  receiveAmount: number;
  totalAmount: number;
  customerPostalCode?: any;
  customerGender?: any;
}

 export class SaleTX {
  status?: any;
  time: Date;
  amount: number;
  tax: number;
  receiptId?: any;
  referenceId?: any;
  discount: number;
  taxIncluded: number;
  lineItems: LineItem[];
  deliveryStatus?: any;
  id: string;
  salesPerson?: any;
  refundFee: number;
  merchantId: string;
  tip: number;
  paymentTXs: PaymentTX[];
  note?: any;
  groupId?: any;
  refundFeeDescr?: any;
  tableNumber?: any;
  userId: string;
}
 *
 */

/** EXAMPLE: CASH TRANSACTION 1
 *
 *

 {
	"status": null,
	"time": "2017-08-01T21:37:57-04:00",
	"amount": 1218.88,
	"tax": 120.79,
	"receiptId": null,
	"referenceId": null,
	"discount": 0,
	"taxIncluded": 0,
	"lineItems": [{
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 759,
		"taxIds": ["5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 83.48999999999999,
		"discountAmount": 0,
		"itemVariationId": "aaecb801-490e-419d-ff54-17549511d0df",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "1925E2F7-873C-4E80-83E5-A1E9EE23D2D4",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 759,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}, {
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 339.09,
		"taxIds": ["5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 37.3,
		"discountAmount": 0,
		"itemVariationId": "aeafb618-b942-4119-b9c6-d16ce0cb92bb",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "ADD5EDB8-FD17-45D0-881B-07C660439CA6",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 339.09,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}],
	"deliveryStatus": null,
	"id": "075EFBBF-A29E-443E-A3DB-DB81A6A04EE2",
	"salesPerson": null,
	"refundFee": 0,
	"merchantId": "551332132",
	"tip": 0,
	"paymentTXs": [{
		"status": null,
		"time": "2017-08-01T21:37:42-04:00",
		"customerRewardId": null,
		"confirmationCode": null,
		"settleFailReason": null,
		"paymentCard": null,
		"authAmount": 0,
		"changeAmount": 0,
		"settleFailResolve": null,
		"method": "CASH",
		"signature": null,
		"customerGiftCardId": null,
		"customerAgeRange": null,
		"id": "7AD65A76-2879-4909-B846-4E13A5977853",
		"referenceNo": null,
		"customer": null,
		"note": null,
		"receiveAmount": 1218.88,
		"totalAmount": 1218.88,
		"customerPostalCode": null,
		"customerGender": null
	}],
	"note": null,
	"groupId": null,
	"refundFeeDescr": null,
	"tableNumber": null,
	"userId": "188a77c1-9e5b-4259-9768-edafa869df0f"
}

 */

/**
 * EXAMPLE: CASH TRANSACTION 2, WITH DISCOUNT (LINE ITEM 1)
 *
 {
	"status": null,
	"time": "2017-08-01T21:39:38-04:00",
	"amount": 1288.43,
	"tax": 151.05,
	"receiptId": null,
	"referenceId": null,
	"discount": 200.71,
	"taxIncluded": 0,
	"lineItems": [{
		"rewardCode": "",
		"refundOriginalLineItemId": null,
		"totalPrice": 0,
		"taxIds": null,
		"taxAmount": 0,
		"discountAmount": 0,
		"itemVariationId": null,
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "9116FE54-9045-473A-AE2B-7664315FC2A9",
		"quantity": 0,
		"refundFee": 0,
		"discountIds": ["B918A85A-7E77-402D-B2A4-6D13A2897EF7"],
		"courseId": null,
		"unitPrice": 0,
		"inventoryUpdate": 0,
		"note": null,
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}, {
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 339.09,
		"taxIds": ["6bc4ac92-68fc-4f73-9a72-97088b6df28f", "5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 67.818,
		"discountAmount": 0,
		"itemVariationId": "aeafb618-b942-4119-b9c6-d16ce0cb92bb",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "6BE41E2B-F2DA-43E7-9746-95B1FD6C2AF0",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 339.09,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}, {
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 999,
		"taxIds": ["5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 109.89,
		"discountAmount": 0,
		"itemVariationId": "b6bc5f08-f3e2-42eb-8e68-bf8e339c122d",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "F125C8F7-38A9-40AE-A98B-BA83AF6FAAD2",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 999,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}],
	"deliveryStatus": null,
	"id": "13CFBA01-CC36-4AA1-82F2-3B1E9FC81025",
	"salesPerson": null,
	"refundFee": 0,
	"merchantId": "551332132",
	"tip": 0,
	"paymentTXs": [{
		"status": null,
		"time": "2017-08-01T21:39:26-04:00",
		"customerRewardId": null,
		"confirmationCode": null,
		"settleFailReason": null,
		"paymentCard": null,
		"authAmount": 0,
		"changeAmount": 0,
		"settleFailResolve": null,
		"method": "CASH",
		"signature": null,
		"customerGiftCardId": null,
		"customerAgeRange": null,
		"id": "6D9A3FB1-3E28-493B-A058-4918A4868125",
		"referenceNo": null,
		"customer": null,
		"note": null,
		"receiveAmount": 1288.43,
		"totalAmount": 1288.43,
		"customerPostalCode": null,
		"customerGender": null
	}],
	"note": null,
	"groupId": null,
	"refundFeeDescr": null,
	"tableNumber": null,
	"userId": "188a77c1-9e5b-4259-9768-edafa869df0f"
}
 */

/**
 * EXAMPLE: CASH TRANSACTION 3 (Multiple TAX IDs for LINE ITEM 3)

 {
	"status": null,
	"time": "2017-08-01T21:46:41-04:00",
	"amount": 488.83,
	"tax": 48.54,
	"receiptId": null,
	"referenceId": null,
	"discount": 0,
	"taxIncluded": 0,
	"lineItems": [{
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 339.09,
		"taxIds": ["5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 37.3,
		"discountAmount": 0,
		"itemVariationId": "aeafb618-b942-4119-b9c6-d16ce0cb92bb",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "C189733A-ADA9-4943-AB70-C21EAB7BA2B7",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 339.09,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}, {
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 100,
		"taxIds": ["5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 11,
		"discountAmount": 0,
		"itemVariationId": "68ee999d-a9c3-4b67-8a42-bf0c0be4edac",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "7E4F1572-7F4A-4E02-A4BE-F0692C02EC04",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 100,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}, {
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 1.2,
		"taxIds": ["6bc4ac92-68fc-4f73-9a72-97088b6df28f", "5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 0.24,
		"discountAmount": 0,
		"itemVariationId": "514f3f22-7acd-4ebf-fd14-96729c9a5936",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "0C07CB5D-FAF0-42E5-ABCB-268BD9B60308",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 1.2,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}],
	"deliveryStatus": null,
	"id": "0CFB08B7-6E2E-4AF4-BF64-FA78BFFECAA4",
	"salesPerson": null,
	"refundFee": 0,
	"merchantId": "551332132",
	"tip": 0,
	"paymentTXs": [{
		"status": null,
		"time": "2017-08-01T21:45:10-04:00",
		"customerRewardId": null,
		"confirmationCode": null,
		"settleFailReason": null,
		"paymentCard": null,
		"authAmount": 0,
		"changeAmount": 0,
		"settleFailResolve": null,
		"method": "CASH",
		"signature": null,
		"customerGiftCardId": null,
		"customerAgeRange": null,
		"id": "D6DF76D1-EDEB-40F3-8248-E07DAFA69082",
		"referenceNo": null,
		"customer": null,
		"note": null,
		"receiveAmount": 488.83,
		"totalAmount": 488.83,
		"customerPostalCode": null,
		"customerGender": null
	}],
	"note": null,
	"groupId": null,
	"refundFeeDescr": null,
	"tableNumber": null,
	"userId": "188a77c1-9e5b-4259-9768-edafa869df0f"
}

 */

/**
 * EXAMPLE: VISA TRANSACTION
 *
 {
	"status": null,
	"time": "2017-08-01T22:09:06-04:00",
	"amount": 1486.72,
	"tax": 147.43,
	"receiptId": null,
	"referenceId": null,
	"discount": 0,
	"taxIncluded": 0,
	"lineItems": [{
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 999,
		"taxIds": ["5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 109.89,
		"discountAmount": 0,
		"itemVariationId": "b6bc5f08-f3e2-42eb-8e68-bf8e339c122d",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "92339672-64E5-4628-B05B-12992FBDE903",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 999,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}, {
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 339.09,
		"taxIds": ["5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 37.3,
		"discountAmount": 0,
		"itemVariationId": "aeafb618-b942-4119-b9c6-d16ce0cb92bb",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "F600EECA-D695-4C11-9DCF-6C385A02818F",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 339.09,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}, {
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 1.2,
		"taxIds": ["6bc4ac92-68fc-4f73-9a72-97088b6df28f", "5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 0.24,
		"discountAmount": 0,
		"itemVariationId": "514f3f22-7acd-4ebf-fd14-96729c9a5936",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "9E7CB51C-0E50-4348-B8D4-5061CB34C7A0",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 1.2,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}],
	"deliveryStatus": null,
	"id": "1BC26396-E729-4FC0-A37D-28D7E38DAC51",
	"salesPerson": null,
	"refundFee": 0,
	"merchantId": "551332132",
	"tip": 0,
	"paymentTXs": [{
		"status": "SETTLED",
		"time": "2017-08-01T22:08:42-04:00",
		"customerRewardId": null,
		"confirmationCode": "AUTH CODE EXAM PLE1",
		"settleFailReason": null,
		"paymentCard": {
			"cardHolderName": "",
			"id": "598D3B69-9322-4A67-8C50-9A015E4EE098",
			"expirationDate": "1218",
			"securityCode": "252",
			"type": "VISA",
			"cardNumber": "1111"
		},
		"authAmount": 0,
		"changeAmount": 0,
		"settleFailResolve": null,
		"method": "VISA",
		"signature": "empty_sign.png",
		"customerGiftCardId": null,
		"customerAgeRange": null,
		"id": "ORDER_ID_EXAMPLE1",
		"referenceNo": "REF_NO_EXAMPLE1",
		"customer": null,
		"note": null,
		"receiveAmount": 1486.72,
		"totalAmount": 1486.72,
		"customerPostalCode": null,
		"customerGender": null
	}],
	"note": null,
	"groupId": null,
	"refundFeeDescr": null,
	"tableNumber": null,
	"userId": "188a77c1-9e5b-4259-9768-edafa869df0f"
}
 */

/**
 * EXAMPLE: MASTERCARD TRANSACTION
 *
 {
	"status": null,
	"time": "2017-08-01T22:29:29-04:00",
	"amount": 4219.89,
	"tax": 620.89,
	"receiptId": null,
	"referenceId": null,
	"discount": 0,
	"taxIncluded": 0,
	"lineItems": [{
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 1099,
		"taxIds": ["5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 120.89,
		"discountAmount": 0,
		"itemVariationId": "d47fed4a-575c-4104-9bb0-392a1376f0ac",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "4A071717-AC0E-4868-9D87-FCC53602BBE2",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 1099,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}, {
		"rewardCode": null,
		"refundOriginalLineItemId": null,
		"totalPrice": 2500,
		"taxIds": ["6bc4ac92-68fc-4f73-9a72-97088b6df28f", "5b190fcf-1355-4c4c-a4df-65793296c1a7"],
		"taxAmount": 500,
		"discountAmount": 0,
		"itemVariationId": "8FA68937-E0B1-4775-831E-726D4E3AD28C",
		"modifierOptionAmount": 0,
		"modifierOptionIds": null,
		"id": "6BEC9536-E210-48D5-8BB3-B10801620EEC",
		"quantity": 1,
		"refundFee": 0,
		"discountIds": null,
		"courseId": null,
		"unitPrice": 2500,
		"inventoryUpdate": 0,
		"note": "",
		"refundType": null,
		"customerGiftCard": null,
		"returnQuantity": 0,
		"taxAmountIncluded": 0
	}],
	"deliveryStatus": null,
	"id": "053DE3CD-ED3E-4517-8B46-135A11BB8E6C",
	"salesPerson": null,
	"refundFee": 0,
	"merchantId": "551332132",
	"tip": 0,
	"paymentTXs": [{
		"status": "SETTLED",
		"time": "2017-08-01T22:29:11-04:00",
		"customerRewardId": null,
		"confirmationCode": "AUTH CODE EXAM PLE1 700B79F7-CD87-4B59-8DEB-A6141324194F",
		"settleFailReason": null,
		"paymentCard": {
			"cardHolderName": "",
			"id": "9E93EF2D-339F-4B10-AB19-DB1926CDD681",
			"expirationDate": "1125",
			"securityCode": "111",
			"type": "MASTERCARD",
			"cardNumber": "4444"
		},
		"authAmount": 0,
		"changeAmount": 0,
		"settleFailResolve": null,
		"method": "MASTERCARD",
		"signature": "empty_sign.png",
		"customerGiftCardId": null,
		"customerAgeRange": null,
		"id": "ORDER_ID_7710F740-D793-49DF-9E2F-0D03E6D2492B",
		"referenceNo": "REF_NO_EXAMPLE1_754DE78F-66DE-48CA-8645-A9F25873166A",
		"customer": null,
		"note": null,
		"receiveAmount": 4219.89,
		"totalAmount": 4219.89,
		"customerPostalCode": null,
		"customerGender": null
	}],
	"note": null,
	"groupId": null,
	"refundFeeDescr": null,
	"tableNumber": null,
	"userId": "188a77c1-9e5b-4259-9768-edafa869df0f"
}
 */
