import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../services';

export const useSingleProduct = (id: number) =>
  useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(id),
  });
