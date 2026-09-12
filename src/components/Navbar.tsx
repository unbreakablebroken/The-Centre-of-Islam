import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
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
  ShieldCheck,
  Info,
  Shield,
  FileText,
  Home,
  Sparkles,
  HeartHandshake,
  Lock
} from 'lucide-react';
import { getHijriDate } from '../utils/prayerTimes';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, onOpenAuth }) => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hijriStr, setHijriStr] = useState('');

  useEffect(() => {
    const today = new Date();
    const h = getHijriDate(today);
    setHijriStr(`${h.day} ${h.monthName} ${h.year} AH`);
  }, []);

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'quran', label: 'Online Quran', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'hadith', label: 'Hadith', icon: <Scroll className="w-4 h-4" /> },
    { id: 'daily-quotes', label: 'Daily Quotes', icon: <Quote className="w-4 h-4" /> },
    { id: 'printables', label: 'Charts & Posters', icon: <Printer className="w-4 h-4" /> },
    { id: 'community-qa', label: 'Debates & Q&A', icon: <MessageSquareQuote className="w-4 h-4" />, badge: 'Discuss' },
    { id: 'study-notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'convert-guide', label: 'Convert Guide', icon: <HeartHandshake className="w-4 h-4" /> },
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
      {/* Top Banner with Hijri Date & Bismillah */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>{hijriStr || '1448 AH'}</span>
          <span className="hidden md:inline text-emerald-500">•</span>
          <span className="hidden md:inline text-emerald-200">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <button
              id="top-admin-indicator-btn"
              onClick={() => handleNavClick('admin')}
              className="text-[11px] bg-amber-400 text-emerald-950 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Panel</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('admin')}
              className="text-[11px] text-emerald-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Admin Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Title */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-emerald-700/50 group-hover:scale-105 transition-transform shrink-0 bg-emerald-950 flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Centre of Islam Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 leading-tight whitespace-nowrap">
                Centre of Islam
              </span>
              <span className="text-[10px] sm:text-[11px] text-emerald-800 font-semibold tracking-wider uppercase leading-none whitespace-nowrap mt-0.5">
                Authentic Knowledge & Guidance
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
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

            {/* Admin Nav Button - Always accessible for the site owner */}
            <button
              id="nav-link-admin"
              onClick={() => handleNavClick('admin')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'admin'
                  ? 'bg-amber-500 text-stone-950 shadow-xs ring-1 ring-amber-600'
                  : isAdmin
                  ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title="Site Administration & Spam Moderation"
            >
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-stone-400" />
              )}
              <span>{isAdmin ? 'Admin Portal' : 'Admin'}</span>
            </button>
          </nav>

          {/* User Auth Action & Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-2 bg-stone-100 py-1 px-2.5 rounded-xl border border-stone-200">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full border border-stone-300 shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-medium text-stone-800 hidden md:inline max-w-[100px] truncate">
                    {user.displayName}
                  </span>
                </div>
                <button
                  id="user-logout-btn"
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isAdmin ? (
              <button
                id="admin-active-badge"
                onClick={() => handleNavClick('admin')}
                className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Admin Unlocked</span>
              </button>
            ) : null}

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 focus:outline-none shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 py-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-900 text-amber-300' : 'bg-white text-emerald-800 shadow-2xs'}`}>
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

            {/* Admin item in mobile menu */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-all col-span-2 ${
                activePage === 'admin'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-amber-50/80 text-amber-900 border border-amber-200'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-amber-200 text-amber-950">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold">Admin Panel</span>
                <span className="block text-[10px] text-amber-800 font-normal">Manage Charts, Posters & Notes</span>
              </div>
            </button>
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
