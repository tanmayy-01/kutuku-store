export const API_BASE_URL = 'https://fakestoreapi.com';

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  CARTS: '/carts',
  CART_BY_ID: (id: number) => `/carts/${id}`,
};
