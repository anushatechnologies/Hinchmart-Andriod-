/**
 * HINCH MART — Hot Deals API Service
 * Endpoint: /api/home/hot-deals (fallback: /api/hot-deals)
 * Dedicated customer Home Screen API for Hot Deals.
 * Public endpoint (no authentication required).
 */
import apiClient from './client';
import { API_ENDPOINTS } from '../../constants/api';
import { normalizeProductImageUrl } from './products.api';
import { HotDealProduct, HotDealsResponse } from '../../types/backend.types';

export interface NormalizedHotDealProduct extends HotDealProduct {
  id: string;
  title: string;
  price: number;
  dealPrice?: number;
  sellingPrice?: number;
  comparePrice?: number;
  mrp?: number;
  discountPercentage?: number;
  discountPercent?: number;
  image: string;
}

/**
 * Maps backend hot deal product to frontend display structure
 * while preserving all original backend attributes.
 *
 * Directly binds discountPercentage from backend API:
 * {product.discountPercentage && <span className="badge">{Math.round(product.discountPercentage)}% OFF</span>}
 * Removes 13% off fallback calculation.
 */
export function normalizeHotDealProduct(raw: any, index = 0): NormalizedHotDealProduct {
  const pId = raw.productId || raw.id || raw.product_id || index + 1;
  const name = raw.title || raw.productName || raw.name || '';

  const rawBasePrice = typeof raw.price === 'number' ? raw.price : parseFloat(String(raw.price || 0)) || 0;
  const rawDealPrice = typeof raw.dealPrice === 'number' && raw.dealPrice > 0 ? raw.dealPrice : undefined;
  const rawSellingPrice = typeof raw.sellingPrice === 'number' && raw.sellingPrice > 0 ? raw.sellingPrice : undefined;

  // Actual price customer pays (prefer dealPrice / sellingPrice if provided)
  const price = rawDealPrice ?? rawSellingPrice ?? rawBasePrice;

  // Original/MRP compare price
  const mrp =
    typeof raw.mrp === 'number' && raw.mrp > 0
      ? raw.mrp
      : typeof raw.comparePrice === 'number' && raw.comparePrice > 0
      ? raw.comparePrice
      : (rawDealPrice && rawBasePrice > rawDealPrice)
      ? rawBasePrice
      : undefined;

  // Direct backend discount percentage (bind directly, remove 13% fallback calculation)
  const rawDiscount =
    typeof raw.discountPercentage === 'number' && raw.discountPercentage > 0
      ? raw.discountPercentage
      : typeof raw.discountPercent === 'number' && raw.discountPercent > 0
      ? raw.discountPercent
      : typeof raw.discount === 'number' && raw.discount > 0
      ? raw.discount
      : undefined;

  const discountPercentage = rawDiscount != null ? Math.round(rawDiscount) : undefined;
  const discountPercent = discountPercentage ?? 0;

  const rawImg = raw.imageUrl || raw.image || (Array.isArray(raw.images) && raw.images[0]) || '';
  const imgUrl = normalizeProductImageUrl(typeof rawImg === 'string' ? rawImg : rawImg?.url || '');

  return {
    ...raw,
    id: String(pId),
    productId: pId,
    name,
    productName: name,
    title: name,
    price,
    dealPrice: rawDealPrice,
    sellingPrice: rawSellingPrice,
    mrp,
    comparePrice: mrp,
    discountPercentage,
    discountPercent,
    imageUrl: imgUrl,
    image: imgUrl,
    displayOrder: typeof raw.displayOrder === 'number' ? raw.displayOrder : index,
    active: raw.active !== false,
  };
}

export let globalHotDealsSectionTitle = 'Hot Deals';
export let globalHotDealsSectionIcon: string | null = null;

export const hotDealsApi = {
  /**
   * Get Hot Deals for Home Screen
   * Method: GET
   * Returns only active deals sorted by displayOrder in ascending order.
   */
  async getHotDeals(): Promise<NormalizedHotDealProduct[]> {
    let rawData: any = null;

    try {
      const response = await apiClient.get<HotDealsResponse | { data: HotDealsResponse } | HotDealProduct[]>(
        API_ENDPOINTS.HOME.HOT_DEALS,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      rawData = response.data;
    } catch (primaryErr: any) {
      if (__DEV__) {
        console.log('[hotDealsApi] Primary endpoint /api/home/hot-deals notice:', primaryErr?.message || primaryErr);
      }
      // Try fallback endpoint /api/hot-deals
      try {
        const fallbackRes = await apiClient.get<HotDealsResponse | { data: HotDealsResponse } | HotDealProduct[]>(
          API_ENDPOINTS.HOME.HOT_DEALS_FALLBACK,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        rawData = fallbackRes.data;
      } catch (fallbackErr: any) {
        throw fallbackErr;
      }
    }

    // Extract dynamic section title & icon if provided by backend
    if (rawData) {
      const sectionName = rawData?.data?.section || rawData?.section || rawData?.data?.title || rawData?.title;
      if (typeof sectionName === 'string' && sectionName.trim()) {
        globalHotDealsSectionTitle = sectionName.trim();
      }
      const sectionIcon = rawData?.data?.icon || rawData?.icon || rawData?.data?.iconUrl || rawData?.iconUrl;
      if (typeof sectionIcon === 'string' && sectionIcon.trim()) {
        globalHotDealsSectionIcon = sectionIcon.trim();
      }
    }

    // Extract products array from response envelope
    let list: any[] = [];
    if (rawData) {
      if (Array.isArray(rawData)) {
        list = rawData;
      } else if (Array.isArray(rawData.products)) {
        list = rawData.products;
      } else if (rawData.data && Array.isArray(rawData.data.products)) {
        list = rawData.data.products;
      } else if (Array.isArray(rawData.data)) {
        list = rawData.data;
      }
    }

    // Process and sort according to backend contract
    return list
      .filter((p: any) => p && p.active !== false)
      .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((p: any, idx: number) => normalizeHotDealProduct(p, idx));
  },
};
