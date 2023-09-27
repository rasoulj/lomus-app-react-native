
export class MerchantUserId {
  merchantId: string;
  userId: string;
}

export class UserAccount {
  version: number;
  startRow: number;
  rows: number;
  sortField: string;
  sortAsc: boolean;
  id: string;
  deleted: boolean;
  displayName: string;
  firstName: string;
  lastName: string;
  image: any;
  birthDay: any;
  gender: any;
  userName: string;
  password: string;
  employeeId: any;
  positionId: any;
  ssn: any;
  info: any;
  address: any;
  city: any;
  province: any;
  country: any;
  postalCode: any;
  phone: any;
  emergencyContact: any;
  otherSocial: any;
  lumosInsightId: any;
  startDate: any;
  endDate: any;
  status: string;
  resetPasswordToken: any;
  userRoleId: any;
  clearPassword: any;
}

export class MerchantUser {
  version: number;
  startRow: number;
  rows: number;
  sortField: string;
  sortAsc: boolean;
  merchantUserId: MerchantUserId;
  pin: string;
  deleted: boolean;
  userRoleId: string;
  status: string;
  displayName: any;
  userAccount: UserAccount;
  merchantId: string;
  userId: string;
}

export class UserRole {
  startRow: number;
  rows: number;
  sortField: string;
  sortAsc: boolean;
  id: string;
  deleted: boolean;
  name: string;
}
