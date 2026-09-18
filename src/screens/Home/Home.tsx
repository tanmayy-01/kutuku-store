import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useAppDispatch, useAppSelector, toggleWishlist } from '../../redux';
import { getProducts } from '../../services/productService';
import { Product } from '../../types';
import { styles } from './Home.styles';
import { SCREEN_NAME } from '../../constants/screenNames';

type Props = {
  navigation: any;
};

const Home = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(state => state.wishlist.items);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilterdProducts] = useState<Product[]>([]);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');

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
      setFilterdProducts(data);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError(err?.message || 'Something went wrong while fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
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
              color={isWishlisted ? '#E53935' : '#8A8FA3'}
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

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              onPress={() => handleDeleteProduct(item.id)}
              style={{ marginTop: 10 }}
            >
              <Ionicons
                name={'bag-remove-outline'}
                size={25}
                color={'#E53935'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleEditProduct(item)}
              style={{ marginTop: 10 }}
            >
              <Ionicons name={'pencil'} size={25} color={'green'} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

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
              color={wishlistItems.length > 0 ? '#E53935' : '#1E202B'}
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
            <Ionicons name="cart-outline" size={23} color="#1E202B" />
          </TouchableOpacity>
        </View>
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
        <>
          <TextInput
            style={{
              width: '80%',
              height: 40,
              borderWidth: 1,
              margin: 25,
              borderRadius: 10,
              paddingHorizontal: 5,
              color: '#000',
            }}
            placeholder="Search Products.."
            placeholderTextColor={'#000'}
            onChangeText={handleSearch}
          />

          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '200',
                textAlign: 'center',
              }}
            >
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
      )}

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
                <Ionicons name="close" size={24} color="#8A8FA3" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Product title"
                placeholderTextColor="#A0A5BD"
                style={styles.inputField}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                value={editDesc}
                onChangeText={setEditDesc}
                placeholder="Product description"
                placeholderTextColor="#A0A5BD"
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
                placeholderTextColor="#A0A5BD"
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
    </SafeAreaView>
  );
};

export default Home;
