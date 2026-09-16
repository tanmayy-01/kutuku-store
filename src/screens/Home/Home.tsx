import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { getProducts } from '../../services/productService';
import { Product } from '../../types';
import { styles } from './Home.styles';

type Props = {
  navigation: any;
};

const Home = ({ navigation }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(2);
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
   
    
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      console.log('Fetched products data:', data);
      setProducts(data);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError(err?.message || 'Something went wrong while fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleCartPress = () => {
    console.log('Cart icon pressed');
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const isAlreadyInWishlist = prev.includes(productId);
      if (isAlreadyInWishlist) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isWishlisted = wishlist.includes(item.id);

    return (
      <View style={styles.productCard}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          
          {/* Add to Wishlist Button */}
          <TouchableOpacity
            style={styles.wishlistButton}
            activeOpacity={0.7}
            onPress={() => toggleWishlist(item.id)}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={18}
              color={isWishlisted ? '#E53935' : '#8A8FA3'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>{item.category.toUpperCase()}</Text>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {item.rating?.rate}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Ionicons Cart Icon */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerSubtitle}>Discover</Text>
          <Text style={styles.headerTitle}>Latest Products</Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          activeOpacity={0.7}
          onPress={handleCartPress}
        >
          <Ionicons name="cart-outline" size={24} color="#1E202B" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5041BC" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
