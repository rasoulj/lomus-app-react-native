
import { Tax } from './tax'

export class Inventory {
  version: any;
  startRow: number;
  rows: number;
  sortField: string;
  sortAsc: boolean;
  id: string;
  inStockQty: number;
  unitCost: number;
  threshold: number;
  lastInventoryTXId: string;
  merchantId: string;
  dateCreated: any;
}

export class ItemVariation {
  version: any;
  startRow: number;
  rows: number;
  sortField: string;
  sortAsc: boolean;
  id: string;
  deleted: boolean;
  name: string;
  price: number;
  position: number;
  image: string;
  description: string;
  merchantId: string;
  webStorePrice: number;
  brand: string;
  rank: number;
  visible: boolean;
  shippingAllowed: boolean;
  shippingRate: number;
  cost: number;
  dataSource: any;
  itemId: string;
  dateCreated: any;
  inventory: Inventory;
  variationAttributes: any[];
  variationExtendedAttributes: any[];
  sku: string;
  upc: string;
  SKU: string;
  UPC: string;
}
export class Item {
  version: any;
  startRow: number;
  rows: number;
  sortField: string;
  sortAsc: boolean;
  id: string;
  deleted: boolean;
  name: string;
  seoName: string;
  seoTitle: string;
  seoDescription: string;
  seoMetaDescription: string;
  info: string;
  label: string;
  color: string;
  image: string;
  itemClass: any;
  itemType: string;
  amount: number;
  score: number;
  hasInventory: boolean;
  merchantId: string;
  courseId: any;
  parentId: string;
  dateCreated: any;
  rank: number;
  parent: Item;
  itemVariations: ItemVariation[];
  itemAttributes: any[];
  modifierSets: any[];
  taxes: Tax[];
  printers: any[];
  visible: boolean;
  ibrandId: any;
}
