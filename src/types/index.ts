export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  categoryId: number;
  imageUrl: string;
  featured: boolean;
  stock_quantity: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  order: number;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
}