
export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice?: number; // 成本價
  discountPrice?: number; // 優惠價
  stock: number;
  category: string;
  description?: string;
  imageUrl?: string;
  shopeeId?: string; // For integration
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  originalTotal: number; // 紀錄未折扣前的總價
  discountAmount: number;
}

export type MemberTier = '普通' | '銀牌' | '金牌' | '鑽石';

export interface Member {
  id: string;
  name: string;
  phone: string;
  points: number;
  joinDate: string;
  history: Transaction[]; // 購買歷史
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'cashier';
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  POS = 'POS',
  INVENTORY = 'INVENTORY',
  MEMBERS = 'MEMBERS',
  SETTINGS = 'SETTINGS'
}

export interface IntegrationConfig {
  shopeeApiKey: string;
  shopeeShopId: string;
  invoiceApiKey: string;
  invoiceApiSecret: string;
}
