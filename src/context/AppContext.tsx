import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  City,
  Category,
  Listing,
  Business,
  BookingRequest,
  Conversation,
  AdCampaign,
  ModerationReport,
  ViewMode,
} from '../types';
import {
  INITIAL_CITIES,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_BUSINESSES,
  INITIAL_CAMPAIGNS,
} from '../data/initialData';
import { calculateDistanceKm, Coordinates, requestCurrentLocation } from '../utils/geo';

interface AppContextType {
  // Cities & Categories
  cities: City[];
  categories: Category[];
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  selectedCategory: string; // 'all' or category id
  setSelectedCategory: (catId: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (sub: string) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: 'recommended' | 'distance' | 'newest' | 'price_asc' | 'price_desc';
  setSortBy: (sort: 'recommended' | 'distance' | 'newest' | 'price_asc' | 'price_desc') => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (val: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;

  // Geolocation & Radius
  userLocation: Coordinates | null;
  locationStatus: 'idle' | 'requesting' | 'granted' | 'denied';
  locationError: string | null;
  searchRadiusKm: number; // 1, 5, 10, 25, 50
  setSearchRadiusKm: (radius: number) => void;
  requestUserLocation: () => Promise<void>;
  clearUserLocation: () => void;

  // View Mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Data
  listings: Listing[];
  businesses: Business[];
  filteredListings: Listing[];
  filteredBusinesses: Business[];
  campaigns: AdCampaign[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  toggleLikeListing: (id: string) => void;
  addCampaign: (campaign: Omit<AdCampaign, 'id' | 'impressions' | 'clicks'>) => void;
  updateCampaign: (id: string, updates: Partial<AdCampaign>) => void;
  startConversationWithListing: (listing: Listing, initialText?: string) => void;
  startConversationWithBusiness: (business: Business, initialText?: string) => void;

  // Active / Detailed Item Modals
  activeListing: Listing | null;
  setActiveListing: (listing: Listing | null) => void;
  activeBusiness: Business | null;
  setActiveBusiness: (business: Business | null) => void;

  // User & Auth
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];

  // Actions
  addListing: (newListing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'contactsCount'>) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  addBookingRequest: (req: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: 'confirmed' | 'rejected' | 'cancelled') => void;
  bookingRequests: BookingRequest[];

  // Chat & Messaging
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  sendMessage: (convId: string, text: string) => void;
  startConversation: (listingId: string, partnerName: string, initialMessage?: string) => Conversation;

  // Reports & Moderation
  reports: ModerationReport[];
  submitReport: (targetType: 'listing' | 'business' | 'message', targetId: string, targetTitle: string, reason: ModerationReport['reason'], comment: string) => void;
  resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;

  // Age verification gate
  isAgeVerified: boolean;
  verifyAge: () => void;

  // UI Drawer / Modals
  isPostModalOpen: boolean;
  setIsPostModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isMerchantDashboardOpen: boolean;
  setIsMerchantDashboardOpen: (open: boolean) => void;
  isMessagesDrawerOpen: boolean;
  setIsMessagesDrawerOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cities & Categories
  const [cities] = useState<City[]>(INITIAL_CITIES);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [selectedCity, setSelectedCity] = useState<City>(() => {
    const saved = localStorage.getItem('amico_city');
    if (saved) {
      const found = INITIAL_CITIES.find((c) => c.id === saved);
      if (found) return found;
    }
    return INITIAL_CITIES[0]; // Bologna by default
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Tutte');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'distance' | 'newest' | 'price_asc' | 'price_desc'>('recommended');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Geolocation
  const [userLocation, setUserLocation] = useState<Coordinates | null>(() => {
    const saved = localStorage.getItem('amico_user_location');
    return saved ? JSON.parse(saved) : null;
  });
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(25);

  // View Mode
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Age verification state (Italian adult classifieds standard)
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    return localStorage.getItem('amico_age_verified') === 'true';
  });

  const verifyAge = () => {
    setIsAgeVerified(true);
    localStorage.setItem('amico_age_verified', 'true');
  };

  // Listings state with localStorage sync
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('amico_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  useEffect(() => {
    localStorage.setItem('amico_listings', JSON.stringify(listings));
  }, [listings]);

  // Businesses state
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('amico_businesses');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
  });

  useEffect(() => {
    localStorage.setItem('amico_businesses', JSON.stringify(businesses));
  }, [businesses]);

  // Campaigns with local storage
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(() => {
    const saved = localStorage.getItem('amico_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  useEffect(() => {
    localStorage.setItem('amico_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('amico_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('amico_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Auth & Roles
  const [allUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('amico_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // default as Sofia (advertiser) or switchable
  });

  useEffect(() => {
    localStorage.setItem('amico_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Modals & Drawers
  const [activeListing, setActiveListing] = useState<Listing | null>(null);
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMerchantDashboardOpen, setIsMerchantDashboardOpen] = useState(false);
  const [isMessagesDrawerOpen, setIsMessagesDrawerOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Bookings
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(() => {
    const saved = localStorage.getItem('amico_bookings');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'bk_demo_1',
            businessId: 'biz_bo_01',
            businessName: 'Oasi Serena SPA & Massaggi Olistici',
            serviceId: 'srv_01',
            serviceName: 'Massaggio Rilassante Antistress con Oli Caldi',
            priceEur: 60,
            customerName: 'Matteo R.',
            customerPhone: '+39 347 889 0012',
            customerEmail: 'matteo.r@gmail.com',
            date: '2026-03-28',
            timeSlot: '16:00',
            notes: 'Preferenza per massaggio con pressione media.',
            status: 'confirmed',
            createdAt: '2026-03-24T10:00:00Z',
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('amico_bookings', JSON.stringify(bookingRequests));
  }, [bookingRequests]);

  const addBookingRequest = (req: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: BookingRequest = {
      ...req,
      id: `bk_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setBookingRequests((prev) => [newReq, ...prev]);
  };

  const updateBookingStatus = (id: string, status: 'confirmed' | 'rejected' | 'cancelled') => {
    setBookingRequests((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('amico_conversations');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'conv_demo_1',
            listingId: 'list_bo_01',
            listingTitle: 'Sofia – Elegante e riservata in centro',
            partnerName: 'Sofia V.',
            partnerAvatar: '/src/assets/images/verified_profile_preview_1792082231358.jpg',
            lastMessage: 'Buonasera, ricevo domani dalle 15:00 in poi. Ti aspetto!',
            lastTimestamp: 'Ieri, 19:45',
            unreadCount: 1,
            messages: [
              {
                id: 'm1',
                senderId: 'client',
                senderName: 'Tu',
                text: 'Salve Sofia, sei disponibile domani pomeriggio per un incontro in centro?',
                timestamp: 'Ieri, 19:30',
                isMine: true,
              },
              {
                id: 'm2',
                senderId: 'user_sofia',
                senderName: 'Sofia V.',
                text: 'Buonasera, ricevo domani dalle 15:00 in poi. Ti aspetto!',
                timestamp: 'Ieri, 19:45',
                isMine: false,
              },
            ],
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('amico_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const sendMessage = (convId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text.trim(),
      timestamp: 'Adesso',
      isMine: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastTimestamp: 'Adesso',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    if (activeConversation && activeConversation.id === convId) {
      setActiveConversation((prev) =>
        prev
          ? {
              ...prev,
              lastMessage: text.trim(),
              lastTimestamp: 'Adesso',
              messages: [...prev.messages, newMsg],
            }
          : null
      );
    }
  };

  const startConversation = (listingId: string, partnerName: string, initialMessage?: string): Conversation => {
    const existing = conversations.find((c) => c.listingId === listingId);
    if (existing) {
      if (initialMessage) {
        sendMessage(existing.id, initialMessage);
      }
      setActiveConversation(existing);
      setIsMessagesDrawerOpen(true);
      return existing;
    }

    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      listingId,
      listingTitle: partnerName,
      partnerName,
      lastMessage: initialMessage || 'Nuova conversazione avviata',
      lastTimestamp: 'Adesso',
      unreadCount: 0,
      messages: initialMessage
        ? [
            {
              id: `msg_${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              text: initialMessage,
              timestamp: 'Adesso',
              isMine: true,
            },
          ]
        : [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversation(newConv);
    setIsMessagesDrawerOpen(true);
    return newConv;
  };

  // Moderation reports
  const [reports, setReports] = useState<ModerationReport[]>(() => {
    const saved = localStorage.getItem('amico_reports');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'rep_01',
            targetType: 'listing',
            targetId: 'list_bo_04',
            targetTitle: 'Alessandro – Ragazzo atletico',
            reason: 'spam',
            comment: 'Verificare autenticità del profilo telegram.',
            reportedAt: '2026-03-24T12:00:00Z',
            status: 'pending',
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('amico_reports', JSON.stringify(reports));
  }, [reports]);

  const submitReport = (
    targetType: 'listing' | 'business' | 'message',
    targetId: string,
    targetTitle: string,
    reason: ModerationReport['reason'],
    comment: string
  ) => {
    const rep: ModerationReport = {
      id: `rep_${Date.now()}`,
      targetType,
      targetId,
      targetTitle,
      reason,
      comment,
      reportedAt: new Date().toISOString(),
      status: 'pending',
    };
    setReports((prev) => [rep, ...prev]);
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
  };

  // Real location request
  const requestUserLocation = async () => {
    setLocationStatus('requesting');
    setLocationError(null);
    try {
      const coords = await requestCurrentLocation();
      setUserLocation(coords);
      setLocationStatus('granted');
      localStorage.setItem('amico_user_location', JSON.stringify(coords));

      // Find closest city
      let closestCity = cities[0];
      let minDistance = Infinity;
      cities.forEach((city) => {
        const d = calculateDistanceKm(coords.lat, coords.lng, city.lat, city.lng);
        if (d < minDistance) {
          minDistance = d;
          closestCity = city;
        }
      });
      setSelectedCity(closestCity);
      localStorage.setItem('amico_city', closestCity.id);
    } catch (err: unknown) {
      setLocationStatus('denied');
      setLocationError(err instanceof Error ? err.message : 'Errore posizione.');
    }
  };

  const clearUserLocation = () => {
    setUserLocation(null);
    setLocationStatus('idle');
    localStorage.removeItem('amico_user_location');
  };

  // Listing creation & mutations
  const addListing = (
    newListing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'contactsCount'>
  ) => {
    const now = new Date().toISOString();
    const listing: Listing = {
      ...newListing,
      id: `list_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      viewsCount: 1,
      contactsCount: 0,
    };
    setListings((prev) => [listing, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
    );
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const toggleLikeListing = (id: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isLiked = !item.isLiked;
          const currentLikes = item.likesCount ?? 0;
          const nextLikes = isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
          return { ...item, isLiked, likesCount: nextLikes };
        }
        return item;
      })
    );
  };

  const addCampaign = (
    newCamp: Omit<AdCampaign, 'id' | 'impressions' | 'clicks'>
  ) => {
    const camp: AdCampaign = {
      ...newCamp,
      id: `camp_${Date.now()}`,
      impressions: 1,
      clicks: 0,
      enquiries: 0,
      conversions: 0,
      active: true,
      status: 'active',
    };
    setCampaigns((prev) => [camp, ...prev]);
  };

  const updateCampaign = (id: string, updates: Partial<AdCampaign>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const startConversationWithListing = (listing: Listing, initialText?: string) => {
    startConversation(
      listing.id,
      listing.authorName,
      initialText || `Salve ${listing.authorName}, ho visto il tuo annuncio su AMICA: "${listing.title.slice(0, 45)}..." e vorrei maggiori informazioni.`
    );
  };

  const startConversationWithBusiness = (business: Business, initialText?: string) => {
    startConversation(
      business.id,
      business.name,
      initialText || `Salve ${business.name}, vorrei richiedere informazioni sui vostri servizi e disponibilità.`
    );
  };

  // Filter listings based on current selections and calculate exact real distances
  const filteredListings = listings
    .filter((item) => {
      // Must be active unless admin or owner
      if (item.status !== 'active' && currentUser.role !== 'admin' && item.authorId !== currentUser.id) {
        return false;
      }

      // City filter (if user has active geolocation with radius, check km; otherwise match city)
      if (userLocation) {
        const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, item.lat, item.lng);
        if (dist > searchRadiusKm) return false;
      } else {
        if (selectedCity && item.cityId !== selectedCity.id) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (item.categoryId !== selectedCategory) return false;
      }

      // Subcategory filter
      if (selectedSubcategory && selectedSubcategory !== 'Tutte' && selectedSubcategory !== 'Tutti') {
        if (item.subcategoryId !== selectedSubcategory) return false;
      }

      // Verified only
      if (verifiedOnly && !item.verified) return false;

      // Price filter (if has price)
      if (item.ratePerHour && (item.ratePerHour < priceRange[0] || item.ratePerHour > priceRange[1])) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesDistrict = item.district.toLowerCase().includes(q);
        const matchesAuthor = item.authorName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesDistrict && !matchesAuthor) return false;
      }

      return true;
    })
    .map((item) => {
      // Attach calculated distance
      const refLat = userLocation ? userLocation.lat : selectedCity.lat;
      const refLng = userLocation ? userLocation.lng : selectedCity.lng;
      const dist = calculateDistanceKm(refLat, refLng, item.lat, item.lng);
      return { ...item, distanceKm: dist };
    })
    .sort((a, b) => {
      // Promotion priority first
      if (a.promotionTier === 'top_city' && b.promotionTier !== 'top_city') return -1;
      if (b.promotionTier === 'top_city' && a.promotionTier !== 'top_city') return 1;

      if (sortBy === 'distance') {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price_asc') {
        return (a.ratePerHour || 0) - (b.ratePerHour || 0);
      }
      if (sortBy === 'price_desc') {
        return (b.ratePerHour || 0) - (a.ratePerHour || 0);
      }
      // Recommended: top promotion, then views/verified, then newest
      if (a.promotionTier !== 'none' && b.promotionTier === 'none') return -1;
      if (b.promotionTier !== 'none' && a.promotionTier === 'none') return 1;
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Filter businesses
  const filteredBusinesses = businesses.filter((b) => {
    if (selectedCity && b.cityId !== selectedCity.id) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.district.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AppContext.Provider
      value={{
        cities,
        categories,
        selectedCity,
        setSelectedCity: (city) => {
          setSelectedCity(city);
          localStorage.setItem('amico_city', city.id);
        },
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        verifiedOnly,
        setVerifiedOnly,
        priceRange,
        setPriceRange,
        userLocation,
        locationStatus,
        locationError,
        searchRadiusKm,
        setSearchRadiusKm,
        requestUserLocation,
        clearUserLocation,
        viewMode,
        setViewMode,
        listings,
        businesses,
        filteredListings,
        filteredBusinesses,
        campaigns,
        favorites,
        toggleFavorite,
        activeListing,
        setActiveListing,
        activeBusiness,
        setActiveBusiness,
        currentUser,
        setCurrentUser,
        allUsers,
        addListing,
        updateListing,
        deleteListing,
        addBookingRequest,
        updateBookingStatus,
        bookingRequests,
        conversations,
        activeConversation,
        setActiveConversation,
        sendMessage,
        startConversation,
        reports,
        submitReport,
        resolveReport,
        isAgeVerified,
        verifyAge,
        isPostModalOpen,
        setIsPostModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isMerchantDashboardOpen,
        setIsMerchantDashboardOpen,
        isMessagesDrawerOpen,
        setIsMessagesDrawerOpen,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        toggleLikeListing,
        addCampaign,
        updateCampaign,
        startConversationWithListing,
        startConversationWithBusiness,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
