import apiClient from './api';
import { API_ENDPOINTS } from '../constants/constants';
import { Product } from '../types';

/**
 * Fetch all products from Fake Store API
 */
export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS);
  return response.data;
};

/**
 * Fetch a single product by ID
 */
export const getProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
  return response.data;
};

