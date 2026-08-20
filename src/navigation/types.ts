/**
 * HINCH MART — Navigation Param Types
 */

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  OTP: { email?: string; phone?: string; type: 'signup' | 'login' | 'reset' };
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  BiometricSetup: undefined;
  RegistrationDetails: { phone: string };
};

export type BottomTabParamList = {
  HomeTab: undefined;
  CategoriesTab: undefined;
  RFQTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;

  // Products & Catalog
  SubCategories: { categoryId: string; categoryName: string };
  ProductList: { categoryId?: string; subCategoryId?: string; brandId?: string; search?: string };
  ProductDetail: { productId: string };
  ProductGallery: { images: string[]; initialIndex?: number };
  Reviews: { productId: string };
  WriteReview: { productId: string };

  // Search & Filter
  Search: undefined;
  SearchResults: { query: string };
  Filters: { currentFilters?: any };

  // Checkout
  CheckoutAddress: undefined;
  CheckoutShipping: undefined;
  CheckoutPayment: undefined;
  CheckoutReview: undefined;
  OrderSuccess: { orderNumber: string; orderId: string };

  // Orders
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
  OrderTracking: { orderId: string };
  OrderReturn: { orderId: string };

  // Wallet
  Wallet: undefined;

  // RFQ
  RFQList: undefined;
  RFQCreate: undefined;
  RFQDetail: { rfqId: string };
  RFQCompare: { rfqId: string };
  RFQApprove: { rfqId: string; quotationId: string };

  // Purchase Orders
  POList: undefined;
  PODetail: { poId: string };

  // Profile & Settings
  BusinessProfile: undefined;
  EditProfile: undefined;
  Addresses: undefined;
  AddAddress: { addressId?: string };
  Language: undefined;
  Currency: undefined;
  Settings: undefined;

  // Companies & Vendors
  CompanyProfile: undefined;
  Employees: undefined;
  Projects: undefined;
  VendorDashboard: undefined;
  VendorProducts: undefined;
  VendorOrders: undefined;
  VendorPayments: undefined;
  VendorDetail: { vendorId: string };

  // Rentals
  RentalList: undefined;
  RentalDetail: { rentalId: string };
  RentalBooking: { rentalId: string };
  RentalHistory: undefined;

  // Content & Support
  Articles: undefined;
  ArticleDetail: { slug: string };
  Videos: undefined;
  News: undefined;
  NewsDetail: { newsId: string };
  Notifications: undefined;
  ChatList: undefined;
  Chat: { conversationId: string; title: string };
  FAQ: undefined;
  SupportTickets: undefined;
  CreateTicket: undefined;
  TicketDetail: { ticketId: string };
  ContactUs: undefined;
  Terms: undefined;
  Privacy: undefined;
  Policies: undefined;
  About: undefined;
  Wishlist: undefined;
};
