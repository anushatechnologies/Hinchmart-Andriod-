/**
 * HINCH MART — Similar Products in Stock Modal
 * E-Commerce standard (Amazon / Flipkart / Zepto inspired):
 * When an item in the cart goes out of stock, this modal surfaces available in-stock
 * alternatives from the same subcategory/category, allowing customers to replace
 * the unavailable item with a single tap so their order placement can proceed.
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { ApiProduct } from '../../types/product.types';
import { productsApi } from '../../services/api/products.api';
import { resolveProductImage } from '../../hooks/useLiveProducts';
import { formatPrice } from '../../utils';
import { isCartItemOutOfStock } from '../../utils/cartStock';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface SimilarProductsModalProps {
  visible: boolean;
  onClose: () => void;
  outOfStockItem: any | null;
  onReplaceWithItem: (newProduct: ApiProduct, oosItem: any) => Promise<void> | void;
  onRemoveItem?: (oosItem: any) => Promise<void> | void;
}

export function SimilarProductsModal({
  visible,
  onClose,
  outOfStockItem,
  onReplaceWithItem,
  onRemoveItem,
}: SimilarProductsModalProps) {
  const { theme, isDark } = useTheme();

  const [alternatives, setAlternatives] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  // Animations
  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(SCREEN_HEIGHT * 0.5);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 240, easing: Easing.out(Easing.ease) });
      translateY.value = withSpring(0, { damping: 20, stiffness: 180 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 180, easing: Easing.in(Easing.ease) });
      translateY.value = withTiming(SCREEN_HEIGHT * 0.5, { duration: 200 });
    }
  }, [visible]);

  // Fetch similar in-stock products
  useEffect(() => {
    let isMounted = true;
    if (!visible || !outOfStockItem) {
      setAlternatives([]);
      return;
    }

    const currentId = String(
      outOfStockItem.productId ||
      outOfStockItem.id ||
      outOfStockItem.product?.id ||
      outOfStockItem.product?.productId ||
      ''
    );

    const subId =
      outOfStockItem.subcategoryId ||
      outOfStockItem.product?.subcategoryId ||
      (outOfStockItem.product as any)?.subCategory?.id;

    const catId =
      outOfStockItem.categoryId ||
      outOfStockItem.product?.categoryId ||
      (outOfStockItem.product as any)?.category?.id;

    setIsLoading(true);

    const fetchAlternatives = async () => {
      try {
        const results: ApiProduct[] = [];
        const seen = new Set<string>();
        if (currentId) seen.add(currentId);

        // 1. Try matching subcategory first
        if (subId) {
          const subProducts = await productsApi.getProducts({ subcategoryId: subId, limit: 12 });
          for (const p of subProducts) {
            const pId = String(p.id || p.productId);
            if (!seen.has(pId) && !isCartItemOutOfStock(p)) {
              seen.add(pId);
              results.push(p);
            }
          }
        }

        // 2. Fallback to category if needed
        if (results.length < 4 && catId) {
          const catProducts = await productsApi.getProducts({ categoryId: catId, limit: 12 });
          for (const p of catProducts) {
            const pId = String(p.id || p.productId);
            if (!seen.has(pId) && !isCartItemOutOfStock(p)) {
              seen.add(pId);
              results.push(p);
            }
          }
        }

        // 3. Fallback to general products if still empty
        if (results.length === 0) {
          const fallbackProducts = await productsApi.getProducts({ limit: 8 });
          for (const p of fallbackProducts) {
            const pId = String(p.id || p.productId);
            if (!seen.has(pId) && !isCartItemOutOfStock(p)) {
              seen.add(pId);
              results.push(p);
            }
          }
        }

        if (isMounted) {
          setAlternatives(results);
        }
      } catch (err) {
        if (__DEV__) {
          console.warn('[SimilarProductsModal] fetch error:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAlternatives();

    return () => {
      isMounted = false;
    };
  }, [visible, outOfStockItem]);

  const handleDismiss = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 160 }, () => {
      runOnJS(onClose)();
    });
    translateY.value = withTiming(SCREEN_HEIGHT * 0.5, { duration: 180 });
  }, [onClose]);

  const handleSelectAlternative = async (product: ApiProduct) => {
    const prodId = String(product.id || product.productId);
    setReplacingId(prodId);
    try {
      await onReplaceWithItem(product, outOfStockItem);
      handleDismiss();
    } finally {
      setReplacingId(null);
    }
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible && backdropOpacity.value === 0) {
    return null;
  }

  const oosName =
    outOfStockItem?.product?.name ||
    outOfStockItem?.name ||
    outOfStockItem?.productName ||
    'Selected Material';

  const oosRawImg =
    outOfStockItem?.image ||
    outOfStockItem?.imageUrl ||
    outOfStockItem?.product?.image ||
    outOfStockItem?.product?.imageUrl ||
    '';

  const oosImg = resolveProductImage(
    outOfStockItem?.product || oosName,
    oosRawImg,
    outOfStockItem?.product || outOfStockItem
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleDismiss}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Animated Dim Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleDismiss}
            accessibilityRole="button"
            accessibilityLabel="Close dialog"
          />
        </Animated.View>

        {/* Bottom Sheet Container */}
        <Animated.View
          style={[
            styles.sheetContainer,
            sheetStyle,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderTopColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.handleBar} />
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.badgeRow}>
                  <View style={styles.oosIndicator}>
                    <Ionicons name="alert-circle" size={14} color="#EF4444" />
                    <Text style={styles.oosIndicatorText}>Out of Stock</Text>
                  </View>
                  <Text style={[styles.sheetHeading, { color: theme.colors.textPrimary }]}>
                    Choose an Alternative
                  </Text>
                </View>
                <Text style={[styles.sheetSubheading, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Replace unavailable item to enable instant checkout
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleDismiss}
                style={[
                  styles.closeBtn,
                  { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
                ]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={20} color={isDark ? '#CBD5E1' : '#475569'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Currently Unavailable Item Summary Card */}
          <View
            style={[
              styles.oosCard,
              {
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2',
                borderColor: isDark ? '#7F1D1D' : '#FECACA',
              },
            ]}
          >
            <View style={styles.oosCardImgContainer}>
              <Image
                source={{ uri: oosImg }}
                style={styles.oosCardImg}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
            </View>
            <View style={styles.oosCardTextCol}>
              <Text style={styles.oosCardLabel}>UNAVAILABLE IN YOUR CART</Text>
              <Text
                numberOfLines={1}
                style={[styles.oosCardTitle, { color: theme.colors.textPrimary }]}
              >
                {oosName}
              </Text>
              <Text style={styles.oosCardNotice}>
                Currently out of stock. Order cannot proceed until replaced or removed.
              </Text>
            </View>

            {onRemoveItem && (
              <TouchableOpacity
                onPress={() => {
                  onRemoveItem(outOfStockItem);
                  handleDismiss();
                }}
                style={styles.oosRemoveBtn}
                accessibilityRole="button"
                accessibilityLabel="Remove item"
              >
                <Ionicons name="trash-outline" size={15} color="#DC2626" />
                <Text style={styles.oosRemoveBtnText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* In-Stock Similar Alternatives List */}
          <View style={styles.listContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="sparkles" size={16} color="#059669" />
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                In-Stock Verified Alternatives
              </Text>
            </View>

            {isLoading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#E31E24" />
                <Text style={[styles.loadingText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Finding matching in-stock products...
                </Text>
              </View>
            ) : alternatives.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="cube-outline" size={38} color="#94A3B8" />
                <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                  No Direct Alternatives Found
                </Text>
                <Text style={[styles.emptySubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Please remove this item from your cart to proceed with placing your order.
                </Text>
                {onRemoveItem && (
                  <TouchableOpacity
                    onPress={() => {
                      onRemoveItem(outOfStockItem);
                      handleDismiss();
                    }}
                    style={styles.emptyRemoveBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Remove unavailable item"
                  >
                    <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.emptyRemoveBtnText}>Remove Unavailable Item</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <FlatList
                data={alternatives}
                keyExtractor={(item) => String(item.id || item.productId)}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const altName = item.name || item.title || 'Alternative Product';
                  const altRawImg =
                    item.imageUrl ||
                    item.image ||
                    (Array.isArray(item.images) && typeof item.images[0] === 'string'
                      ? item.images[0]
                      : (item.images as any)?.[0]?.url) ||
                    '';
                  const altImg = resolveProductImage(item, altRawImg, item);
                  const isThisReplacing = replacingId === String(item.id || item.productId);

                  return (
                    <View
                      style={[
                        styles.altItemRow,
                        {
                          backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                          borderColor: isDark ? '#334155' : '#E2E8F0',
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.altImgBox,
                          {
                            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                            borderColor: isDark ? '#334155' : '#CBD5E1',
                          },
                        ]}
                      >
                        <Image
                          source={{ uri: altImg }}
                          style={styles.altImg}
                          contentFit="contain"
                          cachePolicy="memory-disk"
                        />
                      </View>

                      <View style={styles.altInfoCol}>
                        <View style={styles.stockPill}>
                          <View style={styles.stockDot} />
                          <Text style={styles.stockPillText}>Ready in Stock</Text>
                        </View>

                        <Text
                          numberOfLines={2}
                          style={[styles.altTitle, { color: theme.colors.textPrimary }]}
                        >
                          {altName}
                        </Text>

                        <View style={styles.altPriceRow}>
                          <Text style={[styles.altPrice, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                            {formatPrice(item.price)}
                          </Text>
                          {item.unit && (
                            <Text style={[styles.altUnit, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                              / {item.unit}
                            </Text>
                          )}
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleSelectAlternative(item)}
                        disabled={isThisReplacing}
                        activeOpacity={0.8}
                        style={styles.replaceBtn}
                        accessibilityRole="button"
                        accessibilityLabel={`Replace with ${altName}`}
                      >
                        {isThisReplacing ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <Ionicons name="swap-horizontal" size={15} color="#FFFFFF" />
                            <Text style={styles.replaceBtnText}>Replace</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    alignSelf: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  oosIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  oosIndicatorText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#DC2626',
    textTransform: 'uppercase',
  },
  sheetHeading: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
  },
  sheetSubheading: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  oosCardImgContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  oosCardImg: {
    width: 40,
    height: 40,
  },
  oosCardTextCol: {
    flex: 1,
  },
  oosCardLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  oosCardTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  oosCardNotice: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#991B1B',
    marginTop: 2,
  },
  oosRemoveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  oosRemoveBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#DC2626',
  },
  listContainer: {
    paddingHorizontal: 20,
    flexShrink: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  listContent: {
    paddingBottom: 16,
    gap: 10,
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginTop: 12,
  },
  emptyBox: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  emptyRemoveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  emptyRemoveBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  altItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  altImgBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  altImg: {
    width: 54,
    height: 54,
  },
  altInfoCol: {
    flex: 1,
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  stockPillText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#059669',
  },
  altTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  altPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 3,
    gap: 4,
  },
  altPrice: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  altUnit: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  replaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E31E24',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  replaceBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
});
