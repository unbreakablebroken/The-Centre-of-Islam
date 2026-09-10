import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  BookOpen, 
  Calendar as CalendarIcon, 
  Scroll, 
  Quote, 
  Printer, 
  MessageSquareQuote, 
  GraduationCap, 
  CalendarCheck, 
  Hash, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Moon, 
  Clock, 
  Info,
  Shield,
  FileText
} from 'lucide-react';
import { computePrayerTimes, getHijriDate } from '../utils/prayerTimes';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const { user, logout, setAuthModalOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hijriStr, setHijriStr] = useState('');
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string; time: string; remaining: string } | null>(null);

  useEffect(() => {
    const updateTimeData = () => {
      const hijri = getHijriDate();
      setHijriStr(hijri.formatted);

      const pt = computePrayerTimes();
      const mins = pt.nextPrayer.remainingMinutes;
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      setNextPrayerInfo({
        name: pt.nextPrayer.name,
        time: pt.nextPrayer.time,
        remaining: `${hours > 0 ? `${hours}h ` : ''}${remainingMins}m`
      });
    };

    updateTimeData();
    const interval = setInterval(updateTimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Moon className="w-4 h-4" /> },
    { id: 'prayer-times', label: 'Prayer Times', icon: <Clock className="w-4 h-4" /> },
    { id: 'quran', label: 'Online Quran', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'calendar', label: 'Islamic Calendar', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'hadith', label: 'Hadith', icon: <Scroll className="w-4 h-4" /> },
    { id: 'daily-quotes', label: 'Daily Quotes', icon: <Quote className="w-4 h-4" /> },
    { id: 'printables', label: 'Charts & Posters', icon: <Printer className="w-4 h-4" /> },
    { id: 'community-qa', label: 'Debates & Q&A', icon: <MessageSquareQuote className="w-4 h-4" />, badge: 'Discuss' },
    { id: 'study-notes', label: 'Board Notes', icon: <GraduationCap className="w-4 h-4" />, badge: 'IGCSE • CBSE' },
    { id: 'salah-counter', label: 'Salah Counter', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'tasbih', label: 'Tasbih', icon: <Hash className="w-4 h-4" /> }
  ];

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner with Hijri Date and Prayer Countdown */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-amber-300">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            {hijriStr || '1448 AH'}
          </span>
          <span className="hidden sm:inline text-emerald-400/60">•</span>
          <span className="hidden sm:inline text-emerald-200">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>

        {nextPrayerInfo && (
          <div className="flex items-center gap-2 font-medium">
            <span className="text-emerald-300">Next Prayer:</span>
            <span className="text-white bg-emerald-900/80 px-2 py-0.5 rounded-md border border-emerald-800">
              {nextPrayerInfo.name} at {nextPrayerInfo.time} ({nextPrayerInfo.remaining} left)
            </span>
          </div>
        )}
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-950 text-amber-300 flex items-center justify-center font-bold text-lg shadow-sm border border-emerald-700/50 group-hover:scale-105 transition-transform">
              <span className="font-arabic text-xl leading-none">☪</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-stone-900 flex items-center gap-1.5">
                Centre of Islam
              </span>
              <p className="text-[11px] text-emerald-800 font-medium tracking-wide uppercase">
                Authentic Guidance & Study
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-700 hover:text-emerald-900 hover:bg-stone-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded-full font-bold uppercase ${
                        isActive ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Auth Action & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-stone-100 py-1 px-2.5 rounded-xl border border-stone-200">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full border border-stone-300"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-medium text-stone-800 hidden md:inline max-w-[120px] truncate">
                    {user.displayName}
                  </span>
                </div>
                <button
                  id="user-logout-btn"
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="open-auth-btn"
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Bar for Quick Navigation on Large Screens */}
      <div className="hidden lg:flex xl:hidden border-t border-stone-100 px-4 py-2 overflow-x-auto gap-2 bg-stone-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activePage === item.id
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-1 shadow-lg animate-fadeIn">
          <div className="grid grid-cols-2 gap-1.5 py-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-900 text-amber-300' : 'bg-white text-emerald-800'}`}>
                    {item.icon}
                  </div>
                  <div className="truncate">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="block text-[10px] text-amber-400 font-normal">{item.badge}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs text-stone-500">
            <button onClick={() => handleNavClick('about')} className="hover:text-emerald-800 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> About Us
            </button>
            <button onClick={() => handleNavClick('privacy')} className="hover:text-emerald-800 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Privacy
            </button>
            <button onClick={() => handleNavClick('terms')} className="hover:text-emerald-800 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Terms
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
