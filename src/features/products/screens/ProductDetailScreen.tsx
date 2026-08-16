/**
 * HINCH MART — Product Detail Screen
 * Full specifications, image gallery, rating distribution, vendor profile, buy now & add-to-cart
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Badge } from '../../../components/ui/Badge';
import { Rating } from '../../../components/ui/Rating';
import { Stepper } from '../../../components/ui/Rating';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { formatPrice } from '../../../utils';
import { useAppDispatch } from '../../../redux/hooks';
import { addItem } from '../../../redux/slices/cartSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEMO_PRODUCT = {
  id: 'p1',
  name: 'Grade 50 High-Yield Steel Rebar 12mm',
  sku: 'ST-12MM-50',
  description:
    'High tensile strength steel rebar ideal for reinforced concrete foundations, slabs, and structural pillars. Manufactured according to ASTM A615 Grade 60 / BS 4449 standards.',
  images: [
    'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
  ],
  price: 850,
  comparePrice: 950,
  unit: 'Ton',
  minQty: 5,
  brand: 'Tata Tiscon',
  vendor: { name: 'Global Metals Co', location: 'Dubai, UAE', rating: 4.9, verified: true },
  rating: 4.8,
  reviewCount: 124,
  specs: [
    { label: 'Material Grade', value: 'Fe 500D / Grade 50' },
    { label: 'Diameter', value: '12 mm' },
    { label: 'Standard Length', value: '12 Meters' },
    { label: 'Yield Strength', value: '500 N/mm²' },
    { label: 'Elongation', value: '16%' },
    { label: 'Certification', value: 'ISO 9001 / LEED Compliant' },
  ],
};

export function ProductDetailScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: `${DEMO_PRODUCT.id}_default`,
        productId: DEMO_PRODUCT.id,
        product: DEMO_PRODUCT as any,
        variantId: null,
        variant: null,
        quantity,
        unitPrice: DEMO_PRODUCT.price,
        totalPrice: DEMO_PRODUCT.price * quantity,
      })
    );
  };

  return (
    <Screen scrollable>
      <Header
        title="Product Details"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Main Image Gallery */}
      <View style={styles.imageGalleryWrapper}>
        <Image
          source={{ uri: DEMO_PRODUCT.images[selectedImgIndex] }}
          style={styles.mainImage}
          contentFit="cover"
        />
        <Badge label="-11% OFF" variant="danger" style={styles.discountBadge} />
      </View>

      {/* Thumbnail Selector */}
      <View style={styles.thumbRow}>
        {DEMO_PRODUCT.images.map((url, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedImgIndex(idx)}
            style={[
              styles.thumbBtn,
              selectedImgIndex === idx && { borderColor: theme.colors.primary, borderWidth: 2 },
            ]}
          >
            <Image source={{ uri: url }} style={styles.thumbImg} contentFit="cover" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Info */}
      <View style={styles.contentPadding}>
        <Text style={[styles.brandLabel, { color: theme.colors.primary }]}>{DEMO_PRODUCT.brand}</Text>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{DEMO_PRODUCT.name}</Text>

        <View style={styles.ratingRow}>
          <Rating rating={DEMO_PRODUCT.rating} count={DEMO_PRODUCT.reviewCount} showCount size={14} />
          <Text style={[styles.skuText, { color: theme.colors.textTertiary }]}>SKU: {DEMO_PRODUCT.sku}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.colors.navy }]}>
            {formatPrice(DEMO_PRODUCT.price)}
          </Text>
          <Text style={[styles.comparePrice, { color: theme.colors.textDisabled }]}>
            {formatPrice(DEMO_PRODUCT.comparePrice)}
          </Text>
          <Text style={[styles.unitText, { color: theme.colors.textTertiary }]}>/ {DEMO_PRODUCT.unit}</Text>
        </View>

        {/* Quantity Stepper */}
        <View style={styles.qtyRow}>
          <Text style={[styles.qtyLabel, { color: theme.colors.textPrimary }]}>Quantity ({DEMO_PRODUCT.unit}s):</Text>
          <Stepper value={quantity} onValueChange={setQuantity} min={DEMO_PRODUCT.minQty} />
        </View>

        {/* Vendor Box */}
        <Card variant="outlined" style={styles.vendorCard}>
          <View style={styles.vendorHeader}>
            <View style={[styles.vendorAvatar, { backgroundColor: theme.colors.primaryLight }]}>
              <Text style={{ fontSize: 20 }}>🏬</Text>
            </View>
            <View style={styles.vendorInfo}>
              <Text style={[styles.vendorName, { color: theme.colors.textPrimary }]}>
                {DEMO_PRODUCT.vendor.name}
              </Text>
              <Text style={[styles.vendorSub, { color: theme.colors.textTertiary }]}>
                📍 {DEMO_PRODUCT.vendor.location}
              </Text>
            </View>
            <Badge label="Verified Vendor" variant="success" size="sm" />
          </View>
        </Card>

        {/* Specifications Table */}
        <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>Technical Specifications</Text>
        <View style={[styles.specTable, { borderColor: theme.colors.border }]}>
          {DEMO_PRODUCT.specs.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.specRow,
                idx % 2 === 0 && { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>{item.label}</Text>
              <Text style={[styles.specValue, { color: theme.colors.textPrimary }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Button
            title="Add to Cart"
            onPress={handleAddToCart}
            variant="outline"
            size="lg"
            style={styles.flexBtn}
          />
          <Button
            title="Buy Now"
            onPress={() => {
              handleAddToCart();
              navigation.navigate('CheckoutAddress');
            }}
            variant="primary"
            size="lg"
            style={styles.flexBtn}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imageGalleryWrapper: {
    width: SCREEN_WIDTH,
    height: 280,
    position: 'relative',
    backgroundColor: '#F1F3F5',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  thumbRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  thumbBtn: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  contentPadding: {
    padding: 16,
  },
  brandLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    lineHeight: 26,
    marginVertical: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  skuText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 26,
    marginRight: 8,
  },
  comparePrice: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  unitText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  qtyLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  vendorCard: {
    marginVertical: 16,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vendorName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  vendorSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    marginTop: 16,
    marginBottom: 10,
  },
  specTable: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  specLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  specValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  flexBtn: {
    width: '48%',
  },
});
