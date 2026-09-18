import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useAppDispatch, useAppSelector, toggleWishlist } from '../../redux';
import { Product } from '../../types';
import { styles } from './Home.styles';
import { SCREEN_NAME, COLORS } from '../../constants';
import { useProducts } from '../../hooks/useProducts';

type Props = {
  navigation: any;
};

const Home = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { data: productsData = [], isLoading, isError, error } = useProducts();
  const wishlistItems = useAppSelector(state => state.wishlist.items);

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilterdProducts] = useState<Product[]>([]);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    if (!isLoading && productsData) {
      setProducts(productsData);
      setFilterdProducts(productsData);
    }
  }, [productsData, isLoading]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilterdProducts(products);
      return;
    }

    const filtered = products.filter(
      product =>
        product.title.toLowerCase().includes(text.toLowerCase()) ||
        product.description
          .toLocaleLowerCase()
          .includes(text.toLocaleLowerCase()),
    );

    setFilterdProducts(filtered);
  };

  const handleDelete = (id: number) => {
    console.log('ID:', id);
    setProducts(prev => prev.filter(fp => fp.id !== id));
    setFilterdProducts(prev => prev.filter(fp => fp.id !== id));
  };

  const handleDeleteProduct = (id: number) => {
    Alert.alert('Delete Product', 'Are you sure you want to remove product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDelete(id),
      },
    ]);
  };

  const handleEditProduct = (item: Product) => {
    setSelectedProduct(item);
    setEditTitle(item.title);
    setEditDesc(item.description);
    setEditPrice(item.price.toString());
    setOpenModel(true);
  };

  const handleSaveEdit = () => {
    if (!selectedProduct) return;

    if (!editTitle.trim()) {
      Alert.alert('Validation Error', 'Product title cannot be empty.');
      return;
    }

    const parsedPrice = parseFloat(editPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Validation Error', 'Please enter a valid price.');
      return;
    }

    const updatedProduct: Product = {
      ...selectedProduct,
      title: editTitle.trim(),
      description: editDesc.trim(),
      price: parsedPrice,
    };

    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === selectedProduct.id ? updatedProduct : p)),
    );
    setFilterdProducts(prevFiltered =>
      prevFiltered.map(p => (p.id === selectedProduct.id ? updatedProduct : p)),
    );

    setOpenModel(false);
    setSelectedProduct(null);
  };

  const handleWishlistHeaderPress = () => {
    navigation.navigate(SCREEN_NAME.WISHLIST);
  };

  const handleCartPress = () => {
    navigation.navigate(SCREEN_NAME.CART);
  };

  const handleProductPress = (productId: number) => {
    navigation.navigate(SCREEN_NAME.PRODUCT_DETAILS, { productId });
  };

  const handleToggleWishlist = (product: Product) => {
    dispatch(toggleWishlist(product));
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isWishlisted = wishlistItems.some(
      wishlistItem => wishlistItem.id === item.id,
    );

    return (
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.88}
        onPress={() => handleProductPress(item.id)}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />

          {/* Wishlist Button on Product */}
          <TouchableOpacity
            style={styles.wishlistButton}
            activeOpacity={0.7}
            onPress={() => handleToggleWishlist(item)}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={18}
              color={isWishlisted ? COLORS.error : COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>
            {item.category.toUpperCase()}
          </Text>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {item.rating?.rate}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={() => handleDeleteProduct(item.id)}
              style={{ marginTop: 10 }}
            >
              <Ionicons
                name={'bag-remove-outline'}
                size={25}
                color={COLORS.error}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleEditProduct(item)}
              style={{ marginTop: 10 }}
            >
              <Ionicons name={'pencil'} size={25} color={COLORS.success} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading || (filteredProducts.length <= 0 && searchText.length <= 0)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>{error?.message || 'Error while Fetching Product List'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header with Wishlist and Cart Icons */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerSubtitle}>Discover</Text>
          <Text style={styles.headerTitle}>Latest Products</Text>
        </View>

        <View style={styles.headerActions}>
          {/* Wishlist Button in Header */}
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={handleWishlistHeaderPress}
          >
            <Ionicons
              name={wishlistItems.length > 0 ? 'heart' : 'heart-outline'}
              size={22}
              color={wishlistItems.length > 0 ? COLORS.error : COLORS.textPrimary}
            />
            {wishlistItems.length > 0 && (
              <View style={[styles.badge, styles.wishlistBadge]}>
                <Text style={styles.badgeText}>{wishlistItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Cart Button in Header */}
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={handleCartPress}
          >
            <Ionicons name="cart-outline" size={23} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Products.."
          placeholderTextColor={COLORS.textPrimary}
          onChangeText={handleSearch}
          value={searchText}
        />

        <View>
          <Text style={styles.countText}>
            Count: {filteredProducts.length}
          </Text>
        </View>
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      </>

      <Modal
        visible={openModel}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOpenModel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Product</Text>
              <TouchableOpacity
                onPress={() => setOpenModel(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Product title"
                placeholderTextColor={COLORS.placeholder}
                style={styles.inputField}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                value={editDesc}
                onChangeText={setEditDesc}
                placeholder="Product description"
                placeholderTextColor={COLORS.placeholder}
                multiline
                numberOfLines={3}
                style={[styles.inputField, styles.inputFieldMultiline]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price ($)</Text>
              <TextInput
                value={editPrice}
                onChangeText={setEditPrice}
                placeholder="0.00"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="decimal-pad"
                style={styles.inputField}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setOpenModel(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveEdit}
                activeOpacity={0.85}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;
