import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services';

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
  });
