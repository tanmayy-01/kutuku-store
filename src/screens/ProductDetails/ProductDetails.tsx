import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useAppDispatch, useAppSelector, toggleWishlist } from '../../redux';
import ProductDetailsContent from '../../components/ProductDetailsContent';
import { styles } from './ProductDetails.styles';
import { SCREEN_NAME } from '../../constants/screenNames';
import { useSingleProduct } from '../../hooks/useSingleProduct';
import { useAddToCart } from '../../hooks/useAddToCart';

type Props = {
  navigation: any;
  route: any;
};

const ProductDetails = ({ navigation, route }: Props) => {
  const { productId } = route.params;
  const dispatch = useAppDispatch();
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useSingleProduct(productId);
  const { mutate, error: addToCartError } = useAddToCart();
  const wishlistItems = useAppSelector(state => state.wishlist.items);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  const isWishlisted = product
    ? wishlistItems.some(item => item.id === product.id)
    : false;

  const handleToggleWishlist = () => {
    if (product) {
      dispatch(toggleWishlist(product));
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;

    try {
      setIsAddingToCart(true);
      const cartPayload = {
        userId: 1,
        products: [
          {
            id: product.id,
            quantity: quantity,
          },
        ],
      };

      mutate(cartPayload, {
        onSuccess: data => {
          Alert.alert(
            'Success',
            `Added ${quantity} ${quantity === 1 ? 'item' : 'items'} of "${
              product.title
            }" to cart! (Response ID: ${data.id})`,
            [
              { text: 'Continue Shopping', style: 'cancel' },
              {
                text: 'View Cart',
                onPress: () => navigation.navigate(SCREEN_NAME.CART),
              },
            ],
          );
        },
        onError: () => {
          Alert.alert(
            'Error',
            addToCartError?.message ||
              'Failed to add product to cart. Please try again.',
          );
        },
      });
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5041BC" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error?.message || 'Product not found'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#1E202B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>

        {product && (
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerWishlistBtn}
              activeOpacity={0.7}
              onPress={handleToggleWishlist}
            >
              <Ionicons
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={22}
                color={isWishlisted ? '#E53935' : '#1E202B'}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ProductDetailsContent
        product={product}
        isWishlisted={isWishlisted}
        onToggleWishlist={handleToggleWishlist}
        quantity={quantity}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
};

export default ProductDetails;
