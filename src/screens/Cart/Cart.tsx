import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { getCartById } from '../../services/cartService';
import { getProductById } from '../../services/productService';
import { CartResponse, CartProduct, Product } from '../../types';
import { styles } from './Cart.styles';

type Props = {
  navigation: any;
};

interface PopulatedCartItem {
  product: Product;
  quantity: number;
}

const Cart = ({ navigation }: Props) => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [cartItems, setCartItems] = useState<PopulatedCartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const fetchCartDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const cartData = await getCartById(1);
      console.log('Single Cart API Response:', cartData);
      setCart(cartData);

      // Fetch product details for each item in the cart
      if (cartData?.products && cartData.products.length > 0) {
        const itemPromises = cartData.products.map(async (item: CartProduct) => {
          const prodId = item.productId || item.id || 1;
          const productDetail = await getProductById(prodId);
          return {
            product: productDetail,
            quantity: item.quantity || 1,
          };
        });

        const populatedItems = await Promise.all(itemPromises);
        setCartItems(populatedItems);
      } else {
        setCartItems([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch cart:', err);
      setError(err?.message || 'Unable to fetch cart details');
    } finally {
      setLoading(false);
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
      [{ text: 'OK' }]
    );
  };

  const renderCartItem = ({ item }: { item: PopulatedCartItem }) => {
    return (
      <TouchableOpacity
        style={styles.cartItemCard}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('ProductDetails', {
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
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>

        {cart && (
          <View style={styles.cartIdBadge}>
            <Text style={styles.cartIdText}>Cart #{cart.id}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5041BC" />
          <Text style={styles.loadingText}>Loading cart from API...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={fetchCartDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={44} color="#5041BC" />
          </View>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse our products and add items to your shopping cart.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Bottom Summary Bar */}
          <View style={styles.bottomSummaryBar}>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total ({cartItems.length} items)</Text>
              <Text style={styles.totalPrice}>${calculateTotal().toFixed(2)}</Text>
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
    </SafeAreaView>
  );
};

export default Cart;
