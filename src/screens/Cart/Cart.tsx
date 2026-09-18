import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Ionicons } from '@react-native-vector-icons/ionicons';
import { getProductById } from '../../services/productService';
import { CartProduct, Product } from '../../types';
import { styles } from './Cart.styles';
import { SCREEN_NAME, COLORS } from '../../constants';
import { useCart } from '../../hooks/useCart';

type Props = {
  navigation: any;
};

interface PopulatedCartItem {
  product: Product;
  quantity: number;
}

const Cart = ({ navigation }: Props) => {
  const { data: cart, isLoading, isError, error } = useCart(1);
  const [cartItems, setCartItems] = useState<PopulatedCartItem[]>([]);

  useEffect(() => {
    if (cart?.products && cart.products.length > 0) fetchCartDetails();
  }, [cart]);

  const fetchCartDetails = async () => {
    try {
      if (cart?.products && cart.products.length > 0) {
        const itemPromises = cart.products.map(
          async (item: CartProduct) => {
            const prodId = item.productId || item.id || 1;
            const productDetail = await getProductById(prodId);
            return {
              product: productDetail,
              quantity: item.quantity || 1,
            };
          },
        );

        const populatedItems = await Promise.all(itemPromises);
        setCartItems(populatedItems);
      } else {
        setCartItems([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch cart:', err);
    }
  };

  const calculateTotal = (): number => {
    return cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      `Proceeding with total payment of $${calculateTotal().toFixed(2)}`,
      [{ text: 'OK' }],
    );
  };

  const renderCartItem = ({ item }: { item: PopulatedCartItem }) => {
    return (
      <TouchableOpacity
        style={styles.cartItemCard}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate(SCREEN_NAME.PRODUCT_DETAILS, {
            productId: item.product.id,
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.product.image }}
            style={styles.productImage}
          />
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.categoryText}>
            {item.product.category?.toUpperCase()}
          </Text>
          <Text style={styles.titleText} numberOfLines={2}>
            {item.product.title}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>
              ${item.product.price?.toFixed(2)}
            </Text>
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading || cartItems.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading cart from API...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error?.message}</Text>
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
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>

        {cart && (
          <View style={styles.cartIdBadge}>
            <Text style={styles.cartIdText}>Cart #{cart.id}</Text>
          </View>
        )}
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={44} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse our products and add items to your shopping cart.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(SCREEN_NAME.HOME)}
          >
            <Text style={styles.exploreButtonText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.product.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Bottom Summary Bar */}
          <View style={styles.bottomSummaryBar}>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>
                Total ({cartItems.length} items)
              </Text>
              <Text style={styles.totalPrice}>
                ${calculateTotal().toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              activeOpacity={0.85}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default Cart;
