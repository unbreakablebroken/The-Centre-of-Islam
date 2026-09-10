import React from 'react';
import { PageId } from '../types';
import { 
  Building2, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  HeartHandshake, 
  Mail, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AboutUsPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-emerald-800 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-amber-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>About Centre of Islam</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Dedicated to Authentic Knowledge, Worship & Scholarly Dialogue
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed">
            Centre of Islam was founded to serve as an uncompromising digital sanctuary for Muslims, students of knowledge, and sincere truth-seekers worldwide. We combine classical scholarly rigor with modern technological accessibility.
          </p>
        </div>
      </section>

      {/* Core Mission & Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            Sacred Verification
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every verse, hadith, ruling citation, and academic syllabus note on our platform is sourced from authoritative classical texts (Sahih al-Bukhari, Sahih Muslim, standard tafasir, and official board publications).
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            Adab in Discourse
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Our Q&A and debate forum requires user authentication and citation of primary Islamic references to elevate conversation above sectarian rancor, upholding the prophetic etiquette (Adab al-Ikhtilaf).
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            Academic Board Excellence
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            We provide structured syllabi, model answers, and revision guides specifically tailored for IGCSE (Cambridge 0493/2058), CBSE, NCERT, and State SSC secondary board students worldwide.
          </p>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xs space-y-6">
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
          Our Scholarly Methodology (Manhaj)
        </h2>
        <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
          <p>
            At <strong>Centre of Islam</strong>, our theological foundation rests upon the Ahl al-Sunnah wal-Jama'ah methodology: adhering strictly to the Holy Quran, the authentic Sunnah of Prophet Muhammad (ﷺ), and the consensus of classical jurists (Ijma') and analogical reasoning (Qiyas) across the recognized schools of jurisprudence (Hanafi, Maliki, Shafi'i, and Hanbali).
          </p>
          <p>
            We recognize that modern life poses novel challenges. Therefore, for contemporary questions, our contributors cite resolutions from internationally recognized bodies including the International Islamic Fiqh Academy (IIFA), the European Council for Fatwa and Research (ECFR), and classical treatises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="text-stone-900 block">Strict Citation Standards:</strong>
              Claims must be supported by book, chapter, and hadith or ayah numbers.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="text-stone-900 block">Non-Profit & Public Benefit:</strong>
              All charts, study notes, audio recitations, and daily tools remain free for all learners.
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch Card */}
      <section className="bg-stone-50 rounded-3xl p-8 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-stone-900">
            Have Questions or Corrections?
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">
            Our editorial board welcomes feedback, scholarly peer-reviews, and academic notes contributions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('community-qa')}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Visit Community Forum
          </button>
        </div>
      </section>
    </div>
  );
};
