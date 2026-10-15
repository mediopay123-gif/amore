import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MainFeed } from './components/MainFeed';
import { BusinessSection } from './components/BusinessSection';
import { Footer } from './components/Footer';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { ListingDetailModal } from './components/ListingDetailModal';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { SpaBookingModal } from './components/SpaBookingModal';
import { PostAdModal } from './components/PostAdModal';
import { UserAuthModal } from './components/UserAuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AdvertiserCampaignModal } from './components/AdvertiserCampaignModal';
import { MessagesDrawer } from './components/MessagesDrawer';
import { AiSupportAssistant } from './components/AiSupportAssistant';
import { MobileAppGeoBar } from './components/MobileAppGeoBar';
import { ImmersiveDiscoverFeed } from './components/ImmersiveDiscoverFeed';
import { MerchantDashboardModal } from './components/MerchantDashboardModal';

const AppContent: React.FC = () => {
  const {
    activeListing,
    setActiveListing,
    activeBusiness,
    setActiveBusiness,
    isBookingModalOpen,
    setIsBookingModalOpen,
    isPostModalOpen,
    setIsPostModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAdminModalOpen,
    setIsAdminModalOpen,
    isMerchantDashboardOpen,
    setIsMerchantDashboardOpen,
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    isMessagesDrawerOpen,
    setIsMessagesDrawerOpen,
    viewMode,
    setViewMode,
  } = useApp();

  const [isAdPortalOpen, setIsAdPortalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8F5] text-[#202522] flex flex-col selection:bg-[#E8EFEA] selection:text-[#193C32] pb-16 md:pb-0">
      
      {/* 18+ Legal Age Verification Gateway */}
      <AgeVerificationModal />

      {/* Top Bar Navigation */}
      <Header onOpenAdPortal={() => setIsAdPortalOpen(true)} />

      {viewMode === 'discover' ? (
        /* TikTok-Style Immersive Vertical Media Feed (/it/discover/) */
        <ImmersiveDiscoverFeed
          onOpenListing={(listing) => setActiveListing(listing)}
          onOpenBusiness={(business) => setActiveBusiness(business)}
        />
      ) : (
        /* Standard Catalog & AI Search Experience */
        <>
          {/* Hero with ChatGPT-Style Clean AI Input & 4 Module Cards */}
          <HeroSection onOpenAdPortal={() => setIsAdPortalOpen(true)} />

          {/* Progressive Geolocation & Mobile App Radar Bar */}
          <MobileAppGeoBar
            onOpenPost={() => setIsPostModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenMessages={() => setIsMessagesDrawerOpen(true)}
          />

          {/* Classifieds Feed with Card Grid, Split View, and Map */}
          <main className="flex-1">
            <MainFeed
              onOpenListing={(listing) => setActiveListing(listing)}
              onOpenBusiness={(business) => setActiveBusiness(business)}
            />

            {/* Massage & Wellness SPA Directory Section */}
            <BusinessSection />
          </main>
        </>
      )}

      {/* Quiet Legal, SEO, and Navigation Footer */}
      <Footer />

      {/* Modals & Drawers */}
      {activeListing && (
        <ListingDetailModal
          listing={activeListing}
          onClose={() => setActiveListing(null)}
        />
      )}

      {activeBusiness && (
        <BusinessDetailModal
          business={activeBusiness}
          onClose={() => setActiveBusiness(null)}
          onOpenBooking={() => setIsBookingModalOpen(true)}
        />
      )}

      {isBookingModalOpen && activeBusiness && (
        <SpaBookingModal
          business={activeBusiness}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}

      {isPostModalOpen && (
        <PostAdModal onClose={() => setIsPostModalOpen(false)} />
      )}

      {isAuthModalOpen && (
        <UserAuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {isAdminModalOpen && (
        <AdminDashboardModal onClose={() => setIsAdminModalOpen(false)} />
      )}

      {isMerchantDashboardOpen && (
        <MerchantDashboardModal onClose={() => setIsMerchantDashboardOpen(false)} />
      )}

      {isAdPortalOpen && (
        <AdvertiserCampaignModal onClose={() => setIsAdPortalOpen(false)} />
      )}

      <MessagesDrawer />
      <AiSupportAssistant />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
