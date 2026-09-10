import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { QuranPage } from './pages/QuranPage';
import { CalendarPage } from './pages/CalendarPage';
import { HadithPage } from './pages/HadithPage';
import { DailyQuotesPage } from './pages/DailyQuotesPage';
import { PrintablesPage } from './pages/PrintablesPage';
import { CommunityQAPage } from './pages/CommunityQAPage';
import { StudyNotesPage } from './pages/StudyNotesPage';
import { ConvertGuidePage } from './pages/ConvertGuidePage';
import { MonthlySalahCounterPage } from './pages/MonthlySalahCounterPage';
import { TasbihCounterPage } from './pages/TasbihCounterPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { AdminPage } from './pages/AdminPage';

function AppContent() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const { isAuthModalOpen, closeAuthModal, openAuthModalWithNotice, authNoticeMessage } = useAuth();

  // Scroll to top whenever the active page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Handle URL hash navigation if user uses bookmarks or links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = [
        'home', 'quran', 'calendar', 'hadith',
        'daily-quotes', 'printables', 'community-qa', 'study-notes',
        'convert-guide', 'salah-counter', 'tasbih', 'about', 'privacy', 'terms', 'admin'
      ];
      if (validPages.includes(hash)) {
        setActivePage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.location.hash = page;
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'quran':
        return <QuranPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'hadith':
        return <HadithPage />;
      case 'daily-quotes':
        return <DailyQuotesPage />;
      case 'printables':
        return <PrintablesPage onNavigate={handleNavigate} />;
      case 'community-qa':
        return <CommunityQAPage />;
      case 'study-notes':
        return <StudyNotesPage onNavigate={handleNavigate} />;
      case 'convert-guide':
        return <ConvertGuidePage onNavigate={handleNavigate} />;
      case 'salah-counter':
        return <MonthlySalahCounterPage />;
      case 'tasbih':
        return <TasbihCounterPage />;
      case 'about':
        return <AboutUsPage onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsConditionsPage />;
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 selection:bg-emerald-800 selection:text-white">
      {/* Global Top Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenAuth={() => openAuthModalWithNotice()}
      />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {renderActivePage()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        noticeMessage={authNoticeMessage}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
