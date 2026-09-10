import React from 'react';
import { PageId } from '../types';
import { Moon, Heart, Shield, BookOpen, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
              An authentic, comprehensive digital sanctuary empowering Muslims worldwide with verifiable Quranic knowledge, Prophetic Hadith, accurate prayer timings, Islamic education for major boards, and reflective spiritual tools.
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
                <button onClick={() => onNavigate('prayer-times')} className="hover:text-white transition-colors">
                  Prayer Times & Qibla
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
                <button onClick={() => onNavigate('study-notes')} className="hover:text-white transition-colors">
                  Board Notes (IGCSE • CBSE)
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
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Centre of Islam. All religious and educational resources are dedicated for public benefit.</p>
          <div className="flex items-center gap-2">
            <span>May Allah accept all righteous intentions and efforts.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
