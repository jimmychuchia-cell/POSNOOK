
import { Product, Member } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '狸克咖啡',
    price: 200,
    costPrice: 50,
    discountPrice: 180,
    stock: 50,
    category: '飲品',
    description: '手工沖泡的特製混合咖啡，有鈴錢的味道。',
    imageUrl: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: '2',
    name: '特製蘋果',
    price: 500,
    costPrice: 100,
    stock: 20,
    category: '水果',
    description: '雖然看起來像普通的蘋果，但特別閃亮。',
    imageUrl: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: '3',
    name: '簡單DIY作業台',
    price: 1500,
    costPrice: 800,
    discountPrice: 1200,
    stock: 5,
    category: '家具',
    description: '用木頭製作的堅固作業台。',
    imageUrl: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: '4',
    name: '旅行券',
    price: 2000,
    costPrice: 200,
    stock: 100,
    category: '票券',
    description: '前往無人島的必備機票。',
    imageUrl: 'https://picsum.photos/200/200?random=4'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: '西施惠',
    phone: '0912345678',
    points: 1200,
    joinDate: '2023-01-01',
    history: []
  },
  {
    id: 'm2',
    name: '豆狸',
    phone: '0987654321',
    points: 50,
    joinDate: '2023-05-20',
    history: []
  }
];

export const CATEGORIES = ['全部', '飲品', '水果', '家具', '票券', '服飾'];

export const TIER_THRESHOLDS = {
  SILVER: 1000,
  GOLD: 5000,
  DIAMOND: 10000
};
