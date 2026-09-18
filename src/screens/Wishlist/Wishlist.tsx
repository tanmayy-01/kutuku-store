import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
  useAppDispatch,
  useAppSelector,
  removeFromWishlist,
  clearWishlist,
} from '../../redux';
import { Product } from '../../types';
import { styles } from './Wishlist.styles';
import { SCREEN_NAME } from '../../constants/screenNames';

type Props = {
  navigation: any;
};

const Wishlist = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromWishlist(id));
  };

  const handleProductPress = (productId: number) => {
    navigation.navigate(SCREEN_NAME.PRODUCT_DETAILS, { productId });
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Wishlist',
      'Are you sure you want to remove all products from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => dispatch(clearWishlist()),
        },
      ]
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.88}
        onPress={() => handleProductPress(item.id)}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />

          {/* Remove from Wishlist Button */}
          <TouchableOpacity
            style={styles.removeButton}
            activeOpacity={0.7}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Ionicons name="heart" size={18} color="#E53935" />
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Clear All */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#1E202B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Wishlist</Text>
        </View>

        {wishlistItems.length > 0 && (
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.clearAllButton}
              activeOpacity={0.7}
              onPress={handleClearAll}
            >
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={44} color="#5041BC" />
          </View>
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Explore our latest collections and save your favorite items by tapping the heart icon.
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
        <FlatList
          data={wishlistItems}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </View>
  );
};

export default Wishlist;
