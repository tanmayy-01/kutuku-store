import apiClient from './api';
import { API_ENDPOINTS } from '../constants/constants';
import { AddToCartPayload, CartResponse } from '../types';


export const addToCartApi = async (
  payload: AddToCartPayload
): Promise<CartResponse> => {
  const response = await apiClient.post<CartResponse>(
    API_ENDPOINTS.CARTS,
    payload
  );
  return response.data;
};


export const getCartById = async (cartId: number = 1): Promise<CartResponse> => {
  const response = await apiClient.get<CartResponse>(
    API_ENDPOINTS.CART_BY_ID(cartId)
  );
  return response.data;
};
