
export class MerchantLocation {
  country: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  fullAddress: string;
}

export class MerchantInfo {
  website: string;
  returnPolicy: string;
  phoneNumber: string;
  ownerName: string;
  faxNumber: string;
  logo: string;
  isInStorePickupEnabled: boolean;
  location: MerchantLocation;
  pickupInstructions: string;
}
