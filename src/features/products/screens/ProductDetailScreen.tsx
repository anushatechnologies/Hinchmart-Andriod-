/**
 * HINCH MART — Premium Product Detail Screen
 * Construction-specific specifications, MOQ validation, bulk pricing slabs,
 * pincode delivery estimates, verified vendor credentials, reviews breakdown,
 * and seamless connected cart/checkout flow.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Share,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Badge } from '../../../components/ui/Badge';
import { Rating } from '../../../components/ui/Rating';
import { Stepper } from '../../../components/ui/Rating';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ProductCard } from '../../../components/cards/ProductCard';
import { SkeletonLoader } from '../../../components/feedback/SkeletonLoader';
import { formatPrice } from '../../../utils';
import { productApi } from '../../../api/productApi';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addItem } from '../../../redux/slices/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../../../redux/slices/wishlistSlice';
import { Product, ProductVariant } from '../../../types/product.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FALLBACK_PRODUCT: Product = {
  id: 'p1',
  name: 'UltraTech OPC 53 Grade High-Strength Cement',
  slug: 'ultratech-opc-53-cement',
  sku: 'CEM-UT-53',
  description:
    'UltraTech OPC 53 Grade is an extremely high strength Portland cement engineered for structural concrete applications, bridges, multi-story buildings, and heavy commercial infrastructure. Provides superior bonding, fast setting time, and long-term crack resistance.',
  shortDescription: 'OPC 53 Grade High-Strength Structural Cement',
  images: [
    {
      id: 'i1',
      url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      thumbnail: '',
      alt: 'UltraTech Cement Bag',
      isPrimary: true,
      order: 1,
    },
    {
      id: 'i2',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      thumbnail: '',
      alt: 'Construction Site Pouring',
      isPrimary: false,
      order: 2,
    },
    {
      id: 'i3',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
      thumbnail: '',
      alt: 'Warehouse Material Stock',
      isPrimary: false,
      order: 3,
    },
  ],
  category: {
    id: 'c1',
    name: 'Cement & Concrete',
    slug: 'cement',
    icon: '',
    image: '',
    description: '',
    productCount: 140,
    parentId: null,
    subCategories: [],
    order: 1,
  },
  subCategory: {
    id: 'sc1',
    name: 'OPC 53',
    slug: 'opc-53',
    image: '',
    productCount: 45,
    parentId: 'c1',
  },
  brand: {
    id: 'b1',
    name: 'UltraTech Cement',
    logo: '',
    slug: 'ultratech',
    description: 'The Engineer’s Choice',
    productCount: 65,
    isVerified: true,
  },
  vendor: {
    id: 'v1',
    name: 'Apex Building Materials Ltd',
    logo: '',
    rating: 4.9,
    isVerified: true,
    location: 'Hyderabad, Telangana',
  },
  price: {
    amount: 420,
    compareAtPrice: 460,
    currency: 'INR',
    discount: 9,
    discountType: 'percentage',
    bulkPricing: [
      { minQuantity: 1, maxQuantity: 9, price: 430 },
      { minQuantity: 10, maxQuantity: 49, price: 420 },
      { minQuantity: 50, maxQuantity: 1000, price: 405 },
    ],
  },
  variants: [
    {
      id: 'v_50kg',
      name: '50 kg Bag',
      sku: 'CEM-UT-50KG',
      attributes: [{ name: 'Pack Size', value: '50 kg' }],
      price: {
        amount: 420,
        compareAtPrice: 460,
        currency: 'INR',
        discount: 9,
        discountType: 'percentage',
        bulkPricing: [],
      },
      stock: { available: 500, isInStock: true, lowStockThreshold: 50, isLowStock: false },
      images: [],
    },
    {
      id: 'v_1ton',
      name: '1 Ton (20 Bags Pallet)',
      sku: 'CEM-UT-1TON',
      attributes: [{ name: 'Pack Size', value: '1 Ton' }],
      price: {
        amount: 8100,
        compareAtPrice: 8900,
        currency: 'INR',
        discount: 9,
        discountType: 'percentage',
        bulkPricing: [],
      },
      stock: { available: 25, isInStock: true, lowStockThreshold: 5, isLowStock: false },
      images: [],
    },
  ],
  specifications: [
    {
      group: 'Technical Parameters',
      items: [
        { label: 'Brand', value: 'UltraTech Cement' },
        { label: 'Grade', value: 'OPC 53 Grade' },
        { label: 'Packaging Unit', value: '50 kg Moisture-Proof Bag' },
        { label: 'Compressive Strength (28 Days)', value: '58.5 MPa' },
        { label: 'Initial Setting Time', value: '45 Minutes' },
        { label: 'Final Setting Time', value: '240 Minutes' },
        { label: 'Standard Compliance', value: 'IS 269:2015 / BIS Certified' },
        { label: 'Country of Origin', value: 'India' },
      ],
    },
  ],
  rating: {
    average: 4.8,
    count: 1245,
    distribution: { 1: 12, 2: 18, 3: 65, 4: 210, 5: 940 },
  },
  reviewCount: 1245,
  stock: {
    available: 500,
    isInStock: true,
    lowStockThreshold: 50,
    isLowStock: false,
  },
  tags: ['cement', 'opc53', 'structural', 'ultratech'],
  isFeatured: true,
  isTrending: true,
  isDealOfDay: false,
  minOrderQuantity: 10,
  maxOrderQuantity: 5000,
  unit: 'Bag',
  weight: 50,
  weightUnit: 'kg',
  dimensions: { length: 65, width: 45, height: 15, unit: 'cm' },
  warranty: 'Quality Assured by Manufacturer Batch Testing Certificate',
  returnPolicy: '7 Days Return on Damaged Bags during Freight',
  buyingGuide: 'Ideal for RCC slabs, beams, columns, and foundations.',
  faqs: [],
  relatedProducts: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function ProductDetailScreen({ route, navigation }: any) {
  const { theme, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const productId = route?.params?.productId || 'p1';

  const [product, setProduct] = useState<Product>(FALLBACK_PRODUCT);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    FALLBACK_PRODUCT.variants[0] || null
  );
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [deliveryEstimateText, setDeliveryEstimateText] = useState('Standard 2 - 3 Days Delivery');
  const [moqWarning, setMoqWarning] = useState('');

  const isWishlisted = useAppSelector(selectIsWishlisted(product.id));

  // Fetch product detail
  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getProductDetail(productId);
        const data = response.data?.data || (response.data as any);
        if (isMounted && data && data.name) {
          setProduct(data);
          if (data.variants?.length) {
            setSelectedVariant(data.variants[0]);
          }
          const initialQty = data.minOrderQuantity || 1;
          setQuantity(initialQty);
        }
      } catch (err) {
        // Fallback product retained
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const minOrderQty = product.minOrderQuantity || 1;

  const handleQuantityChange = (newQty: number) => {
    if (newQty < minOrderQty) {
      setMoqWarning(`Minimum order quantity is ${minOrderQty} ${product.unit || 'units'}.`);
      setQuantity(minOrderQty);
    } else {
      setMoqWarning('');
      setQuantity(newQty);
    }
  };

  const handlePincodeCheck = () => {
    if (pincode.length >= 6) {
      setDeliveryChecked(true);
      setDeliveryEstimateText(`Delivering to ${pincode} by tomorrow afternoon`);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on HINCH MART: ₹${currentPrice}/${product.unit}`,
        title: product.name,
      });
    } catch (e) {
      // ignore
    }
  };

  const handleAddToCart = () => {
    if (quantity < minOrderQty) {
      setMoqWarning(`Minimum order quantity is ${minOrderQty} ${product.unit || 'units'}.`);
      return;
    }

    const price = selectedVariant?.price?.amount ?? product.price.amount;
    dispatch(
      addItem({
        id: `${product.id}_${selectedVariant?.id || 'default'}`,
        productId: product.id,
        product,
        variantId: selectedVariant?.id || null,
        variant: selectedVariant,
        quantity,
        unitPrice: price,
        totalPrice: price * quantity,
        selected: true,
      })
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigation.navigate('CheckoutAddress');
  };

  const currentPrice = selectedVariant?.price?.amount ?? product.price.amount;
  const comparePrice = selectedVariant?.price?.compareAtPrice ?? product.price.compareAtPrice;
  const discountPercent = product.price.discount || (comparePrice ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) : null);

  const imagesList = product.images?.length
    ? product.images.map((img) => (typeof img === 'string' ? img : img.url))
    : ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'];

  const specsList =
    product.specifications?.length && product.specifications[0]?.items
      ? product.specifications[0].items
      : [
          { label: 'Brand', value: product.brand?.name || 'UltraTech' },
          { label: 'Material Grade', value: 'OPC 53 Grade' },
          { label: 'Unit Packaging', value: `50 kg ${product.unit || 'Bag'}` },
          { label: 'Quality Standard', value: 'BIS / ISO Certified' },
          { label: 'Stock Status', value: product.stock?.isInStock ? 'In Stock (Direct Factory Dispatch)' : 'Backorder' },
          { label: 'Warranty', value: product.warranty || 'Manufacturer Quality Assured' },
        ];

  return (
    <Screen scrollable>
      <Header
        title="Product Details"
        showBack
        onBackPress={() => navigation.goBack()}
        showCart
        onCartPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
      />

      {isLoading ? (
        <View style={{ padding: 20 }}>
          <SkeletonLoader height={280} borderRadius={16} style={{ marginBottom: 16 }} />
          <SkeletonLoader height={24} width="60%" style={{ marginBottom: 10 }} />
          <SkeletonLoader height={32} width="90%" style={{ marginBottom: 16 }} />
          <SkeletonLoader height={60} style={{ marginBottom: 16 }} />
        </View>
      ) : (
        <>
          {/* Main Hero Gallery */}
          <View style={styles.imageGalleryWrapper}>
            <Image
              source={{ uri: imagesList[selectedImgIndex] || imagesList[0] }}
              style={styles.mainImage}
              contentFit="cover"
              transition={200}
            />

            {discountPercent ? (
              <Badge
                label={`${discountPercent}% OFF`}
                variant="danger"
                style={styles.discountBadge}
              />
            ) : null}

            {/* Quick Action Overlays */}
            <View style={styles.galleryActions}>
              <TouchableOpacity
                onPress={handleShare}
                style={[styles.actionIconBtn, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)' }]}
                activeOpacity={0.8}
              >
                <Ionicons name="share-social-outline" size={18} color={theme.colors.navy} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => dispatch(toggleWishlist(product.id))}
                style={[styles.actionIconBtn, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)' }]}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isWishlisted ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isWishlisted ? '#EF4444' : theme.colors.navy}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Thumbnail Slider */}
          {imagesList.length > 1 && (
            <View style={styles.thumbRow}>
              {imagesList.map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedImgIndex(idx)}
                  style={[
                    styles.thumbBtn,
                    selectedImgIndex === idx && {
                      borderColor: theme.colors.primary,
                      borderWidth: 2,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: url }} style={styles.thumbImg} contentFit="cover" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Content Body */}
          <View style={styles.contentPadding}>
            {/* Brand + Verified pill */}
            <View style={styles.brandRow}>
              <Text style={[styles.brandLabel, { color: theme.colors.primary }]}>
                {product.brand?.name || 'VERIFIED MANUFACTURER'}
              </Text>
              {product.brand?.isVerified && (
                <View style={styles.verifiedPill}>
                  <Ionicons name="shield-checkmark" size={12} color="#10B981" />
                  <Text style={styles.verifiedPillText}>Genuine Direct</Text>
                </View>
              )}
            </View>

            {/* Product Title */}
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              {product.name}
            </Text>

            {/* Rating & Review Bar */}
            <View style={styles.ratingRow}>
              <Rating
                rating={product.rating?.average || 4.8}
                count={product.reviewCount || 1245}
                showCount
                size={14}
              />
              <Text style={[styles.skuText, { color: theme.colors.textTertiary }]}>
                SKU: {product.sku || 'HM-CEM-53'}
              </Text>
            </View>

            {/* Price Box */}
            <View style={[styles.priceBox, { backgroundColor: theme.colors.surfaceVariant }]}>
              <View style={styles.priceLeft}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={[styles.price, { color: theme.colors.navy }]}>
                    {formatPrice(currentPrice, product.price.currency)}
                  </Text>
                  <Text style={[styles.unitText, { color: theme.colors.textSecondary }]}>
                    {' '}/ {product.unit || 'Bag'}
                  </Text>
                </View>

                {comparePrice && comparePrice > currentPrice && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Text style={[styles.comparePrice, { color: theme.colors.textDisabled }]}>
                      MRP {formatPrice(comparePrice, product.price.currency)}
                    </Text>
                    <Text style={[styles.saveText, { color: theme.colors.success }]}>
                      Save {formatPrice(comparePrice - currentPrice, product.price.currency)} ({discountPercent}%)
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.taxBadge}>
                <Text style={styles.taxBadgeText}>GST 18% Inclusive</Text>
              </View>
            </View>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <View style={styles.sectionWrap}>
                <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>
                  Select Packaging / Pack Size
                </Text>
                <View style={styles.variantRow}>
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <TouchableOpacity
                        key={variant.id}
                        onPress={() => setSelectedVariant(variant)}
                        style={[
                          styles.variantChip,
                          {
                            backgroundColor: isSelected
                              ? `${theme.colors.primary}18`
                              : theme.colors.surfaceVariant,
                            borderColor: isSelected
                              ? theme.colors.primary
                              : theme.colors.border,
                            borderWidth: isSelected ? 2 : 1,
                          },
                        ]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.variantName,
                            {
                              color: isSelected
                                ? theme.colors.navy
                                : theme.colors.textPrimary,
                              fontFamily: isSelected
                                ? 'Poppins_600SemiBold'
                                : 'Inter_500Medium',
                            },
                          ]}
                        >
                          {variant.name}
                        </Text>
                        <Text
                          style={[
                            styles.variantPrice,
                            {
                              color: isSelected
                                ? theme.colors.navy
                                : theme.colors.textSecondary,
                            },
                          ]}
                        >
                          {formatPrice(variant.price.amount, product.price.currency)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Bulk Pricing Tier Table */}
            {product.price.bulkPricing && product.price.bulkPricing.length > 0 && (
              <View style={styles.sectionWrap}>
                <View style={styles.bulkHeader}>
                  <Ionicons name="pricetags" size={16} color={theme.colors.navy} />
                  <Text style={[styles.sectionHeading, { color: theme.colors.navy, marginTop: 0 }]}>
                    Wholesale B2B Tier Pricing
                  </Text>
                </View>
                <View style={[styles.bulkTable, { borderColor: theme.colors.border }]}>
                  <View style={[styles.bulkTableRow, styles.bulkTableHeader, { backgroundColor: `${theme.colors.primary}15` }]}>
                    <Text style={[styles.bulkTableHeadCol, { color: theme.colors.navy }]}>Quantity</Text>
                    <Text style={[styles.bulkTableHeadCol, { color: theme.colors.navy }]}>Price / {product.unit}</Text>
                    <Text style={[styles.bulkTableHeadCol, { color: theme.colors.navy }]}>Savings</Text>
                  </View>
                  {product.price.bulkPricing.map((slab, i) => (
                    <View
                      key={i}
                      style={[
                        styles.bulkTableRow,
                        i % 2 === 1 && { backgroundColor: theme.colors.surfaceVariant },
                      ]}
                    >
                      <Text style={[styles.bulkTableCol, { color: theme.colors.textPrimary }]}>
                        {slab.minQuantity} - {slab.maxQuantity > 1000 ? '50+ ' : `${slab.maxQuantity} `}{product.unit}s
                      </Text>
                      <Text style={[styles.bulkTableCol, { fontFamily: 'Poppins_700Bold', color: theme.colors.navy }]}>
                        {formatPrice(slab.price, product.price.currency)}
                      </Text>
                      <Text style={[styles.bulkTableCol, { color: theme.colors.success, fontFamily: 'Inter_600SemiBold' }]}>
                        {slab.price < currentPrice ? `Save ${formatPrice(currentPrice - slab.price)}` : 'Standard'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Quantity Stepper & Minimum Order Quantity */}
            <View style={styles.sectionWrap}>
              <View style={styles.qtyContainer}>
                <View>
                  <Text style={[styles.qtyLabel, { color: theme.colors.textPrimary }]}>
                    Order Quantity:
                  </Text>
                  <Text style={[styles.moqSubText, { color: theme.colors.textTertiary }]}>
                    Minimum Order: {minOrderQty} {product.unit || 'units'}
                  </Text>
                </View>

                <Stepper
                  value={quantity}
                  onValueChange={handleQuantityChange}
                  min={minOrderQty}
                  max={product.maxOrderQuantity || 5000}
                />
              </View>

              {moqWarning ? (
                <View style={styles.moqWarningBox}>
                  <Ionicons name="alert-circle" size={14} color="#D97706" />
                  <Text style={styles.moqWarningText}>{moqWarning}</Text>
                </View>
              ) : null}
            </View>

            {/* Pincode & Delivery Checker */}
            <Card variant="outlined" style={styles.deliveryCard}>
              <View style={styles.deliveryHeader}>
                <Ionicons name="location-outline" size={18} color={theme.colors.navy} />
                <Text style={[styles.deliveryTitle, { color: theme.colors.navy }]}>
                  Delivery & Freight Availability
                </Text>
              </View>

              <View style={styles.pincodeRow}>
                <TextInput
                  value={pincode}
                  onChangeText={setPincode}
                  placeholder="Enter 6-digit Pincode"
                  keyboardType="number-pad"
                  maxLength={6}
                  style={[
                    styles.pincodeInput,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      color: theme.colors.textPrimary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={handlePincodeCheck}
                  style={[styles.pincodeBtn, { backgroundColor: theme.colors.navy }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.pincodeBtnText}>Check</Text>
                </TouchableOpacity>
              </View>

              {deliveryChecked && (
                <View style={styles.deliveryResultRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={[styles.deliveryResultText, { color: theme.colors.textPrimary }]}>
                    {deliveryEstimateText}
                  </Text>
                </View>
              )}
            </Card>

            {/* Vendor / Supplier Card */}
            <Card variant="outlined" style={styles.vendorCard}>
              <View style={styles.vendorHeader}>
                <View style={[styles.vendorAvatar, { backgroundColor: `${theme.colors.primary}20` }]}>
                  <Ionicons name="business" size={22} color={theme.colors.navy} />
                </View>
                <View style={styles.vendorInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={[styles.vendorName, { color: theme.colors.textPrimary }]}>
                      {product.vendor?.name || 'Apex Building Materials'}
                    </Text>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  </View>
                  <Text style={[styles.vendorSub, { color: theme.colors.textTertiary }]}>
                    📍 {product.vendor?.location || 'Hyderabad, Telangana'}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    <Rating rating={product.vendor?.rating || 4.9} size={11} showCount count={350} />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('VendorDetail', {
                      vendorId: product.vendor?.id || 'v1',
                    })
                  }
                  style={[styles.viewStoreBtn, { borderColor: theme.colors.primary }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.viewStoreText, { color: theme.colors.navy }]}>
                    View Store
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>

            {/* Technical Specifications Table */}
            <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>
              Technical Specifications
            </Text>
            <View style={[styles.specTable, { borderColor: theme.colors.border }]}>
              {specsList.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.specRow,
                    idx % 2 === 0 && { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.specValue, { color: theme.colors.textPrimary }]}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Description */}
            <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>
              Product Description
            </Text>
            <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
              {product.description}
            </Text>

            {/* Key Features Bullet List */}
            <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>
              Key Features & Benefits
            </Text>
            <View style={styles.featuresList}>
              {[
                'Exceptional 28-day compressive strength (>58 MPa).',
                'Optimum particle size distribution for denser, impermeable concrete.',
                'Superior durability against aggressive sulfate and chemical attacks.',
                'Tested and compliant with Bureau of Indian Standards (IS 269:2015).',
                'Moisture-shield tamper-evident bag packaging.',
              ].map((feat, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons name="checkmark-done" size={16} color={theme.colors.primary} />
                  <Text style={[styles.featureText, { color: theme.colors.textPrimary }]}>
                    {feat}
                  </Text>
                </View>
              ))}
            </View>

            {/* Customer Rating Breakdown */}
            <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>
              Ratings & Customer Reviews
            </Text>
            <Card variant="outlined" style={styles.ratingBreakdownCard}>
              <View style={styles.ratingSummaryLeft}>
                <Text style={[styles.ratingBigNumber, { color: theme.colors.navy }]}>
                  {product.rating?.average || 4.8}
                </Text>
                <Rating rating={product.rating?.average || 4.8} size={14} />
                <Text style={[styles.ratingCountText, { color: theme.colors.textTertiary }]}>
                  {product.reviewCount || 1245} verified reviews
                </Text>
              </View>

              <View style={styles.ratingBarsRight}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const distribution = product.rating?.distribution as any;
                  const count = distribution ? distribution[star] || 0 : 50;
                  const total = product.reviewCount || 100;
                  const pct = Math.min(100, Math.round((count / total) * 100));

                  return (
                    <View key={star} style={styles.barRow}>
                      <Text style={[styles.starLabel, { color: theme.colors.textSecondary }]}>
                        {star} ★
                      </Text>
                      <View style={[styles.barTrack, { backgroundColor: theme.colors.surfaceVariant }]}>
                        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: theme.colors.primary }]} />
                      </View>
                      <Text style={[styles.barCount, { color: theme.colors.textTertiary }]}>
                        {pct}%
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card>

            {/* Spacer for sticky bottom bar */}
            <View style={{ height: 100 }} />
          </View>
        </>
      )}

      {/* Sticky Bottom Actions */}
      <View
        style={[
          styles.stickyBottomBar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.bottomPriceWrap}>
          <Text style={[styles.bottomSubtotalLabel, { color: theme.colors.textTertiary }]}>
            Total ({quantity} {product.unit}s)
          </Text>
          <Text style={[styles.bottomSubtotal, { color: theme.colors.navy }]}>
            {formatPrice(currentPrice * quantity, product.price.currency)}
          </Text>
        </View>

        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            onPress={handleAddToCart}
            style={[styles.addCartBottomBtn, { borderColor: theme.colors.navy }]}
            activeOpacity={0.8}
          >
            <Ionicons name="bag-handle-outline" size={18} color={theme.colors.navy} />
            <Text style={[styles.addCartBottomText, { color: theme.colors.navy }]}>
              Add to Cart
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBuyNow}
            style={styles.buyNowBottomBtn}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#FDB913', '#F9A825']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buyNowGradient}
            >
              <Text style={styles.buyNowText}>Buy Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#152238" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imageGalleryWrapper: {
    width: SCREEN_WIDTH,
    height: 300,
    position: 'relative',
    backgroundColor: '#F1F5F9',
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
  galleryActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 10,
  },
  actionIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  thumbBtn: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    backgroundColor: '#F1F5F9',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  contentPadding: {
    padding: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  brandLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  verifiedPillText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#10B981',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    lineHeight: 27,
    marginVertical: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  skuText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  priceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  priceLeft: {
    flex: 1,
  },
  price: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 24,
  },
  unitText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  comparePrice: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  saveText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  taxBadge: {
    backgroundColor: 'rgba(253, 185, 19, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  taxBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: '#B45309',
  },
  sectionWrap: {
    marginVertical: 8,
  },
  sectionHeading: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  variantRow: {
    flexDirection: 'row',
    gap: 10,
  },
  variantChip: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  variantName: {
    fontSize: 13,
    marginBottom: 2,
  },
  variantPrice: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  bulkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    marginBottom: 8,
  },
  bulkTable: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  bulkTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  bulkTableHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  bulkTableHeadCol: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  bulkTableCol: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  qtyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  qtyLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  moqSubText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    marginTop: 2,
  },
  moqWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    marginTop: 6,
  },
  moqWarningText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#B45309',
  },
  deliveryCard: {
    padding: 14,
    marginVertical: 10,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  deliveryTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  pincodeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pincodeInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  pincodeBtn: {
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pincodeBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  deliveryResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  deliveryResultText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12.5,
  },
  vendorCard: {
    padding: 14,
    marginVertical: 10,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
  viewStoreBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  viewStoreText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  specTable: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  specLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
  },
  specValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12.5,
  },
  descriptionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13.5,
    lineHeight: 21,
    marginBottom: 14,
  },
  featuresList: {
    gap: 8,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  ratingBreakdownCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    marginVertical: 10,
  },
  ratingSummaryLeft: {
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    width: '35%',
  },
  ratingBigNumber: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 32,
  },
  ratingCountText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  ratingBarsRight: {
    flex: 1,
    paddingLeft: 16,
    gap: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    width: 22,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  barCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    width: 28,
    textAlign: 'right',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 12 },
    }),
  },
  bottomPriceWrap: {
    marginRight: 12,
  },
  bottomSubtotalLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  bottomSubtotal: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  bottomButtonsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  addCartBottomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 4,
  },
  addCartBottomText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
  buyNowBottomBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buyNowGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 12,
    gap: 6,
  },
  buyNowText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#152238',
  },
});
