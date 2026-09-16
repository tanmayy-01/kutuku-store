export interface SlideItem {
  id: string;
  title: string;
  description: string;
  image: any;
}

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartProduct {
  id?: number;
  productId?: number;
  quantity?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AddToCartPayload {
  userId: number;
  products: {
    id: number;
    quantity?: number;
  }[];
  date?: string;
}

export interface CartResponse {
  id: number;
  userId: number;
  products: CartProduct[];
}
