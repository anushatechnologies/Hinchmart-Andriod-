/**
 * HINCH MART — Premium ProductCard Component
 * Enhanced with Ionicon hearts, gradient cart button, save tags, and verified brand badges
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { Product } from '../../types/product.types';
import { formatPrice } from '../../utils';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Rating } from '../ui/Rating';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleWishlist, selectIsWishlisted } from '../../redux/slices/wishlistSlice';
import { addItem } from '../../redux/slices/cartSlice';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface ProductCardProps {
  product: Product;
  onPress: () => void;
  variant?: 'grid' | 'list';
  style?: ViewStyle;
}

export function ProductCard({
  product,
  onPress,
  variant = 'grid',
  style,
}: ProductCardProps) {
  const { theme, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsWishlisted(product.id));
  const heartScale = useSharedValue(1);
  const cartScale = useSharedValue(1);

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ?? product.images[0]?.url;

  const handleWishlistToggle = () => {
    heartScale.value = withSpring(0.7, { damping: 8 }, () => {
      heartScale.value = withSpring(1, { damping: 12 });
    });
    dispatch(toggleWishlist(product.id));
  };

  const handleAddToCart = () => {
    cartScale.value = withSpring(0.8, { damping: 8 }, () => {
      cartScale.value = withSpring(1, { damping: 12 });
    });
    dispatch(
      addItem({
        id: `${product.id}_default`,
        productId: product.id,
        product,
        variantId: null,
        variant: null,
        quantity: 1,
        unitPrice: product.price.amount,
        totalPrice: product.price.amount,
      })
    );
  };

  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const cartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartScale.value }],
  }));

  if (variant === 'list') {
    return (
      <Card onPress={onPress} variant="outlined" style={[styles.listCard, style]}>
        <View style={styles.listImageWrapper}>
          <Image source={{ uri: primaryImage }} style={styles.listImage} contentFit="cover" />
          {product.price.discount && (
            <Badge
              label={`-${product.price.discount}%`}
              variant="danger"
              size="sm"
              style={styles.discountBadge}
            />
          )}
        </View>

        <View style={styles.listDetails}>
          <View style={styles.brandRow}>
            <Text style={[styles.brandText, { color: theme.colors.textTertiary }]}>
              {product.brand.name}
            </Text>
            {product.brand.isVerified && (
              <Ionicons name="checkmark-circle" size={12} color={theme.colors.info} style={{ marginLeft: 3 }} />
            )}
          </View>
          <Text
            numberOfLines={2}
            style={[styles.productName, { color: theme.colors.textPrimary }]}
          >
            {product.name}
          </Text>

          <Rating rating={product.rating.average} count={product.reviewCount} showCount size={12} />

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.colors.navy }]}>
              {formatPrice(product.price.amount, product.price.currency)}
            </Text>
            {product.price.compareAtPrice && (
              <Text style={[styles.comparePrice, { color: theme.colors.textDisabled }]}>
                {formatPrice(product.price.compareAtPrice, product.price.currency)}
              </Text>
            )}
            <Text style={[styles.unitText, { color: theme.colors.textTertiary }]}>
              / {product.unit}
            </Text>
          </View>
        </View>

        <AnimatedTouchable onPress={handleWishlistToggle} style={[styles.wishlistBtnList, heartAnimStyle]}>
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={isWishlisted ? '#EF4444' : theme.colors.textTertiary}
          />
        </AnimatedTouchable>
      </Card>
    );
  }

  return (
    <Card onPress={onPress} variant="outlined" style={[styles.gridCard, style]}>
      <View style={styles.gridImageWrapper}>
        <Image source={{ uri: primaryImage }} style={styles.gridImage} contentFit="cover" />

        {/* Bottom gradient overlay for image */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.06)']}
          style={styles.imageGradient}
        />

        {product.price.discount && (
          <View style={styles.discountTagWrap}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.discountTag}
            >
              <Text style={styles.discountTagText}>-{product.price.discount}%</Text>
            </LinearGradient>
          </View>
        )}

        <AnimatedTouchable
          onPress={handleWishlistToggle}
          style={[
            styles.wishlistBtnGrid,
            heartAnimStyle,
            {
              backgroundColor: isDark ? 'rgba(22, 27, 34, 0.85)' : 'rgba(255, 255, 255, 0.92)',
              ...(Platform.OS === 'ios'
                ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }
                : { elevation: 2 }),
            },
          ]}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={16}
            color={isWishlisted ? '#EF4444' : theme.colors.textSecondary}
          />
        </AnimatedTouchable>
      </View>

      <View style={styles.gridContent}>
        <View style={styles.brandRow}>
          <Text style={[styles.brandText, { color: theme.colors.textTertiary }]}>
            {product.brand.name}
          </Text>
          {product.brand.isVerified && (
            <Ionicons name="checkmark-circle" size={11} color={theme.colors.info} style={{ marginLeft: 3 }} />
          )}
        </View>
        <Text
          numberOfLines={2}
          style={[styles.productNameGrid, { color: theme.colors.textPrimary }]}
        >
          {product.name}
        </Text>

        <Rating rating={product.rating.average} count={product.reviewCount} showCount size={11} />

        {/* Save tag or B2B volume discount chip */}
        {product.price.discount ? (
          <View style={[styles.saveTag, { backgroundColor: `${theme.colors.success}14` }]}>
            <Ionicons name="pricetag" size={10} color={theme.colors.success} />
            <Text style={[styles.saveTagText, { color: theme.colors.success }]}>
              Save {formatPrice(product.price.compareAtPrice! - product.price.amount, product.price.currency)}
            </Text>
          </View>
        ) : (
          <View style={[styles.saveTag, { backgroundColor: `${theme.colors.primary}18` }]}>
            <Ionicons name="cube-outline" size={10} color={theme.colors.navy} />
            <Text style={[styles.saveTagText, { color: theme.colors.navy }]}>
              MOQ: {product.minOrderQuantity || 1} {product.unit || 'Unit'}
            </Text>
          </View>
        )}

        <View style={styles.gridPriceRow}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={[styles.priceGrid, { color: theme.colors.navy }]}>
                {formatPrice(product.price.amount, product.price.currency)}
              </Text>
              <Text style={[styles.unitSub, { color: theme.colors.textTertiary }]}>
                {' '}/ {product.unit || 'Ton'}
              </Text>
            </View>
            {product.price.compareAtPrice && (
              <Text style={[styles.comparePrice, { color: theme.colors.textDisabled }]}>
                {formatPrice(product.price.compareAtPrice, product.price.currency)}
              </Text>
            )}
          </View>

          <AnimatedTouchable
            onPress={handleAddToCart}
            style={cartAnimStyle}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.primary, '#F9A825']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addCartBtn}
            >
              <Ionicons name="bag-add" size={16} color={theme.colors.navy} />
            </LinearGradient>
          </AnimatedTouchable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    width: '48%',
    marginBottom: 16,
    padding: 8,
    borderRadius: 16,
  },
  gridImageWrapper: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F3F5',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
  },
  discountTagWrap: {
    position: 'absolute',
    top: 8,
    left: 0,
  },
  discountTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  discountTagText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  wishlistBtnGrid: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContent: {
    marginTop: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  productNameGrid: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 4,
    height: 36,
  },
  saveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    gap: 3,
  },
  saveTagText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
  },
  gridPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceGrid: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },
  unitSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
  },
  comparePrice: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  addCartBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // List Layout
  listCard: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 10,
    borderRadius: 16,
    width: '100%',
  },
  listImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    lineHeight: 19,
    marginVertical: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    marginRight: 6,
  },
  unitText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  wishlistBtnList: {
    padding: 6,
  },
});
