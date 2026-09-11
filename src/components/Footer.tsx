import React from 'react';
import { PageId } from '../types';
import { Moon, Heart, Shield, BookOpen, ExternalLink, Users, Eye } from 'lucide-react';
import { useVisitor } from '../context/VisitorContext';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { stats } = useVisitor();
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg border border-emerald-700">
                <span className="font-arabic text-xl">☪</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Centre of Islam</span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              An authentic, comprehensive digital sanctuary empowering Muslims worldwide with verifiable Quranic knowledge, Prophetic Hadith, educational syllabi across major boards, and reflective spiritual tools.
            </p>
            <div className="pt-2 text-xs text-amber-300/80 font-serif italic">
              "My Lord, increase me in knowledge." — Surah Ta-Ha (20:114)
            </div>
          </div>

          {/* Spiritual & Worship */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 text-emerald-400">
              Worship & Daily Practice
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('quran')} className="hover:text-white transition-colors">
                  Online Noble Quran
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('salah-counter')} className="hover:text-white transition-colors">
                  Monthly Salah Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tasbih')} className="hover:text-white transition-colors">
                  Digital Tasbih Counter
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calendar')} className="hover:text-white transition-colors">
                  Islamic Hijri Calendar
                </button>
              </li>
            </ul>
          </div>

          {/* Sacred Knowledge & Education */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 text-emerald-400">
              Knowledge & Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('quran')} className="hover:text-white transition-colors">
                  Online Noble Quran
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hadith')} className="hover:text-white transition-colors">
                  Hadith Collection
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('daily-quotes')} className="hover:text-white transition-colors">
                  Daily Islamic Quotes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('community-qa')} className="hover:text-white transition-colors">
                  Debates, Q&A & References
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('convert-guide')} className="hover:text-amber-300 text-amber-200/90 font-medium transition-colors">
                  Convert Guide (New Muslims)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('study-notes')} className="hover:text-white transition-colors">
                  Notes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('printables')} className="hover:text-white transition-colors">
                  Printable Charts & Posters
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 text-emerald-400">
              Centre & Policies
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Us & Mission
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Centre of Islam. All religious and educational resources are dedicated for public benefit.</p>
          
          {/* Real-time Visit Counter Badge */}
          <div className="flex items-center gap-3 bg-stone-800/80 border border-stone-700/60 rounded-full px-3.5 py-1 text-stone-300 text-[11px]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visits:</span>
              <strong className="text-white font-semibold">{stats.loading ? '...' : stats.totalVisits.toLocaleString()}</strong>
            </span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400">
              Today: <strong className="text-emerald-300">{stats.loading ? '...' : stats.todayVisits.toLocaleString()}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>May Allah accept all righteous intentions and efforts.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
