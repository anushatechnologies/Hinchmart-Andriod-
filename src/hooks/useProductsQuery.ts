/**
 * HINCH MART — Custom TanStack Query Hooks for Products & Home
 */
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productsApi } from '../services/api/products.api';
import { SearchParams } from '../types/api.types';

export function useHomeData() {
  const bannersQuery = useQuery({
    queryKey: ['home', 'banners'],
    queryFn: async () => {
      try {
        const res = await productsApi.getBanners();
        return res.data?.data ?? [];
      } catch (e) {
        return [];
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await productsApi.getCategories();
        return res.data?.data ?? [];
      } catch (e) {
        return [];
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const featuredQuery = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      try {
        const res = await productsApi.getFeaturedProducts();
        return res.data?.data ?? [];
      } catch (e) {
        return [];
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const dealsQuery = useQuery({
    queryKey: ['products', 'deals'],
    queryFn: async () => {
      try {
        const res = await productsApi.getDeals();
        return res.data?.data ?? [];
      } catch (e) {
        return [];
      }
    },
    retry: false,
  });

  const trendingQuery = useQuery({
    queryKey: ['products', 'trending'],
    queryFn: async () => {
      try {
        const res = await productsApi.getTrending();
        return res.data?.data ?? [];
      } catch (e) {
        return [];
      }
    },
    retry: false,
  });

  const brandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      try {
        const res = await productsApi.getBrands();
        return res.data?.data ?? [];
      } catch (e) {
        return [];
      }
    },
    retry: false,
  });

  return {
    banners: bannersQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
    featured: featuredQuery.data ?? [],
    deals: dealsQuery.data ?? [],
    trending: trendingQuery.data ?? [],
    brands: brandsQuery.data ?? [],
    isLoading: false, // Never block UI on offline API retries
    refetchAll: () => {
      bannersQuery.refetch();
      categoriesQuery.refetch();
      featuredQuery.refetch();
      dealsQuery.refetch();
      trendingQuery.refetch();
      brandsQuery.refetch();
    },
  };
}

export function useProducts(params: SearchParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => (await productsApi.getProducts(params)).data,
    retry: false,
  });
}

export function useInfiniteProducts(params: Omit<SearchParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await productsApi.getProducts({ ...params, page: pageParam });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    retry: false,
  });
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => (await productsApi.getProductDetail(id)).data.data,
    enabled: !!id,
    retry: false,
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ['search', 'suggestions', query],
    queryFn: async () => (await productsApi.getSearchSuggestions(query)).data.data,
    enabled: query.length >= 2,
    retry: false,
  });
}
