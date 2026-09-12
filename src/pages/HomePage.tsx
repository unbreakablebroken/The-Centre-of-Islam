import React from 'react';
import { PageId } from '../types';
import { 
  Clock, 
  BookOpen, 
  Calendar, 
  Scroll, 
  Quote, 
  Printer, 
  MessageSquareQuote, 
  GraduationCap, 
  CalendarCheck, 
  Hash, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  BookMarked,
  FileText,
  HeartHandshake
} from 'lucide-react';
import { DAILY_QUOTES } from '../data/quotesData';
import { HADITH_COLLECTION } from '../data/hadithData';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const featuredQuote = DAILY_QUOTES[0];
  const featuredHadith = HADITH_COLLECTION[0];

  const features = [
    {
      id: 'quran' as PageId,
      title: 'Online Quran',
      desc: 'Complete 114 Surahs with authentic Arabic Uthmani script, English translation, and audio recitation.',
      icon: <BookOpen className="w-5 h-5 text-emerald-700" />,
      tag: '114 Surahs'
    },
    {
      id: 'calendar' as PageId,
      title: 'Islamic Calendar',
      desc: 'Dual Hijri-Gregorian calendar, date conversion tool, and sacred Islamic historical events.',
      icon: <Calendar className="w-5 h-5 text-emerald-700" />,
      tag: '1448 AH'
    },
    {
      id: 'hadith' as PageId,
      title: 'Hadith Collection',
      desc: 'Authentic traditions from Sahih al-Bukhari, Sahih Muslim, 40 Hadith Nawawi, and Riyad as-Salihin.',
      icon: <Scroll className="w-5 h-5 text-emerald-700" />,
      tag: 'Authentic Sources'
    },
    {
      id: 'daily-quotes' as PageId,
      title: 'Daily Quotes',
      desc: 'Inspiring Quranic verses and Prophetic wisdom categorized by patience, gratitude, and good character.',
      icon: <Quote className="w-5 h-5 text-emerald-700" />,
      tag: 'Daily Inspiration'
    },
    {
      id: 'printables' as PageId,
      title: 'Printable Charts & Posters',
      desc: 'Ready-to-print guides for Wudu, Rak\'ah breakdown, Asma-ul-Husna, and daily sunnah duas.',
      icon: <Printer className="w-5 h-5 text-emerald-700" />,
      tag: 'Print Ready'
    },
    {
      id: 'community-qa' as PageId,
      title: 'Debates & Q&A Forum',
      desc: 'Ask questions, debate perspectives, and provide verified Quranic and Hadith citations.',
      icon: <MessageSquareQuote className="w-5 h-5 text-emerald-700" />,
      tag: 'Verified Discourse'
    },
    {
      id: 'study-notes' as PageId,
      title: 'Notes',
      desc: 'Comprehensive Islamic study notes, summaries, downloadable reference documents, and study guides.',
      icon: <FileText className="w-5 h-5 text-emerald-700" />,
      tag: 'Study & Reference'
    },
    {
      id: 'convert-guide' as PageId,
      title: 'Convert Guide',
      desc: 'A humble, gentle, step-by-step welcoming guide with Wudu, prayer basics, and practical answers for new Muslims.',
      icon: <HeartHandshake className="w-5 h-5 text-emerald-700" />,
      tag: 'New Muslims'
    },
    {
      id: 'salah-counter' as PageId,
      title: 'Salah Per Month Counter',
      desc: 'Interactive monthly prayer habit tracker with streak analytics, completion scores, and cloud sync.',
      icon: <CalendarCheck className="w-5 h-5 text-emerald-700" />,
      tag: 'Habit Builder'
    },
    {
      id: 'tasbih' as PageId,
      title: 'Digital Tasbih Counter',
      desc: 'Interactive Dhikr bead counter with haptic feedback, custom targets, and authentic adhkar presets.',
      icon: <Hash className="w-5 h-5 text-emerald-700" />,
      tag: '33 / 99 Adhkar'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-10 md:p-12 border border-emerald-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-md border border-emerald-500/40 shrink-0 bg-emerald-950">
              <img
                src="/logo.jpg"
                alt="Centre of Islam Emblem"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/80 text-amber-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Welcome to Centre of Islam</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight text-white">
              Authentic Knowledge, Worship & Scholarly Discourse
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed">
              Your digital Islamic sanctuary: Explore the Holy Quran, authentic Hadith collections, comprehensive study notes and documents, monthly Salah tracking, and collaborative community debates backed by genuine citations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-read-quran-btn"
              onClick={() => onNavigate('quran')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer text-xs sm:text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Online Quran</span>
            </button>
            <button
              id="hero-board-notes-btn"
              onClick={() => onNavigate('study-notes')}
              className="px-5 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-medium rounded-xl border border-emerald-700 flex items-center gap-2 transition-colors cursor-pointer text-xs sm:text-sm"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Notes & Materials</span>
            </button>
            <button
              id="hero-convert-guide-btn"
              onClick={() => onNavigate('convert-guide')}
              className="px-5 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-200 font-medium rounded-xl border border-emerald-600 flex items-center gap-2 transition-colors cursor-pointer text-xs sm:text-sm"
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              <span>Convert Guide</span>
            </button>
            <button
              id="hero-community-qa-btn"
              onClick={() => onNavigate('community-qa')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 flex items-center gap-2 transition-colors cursor-pointer text-xs sm:text-sm"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Ask & Debate Questions</span>
            </button>
          </div>
        </div>

        {/* Decorative Arabic Calligraphy snippet */}
        <div className="mt-8 pt-6 border-t border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-emerald-200/90 text-sm">
          <div className="font-arabic text-xl sm:text-2xl text-amber-300/90 font-medium">
            رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
          </div>
          <div className="text-xs text-emerald-300/80">
            "Our Lord, give us in this world that which is good and in the Hereafter that which is good..." (2:201)
          </div>
        </div>
      </section>

      {/* Humble Welcome for New Converts & Seekers */}
      <section className="bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-amber-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 shadow-2xs">
            <HeartHandshake className="w-6 h-6 text-emerald-900" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              New to Islam or Seeking Knowledge?
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              A Warm, Humble Welcome to Our Convert Guide
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              Congratulations on taking this noble step! We designed a gentle, zero-stress guide covering the Shahada, beginner-friendly prayer steps, halal living, handling family relationships, and common questions.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('convert-guide')}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>Explore Convert Guide</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Featured Quote & Hadith of the Day */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Quote Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-200 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
                <Quote className="w-4 h-4" />
                <span>Daily Quranic Wisdom</span>
              </div>
              <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
                {featuredQuote.category}
              </span>
            </div>
            {featuredQuote.arabic && (
              <p className="font-arabic text-xl text-stone-800 text-right mb-3 leading-loose">
                {featuredQuote.arabic}
              </p>
            )}
            <blockquote className="text-stone-700 italic text-base leading-relaxed mb-4">
              "{featuredQuote.quote}"
            </blockquote>
          </div>
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-emerald-800">{featuredQuote.source}</span>
            <button
              onClick={() => onNavigate('daily-quotes')}
              className="text-stone-600 hover:text-emerald-800 flex items-center gap-1 font-semibold"
            >
              More Quotes <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Daily Hadith Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-200 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
                <Scroll className="w-4 h-4" />
                <span>Prophetic Hadith</span>
              </div>
              <span className="text-[11px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded-full font-medium border border-amber-200">
                {featuredHadith.grade}
              </span>
            </div>
            {featuredHadith.arabicText && (
              <p className="font-arabic text-lg text-stone-800 text-right mb-3 leading-loose">
                {featuredHadith.arabicText}
              </p>
            )}
            <p className="text-stone-700 text-sm leading-relaxed mb-3">
              {featuredHadith.englishText}
            </p>
            <p className="text-xs text-stone-500 italic mb-2">
              {featuredHadith.narrator}
            </p>
          </div>
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-emerald-800">{featuredHadith.book} (Hadith {featuredHadith.hadithNumber})</span>
            <button
              onClick={() => onNavigate('hadith')}
              className="text-stone-600 hover:text-emerald-800 flex items-center gap-1 font-semibold"
            >
              Browse Hadith <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              Explore All Features
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Every dedicated tool and resource has its own comprehensive page.
            </p>
          </div>
          <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 w-fit">
            10 Dedicated Islamic Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => (
            <div
              key={feat.id}
              id={`feature-card-${feat.id}`}
              onClick={() => onNavigate(feat.id)}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    {React.cloneElement(feat.icon, {
                      className: 'w-5 h-5 text-emerald-800 group-hover:text-white transition-colors'
                    })}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium bg-stone-50 px-2 py-0.5 rounded-md border border-stone-100">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
                <span>Open {feat.title}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Educational Board Highlight */}
      <section className="bg-stone-900 text-white rounded-3xl p-8 border border-stone-800 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-800">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Curriculum Study Notes</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            Preparing for Islamic Studies Exams?
          </h3>
          <p className="text-stone-300 text-sm leading-relaxed">
            Access revision summaries, key definitions, model questions, and scoring schemes structured precisely for <strong className="text-white">IGCSE (Cambridge 0493/2058)</strong>, <strong className="text-white">CBSE</strong>, <strong className="text-white">NCERT</strong>, and <strong className="text-white">SSC</strong> state education boards.
          </p>
        </div>
        <button
          id="cta-board-notes-btn"
          onClick={() => onNavigate('study-notes')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap shadow-md"
        >
          <span>View All Study Notes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
