import { useQuery } from '@tanstack/react-query';
import { getCartById } from '../services';

export const useCart = (id: number) =>
  useQuery({
    queryKey: ['carts'],
    queryFn: () => getCartById(id),
    staleTime: 5 * 60 * 1000,
  });
