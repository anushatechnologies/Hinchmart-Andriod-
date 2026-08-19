/**
 * HINCH MART — API Constants
 */

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.hinchmart.com/v1';


export const API_TIMEOUT = 30000; // 30 seconds

export const API_ENDPOINTS = {
  // Auth
 AUTH: {
  SEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
},

  // User / Profile
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    BUSINESS_PROFILE: '/user/business-profile',
    ADDRESSES: '/user/addresses',
    PREFERENCES: '/user/preferences',
    NOTIFICATIONS: '/user/notifications',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    REVIEWS: (id: string) => `/products/${id}/reviews`,
    RELATED: (id: string) => `/products/${id}/related`,
    FAQ: (id: string) => `/products/${id}/faq`,
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
    PRODUCTS: (id: string) => `/categories/${id}/products`,
  },

  // Search
  SEARCH: {
    PRODUCTS: '/search/products',
    SUGGESTIONS: '/search/suggestions',
  },

  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart/items',
    UPDATE: (id: string) => `/cart/items/${id}`,
    REMOVE: (id: string) => `/cart/items/${id}`,
    CLEAR: '/cart/clear',
    APPLY_COUPON: '/cart/coupon',
    REMOVE_COUPON: '/cart/coupon',
    DELIVERY_ESTIMATE: '/cart/delivery-estimate',
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    RETURN: (id: string) => `/orders/${id}/return`,
    REORDER: (id: string) => `/orders/${id}/reorder`,
    TRACKING: (id: string) => `/orders/${id}/tracking`,
    INVOICE: (id: string) => `/orders/${id}/invoice`,
  },

  // Checkout
  CHECKOUT: {
    SHIPPING_METHODS: '/checkout/shipping-methods',
    PAYMENT_METHODS: '/checkout/payment-methods',
    PLACE_ORDER: '/checkout/place-order',
    VERIFY_PAYMENT: '/checkout/verify-payment',
  },

  // Wallet
  WALLET: {
    INFO: '/wallet',
    TRANSACTIONS: '/wallet/transactions',
    REWARDS: '/wallet/rewards',
  },

  // RFQ
  RFQ: {
    LIST: '/rfq',
    CREATE: '/rfq',
    DETAIL: (id: string) => `/rfq/${id}`,
    QUOTATIONS: (id: string) => `/rfq/${id}/quotations`,
    APPROVE: (id: string, quotationId: string) => `/rfq/${id}/quotations/${quotationId}/approve`,
    REJECT: (id: string, quotationId: string) => `/rfq/${id}/quotations/${quotationId}/reject`,
  },

  // Purchase Orders
  PURCHASE_ORDERS: {
    LIST: '/purchase-orders',
    DETAIL: (id: string) => `/purchase-orders/${id}`,
    CREATE: '/purchase-orders',
    APPROVE: (id: string) => `/purchase-orders/${id}/approve`,
    REJECT: (id: string) => `/purchase-orders/${id}/reject`,
  },

  // Vendors
  VENDORS: {
    LIST: '/vendors',
    DETAIL: (id: string) => `/vendors/${id}`,
    PRODUCTS: (id: string) => `/vendors/${id}/products`,
    DASHBOARD: '/vendor/dashboard',
    ORDERS: '/vendor/orders',
    PAYMENTS: '/vendor/payments',
    PERFORMANCE: '/vendor/performance',
  },

  // Companies
  COMPANIES: {
    PROFILE: '/company',
    EMPLOYEES: '/company/employees',
    PROJECTS: '/company/projects',
  },

  // Rentals
  RENTALS: {
    PRODUCTS: '/rentals',
    DETAIL: (id: string) => `/rentals/${id}`,
    BOOK: '/rentals/book',
    HISTORY: '/rentals/history',
    AVAILABILITY: (id: string) => `/rentals/${id}/availability`,
  },

  // Wishlist
  WISHLIST: {
    LIST: '/wishlist',
    ADD: '/wishlist',
    REMOVE: (id: string) => `/wishlist/${id}`,
  },

  // Chat
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: (id: string) => `/chat/conversations/${id}/messages`,
    SEND: (id: string) => `/chat/conversations/${id}/messages`,
  },

  // Blog
  BLOG: {
    ARTICLES: '/blog/articles',
    DETAIL: (slug: string) => `/blog/articles/${slug}`,
    VIDEOS: '/blog/videos',
  },

  // News
  NEWS: {
    LIST: '/news',
    DETAIL: (id: string) => `/news/${id}`,
  },

  // Help Center
  HELP: {
    FAQ: '/help/faq',
    TICKETS: '/help/tickets',
    CREATE_TICKET: '/help/tickets',
    TICKET_DETAIL: (id: string) => `/help/tickets/${id}`,
    CONTACT: '/help/contact',
  },

  // Home
  HOME: {
    BANNERS: '/home/banners',
    FEATURED: '/home/featured',
    DEALS: '/home/deals',
    TRENDING: '/home/trending',
    BRANDS: '/home/brands',
    RECENTLY_VIEWED: '/home/recently-viewed',
    RECOMMENDED: '/home/recommended',
  },

  // Upload
  UPLOAD: {
    FILE: '/upload/file',
    IMAGE: '/upload/image',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    PUSH_TOKEN: '/notifications/push-token',
  },
} as const;
