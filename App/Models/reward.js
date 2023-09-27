import { Merchant } from './merchant'

export class Reward {
  version: number;
  startRow: number;
  rows: number;
  sortField: string;
  sortAsc: boolean;
  id: string;
  deleted: boolean;
  name: string;
  merchantId: string;
  type: string;
  goal: number;
  minTXValue: number;
  redeemType: string;
  effectiveDate: any;
  expiryDate: any;
  redemptionExpiryDate: any;
  discountAmount: number;
  discountPercentage: number;
  maxRewardAmount: number;
  merchant: Merchant;
}
