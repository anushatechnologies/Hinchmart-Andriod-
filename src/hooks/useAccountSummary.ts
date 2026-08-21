/**
 * HINCH MART — Account Summary Custom Hook
 * Architecture pattern: UI -> Hook -> Redux / API -> UI
 * Provides unified, reactive state for Profile, Stats, Orders, RFQs, and Wishlist.
 */
import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../redux/hooks';
import { selectWishlistCount } from '../redux/slices/wishlistSlice';
import { ordersApi } from '../services/api/orders.api';
import { rfqApi } from '../services/api/rfq.api';
import { MOCK_ORDERS } from '../features/orders/screens/OrderHistoryScreen';
import { DEMO_RFQS } from '../features/rfq/screens/RFQListScreen';
import { Order } from '../types/order.types';
import { RFQ } from '../types/rfq.types';
import { AUTH_CONFIG } from '../config/authConfig';

export interface AccountSummaryState {
  user: any;
  ordersCount: number;
  rfqsCount: number;
  wishlistCount: number;
  latestOrder: Order | null;
  latestRFQ: RFQ | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  profileCompletion: number;
  isVendor: boolean;
  isBusiness: boolean;
  hasGst: boolean;
}

export function useAccountSummary() {
  const user = useAppSelector((state) => state.auth.user);
  const wishlistCount = useAppSelector(selectWishlistCount);

  const [ordersCount, setOrdersCount] = useState<number>(MOCK_ORDERS.length);
  const [rfqsCount, setRfqsCount] = useState<number>(DEMO_RFQS.length);
  const [latestOrder, setLatestOrder] = useState<Order | null>(MOCK_ORDERS[0] || null);
  const [latestRFQ, setLatestRFQ] = useState<RFQ | null>(DEMO_RFQS[0] || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate profile completion percentage
  const profileCompletion = (() => {
    if (!user) return 40;
    let score = 0;
    if (user.fullName || (user.firstName && user.lastName)) score += 25;
    if (user.email) score += 25;
    if (user.phone) score += 20;
    if (user.businessProfile?.companyName) score += 15;
    if (user.businessProfile?.gstNumber || user.businessProfile?.taxId) score += 15;
    return Math.min(100, Math.max(score, 40));
  })();

  const fetchSummaryData = useCallback(async (isPullToRefresh = false) => {
    if (isPullToRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      if (!AUTH_CONFIG.developmentMode) {
        // Live Mode: Fetch from API endpoints
        const [ordersRes, rfqRes] = await Promise.allSettled([
          ordersApi.getOrders({ page: 1, limit: 5 }),
          rfqApi.getRFQs({ page: 1, limit: 5 }),
        ]);

        if (ordersRes.status === 'fulfilled' && ordersRes.value.data?.data) {
          const items = Array.isArray(ordersRes.value.data.data) ? ordersRes.value.data.data : [];
          const total = ordersRes.value.data.pagination?.totalItems || items.length;
          setOrdersCount(total);
          setLatestOrder(items[0] || null);
        }

        if (rfqRes.status === 'fulfilled' && rfqRes.value.data?.data) {
          const items = Array.isArray(rfqRes.value.data.data) ? rfqRes.value.data.data : [];
          const total = rfqRes.value.data.pagination?.totalItems || items.length;
          setRfqsCount(total);
          setLatestRFQ(items[0] || null);
        }
      } else {
        // Development Mode: Use local state
        setOrdersCount(MOCK_ORDERS.length);
        setRfqsCount(DEMO_RFQS.length);
        setLatestOrder(MOCK_ORDERS[0] || null);
        setLatestRFQ(DEMO_RFQS[0] || null);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to load account activity.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  return {
    user,
    ordersCount,
    rfqsCount,
    wishlistCount,
    reviewsCount: user?.reviewCount || 0,
    latestOrder,
    latestRFQ,
    isLoading,
    isRefreshing,
    error,
    profileCompletion,
    isVendor: user?.accountType === 'vendor',
    isBusiness: user?.accountType === 'business' || user?.accountType === 'contractor',
    hasGst: Boolean(user?.businessProfile?.gstNumber || user?.businessProfile?.taxId),
    refetch: () => fetchSummaryData(true),
  };
}
