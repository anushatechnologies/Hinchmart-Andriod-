/**
 * HINCH MART — Wishlist & Saved Materials Screen
 */
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/feedback/SkeletonLoader';
import { formatPrice } from '../../../utils';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectWishlistItems, removeFromWishlist } from '../../../redux/slices/wishlistSlice';
import { addItem } from '../../../redux/slices/cartSlice';
import { SAMPLE_PRODUCTS } from '../../products/screens/ProductListScreen';

export function WishlistScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector(selectWishlistItems);

  // Match items with catalog
  const wishlistedProducts = SAMPLE_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const handleMoveToCart = (product: any) => {
    dispatch(
      addItem({
        id: `${product.id}_default`,
        productId: product.id,
        product,
        variantId: null,
        variant: null,
        quantity: product.minOrderQuantity || 1,
        unitPrice: product.price.amount,
        totalPrice: (product.price.amount) * (product.minOrderQuantity || 1),
        selected: true,
      })
    );
    dispatch(removeFromWishlist(product.id));
  };

  return (
    <Screen scrollable={false}>
      <Header
        title="My Wishlist"
        showBack
        onBackPress={() => navigation.goBack()}
        showCart
        onCartPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
      />

      {wishlistedProducts.length === 0 ? (
        <View style={styles.centerContainer}>
          <EmptyState
            title="Your Wishlist is Empty"
            subtitle="Explore construction products and save your favorite materials for quick procurement."
            actionTitle="Explore Materials"
            onAction={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
          />
        </View>
      ) : (
        <FlatList
          data={wishlistedProducts}
          contentContainerStyle={styles.listPadding}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
              variant="outlined"
              style={styles.card}
            >
              <View style={styles.cardRow}>
                <View style={styles.imgWrap}>
                  <Image source={{ uri: item.images[0]?.url }} style={styles.img} contentFit="cover" />
                </View>

                <View style={styles.infoWrap}>
                  <Text style={[styles.brand, { color: theme.colors.primary }]}>
                    {item.brand?.name || 'CONSTRUCTION'}
                  </Text>
                  <Text numberOfLines={2} style={[styles.name, { color: theme.colors.textPrimary }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.price, { color: theme.colors.navy }]}>
                    {formatPrice(item.price.amount, item.price.currency)} / {item.unit || 'Unit'}
                  </Text>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      onPress={() => handleMoveToCart(item)}
                      style={[styles.moveCartBtn, { backgroundColor: theme.colors.primary }]}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="cart-outline" size={15} color="#152238" />
                      <Text style={styles.moveCartText}>Move to Cart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => dispatch(removeFromWishlist(item.id))}
                      style={styles.trashBtn}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listPadding: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
  },
  imgWrap: {
    width: 85,
    height: 85,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  infoWrap: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  brand: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  name: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13.5,
    marginVertical: 2,
    lineHeight: 18,
  },
  price: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moveCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  moveCartText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#152238',
  },
  trashBtn: {
    padding: 6,
  },
});
