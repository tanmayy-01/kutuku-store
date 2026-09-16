import React, { use, useEffect, useState } from 'react';
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

type Props = {
  navigation: any;
};

const Home = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(state => state.wishlist.items);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilterdProducts] = useState(products);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();

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
    const updatedProductList = filteredProducts.filter(fp => fp.id != id);

    setFilterdProducts(updatedProductList);
    // console.log(updatedProductList)
  };
  const handleDeleteProduct = (id: number) => {
    //
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
    setOpenModel(true);
  };

  const handleWishlistHeaderPress = () => {
    navigation.navigate('Wishlist');
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleProductPress = (productId: number) => {
    navigation.navigate('ProductDetails', { productId });
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
        style={{
          flex: 1,

          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            // backgroundColor: 'pink',
            justifyContent: 'center',
            alignItems: 'center',
          
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
            }}
          >
            Edit Product.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent:'space-between',
              width:200,
              alignItems:'center'
            }}
          >
            <Text >Title: </Text>
            <TextInput
              value={selectedProduct?.title}
              style={{
                borderWidth: 1,
                margin: 10,
                color: '#000',
                borderRadius:10
              }}
              
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent:'space-between',
              width:200,
              alignItems:'center'
            }}
          >
            <Text style={{  }}>Title: </Text>
            <TextInput
              value={selectedProduct?.title}
              style={{
                borderWidth: 1,
                margin: 10,
                color: '#000',
                borderRadius:10
              }}
              
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent:'space-between',
              width:200,
              alignItems:'center'
            }}
          >
            <Text style={{  }}>Title: </Text>
            <TextInput
              value={selectedProduct?.title}
              style={{
                borderWidth: 1,
                margin: 10,
                color: '#000',
                borderRadius:10
              }}
              
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: 'blue',
              width: 200,
              height: 40,
              justifyContent: 'center',
              marginTop: 20,
              borderRadius: 10,
            }}
            onPress={() => setOpenModel(false)}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '400',
                textAlign: 'center',
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
