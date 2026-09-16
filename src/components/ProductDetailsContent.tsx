import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Product } from '../types';

const { height } = Dimensions.get('window');

interface ProductDetailsContentProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  quantity: number;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onAddToCart: () => void;
}

export const ProductDetailsContent: React.FC<ProductDetailsContentProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddToCart,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Image Section */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
          />
          {/* Wishlist Heart Button */}
          <TouchableOpacity
            style={styles.wishlistFloatingBtn}
            activeOpacity={0.7}
            onPress={onToggleWishlist}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={22}
              color={isWishlisted ? '#E53935' : '#1E202B'}
            />
          </TouchableOpacity>
        </View>

        {/* Product Details Section */}
        <View style={styles.infoSection}>
          <View style={styles.categoryRatingRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {product.category?.toUpperCase()}
              </Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {product.rating?.rate} ({product.rating?.count} reviews)
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>${product.price?.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[
              styles.quantityBtn,
              quantity <= 1 && styles.quantityBtnDisabled,
            ]}
            onPress={onDecreaseQuantity}
            disabled={quantity <= 1}
            activeOpacity={0.7}
          >
            <Ionicons
              name="remove"
              size={18}
              color={quantity <= 1 ? '#C4C4D0' : '#1E202B'}
            />
          </TouchableOpacity>

          <Text style={styles.quantityValue}>{quantity}</Text>

          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={onIncreaseQuantity}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={18} color="#1E202B" />
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartBtn}
          activeOpacity={0.85}
          onPress={onAddToCart}
        >
          <Ionicons name="cart" size={20} color="#FFFFFF" style={styles.cartIcon} />
          <Text style={styles.addToCartText}>
            Add to Cart • ${(product.price * quantity).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageCard: {
    width: '100%',
    height: height * 0.4,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
  },
  productImage: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  wishlistFloatingBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  categoryRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryText: {
    color: '#5041BC',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
    marginLeft: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E202B',
    lineHeight: 28,
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#8A8FA3',
    marginRight: 8,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#5041BC',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEE',
    marginVertical: 14,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E202B',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#F0EFF5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F9',
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginRight: 14,
  },
  quantityBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityBtnDisabled: {
    backgroundColor: '#F5F5F9',
    elevation: 0,
    shadowOpacity: 0,
  },
  quantityValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E202B',
    paddingHorizontal: 12,
  },
  addToCartBtn: {
    flex: 1,
    height: 52,
    backgroundColor: '#5041BC',
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5041BC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ProductDetailsContent;
