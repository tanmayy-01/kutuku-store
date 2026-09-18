import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCartApi } from '../services';
import { AddToCartPayload } from '../types';

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCartApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
