import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useAppDispatch, useAppSelector, toggleWishlist } from '../../redux';
import { getProductById } from '../../services/productService';
import { addToCartApi } from '../../services/cartService';
import { Product } from '../../types';
import ProductDetailsContent from '../../components/ProductDetailsContent';
import { styles } from './ProductDetails.styles';

type Props = {
  navigation: any;
  route: any;
};

const ProductDetails = ({ navigation, route }: Props) => {
  const { productId } = route.params;
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(productId);
      console.log('Product details data:', data);
      setProduct(data);
    } catch (err: any) {
      console.error('Failed to fetch product details:', err);
      setError(err?.message || 'Unable to load product details');
    } finally {
      setLoading(false);
    }
  };

  const isWishlisted = product
    ? wishlistItems.some((item) => item.id === product.id)
    : false;

  const handleToggleWishlist = () => {
    if (product) {
      dispatch(toggleWishlist(product));
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
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

      console.log('Sending Add to Cart API payload:', cartPayload);
      const response = await addToCartApi(cartPayload);
      console.log('Add to Cart API Response:', response);

      Alert.alert(
        'Success',
        `Added ${quantity} ${quantity === 1 ? 'item' : 'items'} of "${product.title}" to cart! (Response ID: ${response.id})`,
        [
          { text: 'Continue Shopping', style: 'cancel' },
          {
            text: 'View Cart',
            onPress: () => navigation.navigate('Cart'),
          },
        ]
      );
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      Alert.alert(
        'Error',
        err?.message || 'Failed to add product to cart. Please try again.'
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

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

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5041BC" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      ) : error || !product ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Product not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={fetchProductDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ProductDetailsContent
          product={product}
          isWishlisted={isWishlisted}
          onToggleWishlist={handleToggleWishlist}
          quantity={quantity}
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
          onAddToCart={handleAddToCart}
        />
      )}
    </SafeAreaView>
  );
};

export default ProductDetails;