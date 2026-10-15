export type Role = 'visitor' | 'user' | 'advertiser' | 'business_owner' | 'moderator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  isVerified?: boolean;
  avatar?: string;
  createdAt: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  region: string;
  lat: number;
  lng: number;
  listingCount: number;
  popularDistricts: string[];
  description: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  isAdult: boolean;
  isBusinessOriented?: boolean;
  subcategories: string[];
  seoTitle: string;
  seoDescription: string;
}

export type ListingStatus = 'active' | 'pending' | 'draft' | 'paused' | 'rejected';
export type PromotionTier = 'none' | 'highlighted' | 'top_city' | 'vetrina_home';

export type ViewMode = 'home' | 'discover' | 'grid' | 'map' | 'split';

export interface Listing {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  subcategoryId: string;
  cityId: string;
  district: string;
  address?: string;
  lat: number;
  lng: number;
  description: string;
  images: string[];
  ratePerHour?: number;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  verified: boolean;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  status: ListingStatus;
  promotionTier: PromotionTier;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  contactsCount: number;
  likesCount?: number;
  isLiked?: boolean;
  tags?: string[];
  distanceKm?: number;
}

export interface BusinessService {
  id: string;
  name: string;
  durationMin: number;
  priceEur: number;
  description: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: 'massaggi_spa' | 'centro_estetico' | 'spa_wellness';
  cityId: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp?: string;
  website?: string;
  description: string;
  images: string[];
  openingHours: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  isPromoted: boolean;
  services: BusinessService[];
  authorId: string;
}

export interface BookingRequest {
  id: string;
  businessId: string;
  businessName: string;
  serviceId: string;
  serviceName: string;
  priceEur: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  createdAt: string;
}

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

export interface Conversation {
  id: string;
  listingId?: string;
  listingTitle?: string;
  businessId?: string;
  partnerName: string;
  partnerAvatar?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: MessageItem[];
}

export interface AdCampaign {
  id: string;
  title: string;
  type: 'vetrina_home' | 'top_city' | 'category_spotlight' | 'discover_feed';
  cityId: string;
  targetCategory?: string;
  impressions: number;
  clicks: number;
  enquiries?: number;
  conversions?: number;
  budgetEur: number;
  dailyBudgetEur?: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
  bannerImage?: string;
  linkUrl: string;
  status?: 'active' | 'pending_review' | 'paused' | 'completed';
}

export interface ModerationReport {
  id: string;
  targetType: 'listing' | 'business' | 'message';
  targetId: string;
  targetTitle: string;
  reason: 'spam' | 'underage' | 'fake' | 'fraud' | 'copyright' | 'other';
  comment: string;
  reportedAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
