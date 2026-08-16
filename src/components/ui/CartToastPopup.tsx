/**
 * HINCH MART — Add-to-Cart Bottom Animated Popup Toast Component
 */
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectCartToast, hideCartToast } from '../../redux/slices/cartSlice';
import { formatPrice } from '../../utils';

export function CartToastPopup() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const toast = useAppSelector(selectCartToast);

  const bottomOffset = insets.bottom > 0 ? insets.bottom + 64 : 72;

  useEffect(() => {
    if (toast?.visible) {
      const timer = setTimeout(() => {
        dispatch(hideCartToast());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast || !toast.visible) {
    return null;
  }

  const handleViewCart = () => {
    dispatch(hideCartToast());
    try {
      navigation.navigate('MainTabs', { screen: 'CartTab' });
    } catch (e) {
      // Fallback
      navigation.navigate('CartTab');
    }
  };

  const handleClose = () => {
    dispatch(hideCartToast());
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(250)}
      style={[
        styles.popupContainer,
        {
          bottom: bottomOffset,
          backgroundColor: theme.colors.navy,
          borderColor: 'rgba(253, 185, 19, 0.4)',
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={16} color="#FFF" />
        </View>

        <View style={styles.metaCol}>
          <Text style={styles.addedBadgeText}>ADDED TO CART</Text>
          <Text numberOfLines={1} style={styles.itemTitleText}>
            {toast.itemTitle}
          </Text>
          <Text style={styles.priceText}>
            {formatPrice(toast.itemPrice)} x {toast.quantity} item{toast.quantity > 1 ? 's' : ''}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleViewCart}
          style={styles.viewCartBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.viewCartText}>View Cart</Text>
          <Ionicons name="arrow-forward" size={12} color="#152238" style={{ marginLeft: 3 }} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={16} color="rgba(255, 255, 255, 0.7)" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    direction: 'ltr',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  metaCol: {
    flex: 1,
    paddingRight: 8,
  },
  addedBadgeText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 10,
    color: '#FDB913',
    letterSpacing: 0.5,
  },
  itemTitleText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 1,
  },
  priceText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 1,
  },
  viewCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDB913',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 6,
  },
  viewCartText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: '#152238',
  },
  closeBtn: {
    padding: 4,
  },
});
