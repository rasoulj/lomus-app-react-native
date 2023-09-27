
export class Contact {
  version: number;
  startRow: number;
  rows: number;
  sortField: string;
  sortAsc: boolean;
  id: string;
  deleted: boolean;
  lastName: string;
  firstName: string;
  title: string;
  email: string;
  phone: string;
}

export class MerchantSettingId {
  merchantId: string;
  settingKey: string;
}

export class MerchantSetting {
  version: any;
  startRow: number;
  rows: number;
  sortField: string;
  sortAsc: boolean;
  merchantSettingId: MerchantSettingId;
  settingValue: string;
}

export class Merchant {
  version: number;
  startRow: number;
  rows: number;
  sortField: string;
  sortAsc: boolean;
  id: string;
  deleted: boolean;
  name: string;
  processorId: string;
  dbaName: any;
  contact1Id: string;
  contact2Id: any;
  info: string;
  restaurant: boolean;
  rewardEnabled: boolean;
  logo: string;
  mcc: string;
  status: string;
  activationDate: number;
  terminationDate: any;
  terminationReason: any;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  province: string;
  phone: string;
  fax: string;
  webSite: string;
  salesRepId: any;
  salesCompany: any;
  salesManagerName: any;
  salesRepName: any;
  bankName: any;
  bankAddress: any;
  bankPhone: any;
  bankABARouting: any;
  bankAccountNumber: any;
  lumosAccountStatus: any;
  yearlyTransactions: number;
  yearlyVolume: number;
  monthlyTransactions: number;
  monthlyVolume: number;
  ownerName: string;
  terminalCaptureEnabled: boolean;
  inStorePickupEnabled: boolean;
  pickupInstructions: string;
  returnPolicy: string;
  shippingRate: number;
  appPassword: string;
  clearAppPassword: any;
  activationToken: any;
  gateway: string;
  backend: string;
  processor: string;
  ecommerceProcessorId: string;
  hubSpotContext: any;
  contact1: Contact;
  contact2: any;
  merchantSettings: MerchantSetting[];
}
