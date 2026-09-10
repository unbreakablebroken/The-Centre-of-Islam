import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  BookOpen, 
  Compass, 
  CalendarCheck, 
  Printer, 
  ChevronDown, 
  ChevronUp, 
  MessageSquareQuote, 
  HelpCircle, 
  Sun, 
  ShieldCheck, 
  Smile, 
  ArrowRight,
  Info,
  Check,
  Award,
  Share2
} from 'lucide-react';

interface ConvertGuidePageProps {
  onNavigate: (page: PageId) => void;
}

export const ConvertGuidePage: React.FC<ConvertGuidePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'welcome' | 'first-steps' | 'prayer' | 'lifestyle' | 'common-questions' | 'glossary'>('welcome');
  const [expandedFaq, setExpandedFaq] = useState<Record<string, boolean>>({
    'mistakes-prayer': true,
    'family-reaction': false,
    'changing-name': false,
    'feeling-overwhelmed': false
  });

  // Local checklist state for new converts
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('coi_convert_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleCheckItem = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    try {
      localStorage.setItem('coi_convert_checklist', JSON.stringify(updated));
    } catch {}
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Humble & Congratulatory Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-10 shadow-lg border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-bold border border-emerald-700/60 shadow-xs">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Mabrook • Welcome to the Family of Islam</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-serif text-amber-50">
            Welcome Home, Dear Brother or Sister
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            From the bottom of our hearts, we congratulate you on embracing Islam. By the will and grace of Allah, you have made the most beautiful decision of your life. Every single past mistake has been washed completely clean; you stand before your Creator with a pure, pristine slate.
          </p>

          <div className="p-4 bg-emerald-900/60 rounded-2xl border border-emerald-700/50 backdrop-blur-sm space-y-2">
            <p className="font-arabic text-xl text-amber-200 text-right leading-loose">
              إِنَّ الدِّينَ يُسْرٌ ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ
            </p>
            <p className="text-xs text-emerald-200 italic">
              "Indeed, this religion is easy. No one strains themselves excessively in this religion except that it overwhelms them, so be moderate and do your best."
            </p>
            <p className="text-[11px] text-emerald-300 font-semibold text-right">
              — Prophet Muhammad ﷺ (Sahih al-Bukhari 39)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 no-print">
            <button
              onClick={() => setActiveTab('first-steps')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Begin Your Gentle Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 rounded-xl text-xs sm:text-sm font-semibold border border-emerald-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-print">
        {[
          { id: 'welcome', label: 'Gentle Message & Reassurance', icon: <Heart className="w-4 h-4" /> },
          { id: 'first-steps', label: 'Day 1: First Foundations', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'prayer', label: 'How to Pray (Salah)', icon: <Compass className="w-4 h-4" /> },
          { id: 'lifestyle', label: 'Halal Living & Family', icon: <Smile className="w-4 h-4" /> },
          { id: 'common-questions', label: 'Real Fears & Questions', icon: <HelpCircle className="w-4 h-4" /> },
          { id: 'glossary', label: 'Beginner Words & Duas', icon: <BookOpen className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: WELCOME & REASSURANCE */}
      {/* ========================================================================= */}
      {activeTab === 'welcome' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
                <span>Three Core Truths to Keep in Your Heart Today</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Before learning any rules or rituals, let these three reassuring truths settle into your heart.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-stone-900 text-sm">All Past Mistakes are Forgiven</h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  The Messenger of Allah ﷺ said: <em>"Did you not know that Islam erases all that came before it?"</em> (Sahih Muslim 121). Whatever you did in the past is gone. You are completely clean before Allah.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-200/80 text-emerald-900 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-stone-900 text-sm">Take It Step-by-Step (Tadarruj)</h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Islam was revealed over 23 years. The companions did not learn everything overnight. Allah does not expect perfection; He loves sincere, consistent effort. Focus on learning prayer first, and let the rest unfold gradually.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-200/80 text-teal-900 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-stone-900 text-sm">You Retain Your Identity</h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  You do not need to become Arab or discard your culture, language, or birth family. Islam is universal. It purifies the soul and enriches your natural heritage. Be proud of who you are.
                </p>
              </div>
            </div>

            {/* Beginner Checklist */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-800" />
                    <span>Your First Week Milestone Tracker</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Gentle milestones you can check off as you settle into your new life in Islam.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  {Object.values(checklist).filter(Boolean).length} / 6 Completed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'took-shahada', text: 'Took the Shahada (Declaration of Faith)' },
                  { id: 'took-ghusl', text: 'Took a full cleansing shower (Ghusl) to start fresh' },
                  { id: 'learned-wudu', text: 'Learned the basic wash steps for prayer (Wudu)' },
                  { id: 'prayed-first', text: 'Performed first prayer with a guide or cheat-sheet' },
                  { id: 'learned-phrases', text: 'Learned Bismillah & Alhamdulillah' },
                  { id: 'visited-masjid', text: 'Visited a local mosque or connected with Muslims' }
                ].map((item) => {
                  const isChecked = !!checklist[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleCheckItem(item.id)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-medium' 
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-stone-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs leading-relaxed">{item.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: FIRST STEPS (DAY 1) */}
      {/* ========================================================================= */}
      {activeTab === 'first-steps' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Foundational Actions
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-0.5">
                Day One: The Two Declarations & The Purifying Bath
              </h2>
            </div>

            {/* The Shahada */}
            <div className="p-6 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 space-y-4">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <span>The Shahada (Testimony of Faith)</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-emerald-100 shadow-2xs space-y-3">
                <p className="font-arabic text-2xl sm:text-3xl text-stone-900 text-center leading-loose font-bold">
                  أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ
                </p>
                <p className="text-center font-serif text-xs sm:text-sm text-stone-700 italic">
                  Ash-hadu an la ilaha illa-Allah, wa ash-hadu anna Muhammadan Rasool-Allah.
                </p>
                <p className="text-center text-xs sm:text-sm text-stone-800 font-medium border-t border-stone-100 pt-2">
                  "I bear witness that there is no god worthy of worship except Allah, and I bear witness that Muhammad is the Messenger of Allah."
                </p>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed">
                By professing this with sincere belief in your heart, you entered into Islam. You affirmed the Absolute Oneness of God (Tawheed) and accepted Muhammad ﷺ as His final guide and messenger.
              </p>
            </div>

            {/* Taking Ghusl */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-600" />
                <span>The Purification Shower (Ghusl)</span>
              </h3>
              <p className="text-xs text-stone-600">
                It is recommended and celebrated for a new Muslim to take a full shower (Ghusl) to symbolize a fresh physical and spiritual beginning.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="font-bold text-xs text-emerald-800 font-mono">STEP 1</span>
                  <h4 className="font-bold text-xs text-stone-900">Intention (Niyyah)</h4>
                  <p className="text-xs text-stone-600">
                    Make a silent intention in your heart: <em>"I am taking this shower to enter Islam pure for Allah."</em>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="font-bold text-xs text-emerald-800 font-mono">STEP 2</span>
                  <h4 className="font-bold text-xs text-stone-900">Rinse Mouth & Nose</h4>
                  <p className="text-xs text-stone-600">
                    Rinse your mouth with water and sniff water gently into your nostrils and blow it out.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="font-bold text-xs text-emerald-800 font-mono">STEP 3</span>
                  <h4 className="font-bold text-xs text-stone-900">Wash Entire Body</h4>
                  <p className="text-xs text-stone-600">
                    Ensure water touches every part of your skin and hair roots from head to toe. You are now fully pure!
                  </p>
                </div>
              </div>
            </div>

            {/* The 5 Pillars Overview */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-800" />
                <span>The Five Pillars of Islam</span>
              </h3>
              <p className="text-xs text-stone-600">
                The structure of Islamic life rests upon five beautiful, practical pillars:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  { title: '1. Shahada', subtitle: 'Faith Declaration', desc: 'Belief in One God & His Messenger' },
                  { title: '2. Salah', subtitle: 'Daily Prayer', desc: '5 conversations with Allah every day' },
                  { title: '3. Zakah', subtitle: 'Charity Giving', desc: '2.5% wealth sharing with the needy' },
                  { title: '4. Sawm', subtitle: 'Fasting Ramadan', desc: 'Spiritual discipline from dawn to dusk' },
                  { title: '5. Hajj', subtitle: 'Pilgrimage', desc: 'Journey to Makkah once in a lifetime' }
                ].map((pillar, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1 text-center sm:text-left">
                    <span className="font-bold text-xs text-emerald-900 block">{pillar.title}</span>
                    <span className="text-[11px] font-semibold text-stone-700 block">{pillar.subtitle}</span>
                    <p className="text-[11px] text-stone-500 leading-tight">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: HOW TO PRAY (SALAH) GENTLY */}
      {/* ========================================================================= */}
      {activeTab === 'prayer' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Direct Connection with Allah
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-0.5">
                Learning Prayer (Salah) Without Stress
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Salah is your personal sanctuary: five gentle pauses in your day to reconnect with your Creator.
              </p>
            </div>

            {/* The Special Concession for Converts */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Heart className="w-4 h-4 text-amber-700" />
                <span>Authentic Prophetic Ease for New Muslims</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                A man came to the Prophet ﷺ and said: <em>"I cannot learn anything from the Quran, so teach me something that will suffice me in prayer."</em> The Prophet ﷺ replied: <em>"Say: SubhanAllah (Glory be to Allah), Alhamdulillah (Praise be to Allah), La ilaha illallah (There is no god but Allah), Allahu Akbar (Allah is the Greatest)."</em> (Sunan Abi Dawud 832).
              </p>
              <p className="text-xs font-semibold text-emerald-900 pt-1">
                💡 You do NOT have to wait until you memorize Arabic to start praying. You can hold your phone or a printed guide in your hand, or simply recite these 4 phrases while performing the physical movements!
              </p>
            </div>

            {/* Step 1: Wudu (Ablution) */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-800" />
                <span>Preparing with Wudu (Ablution)</span>
              </h3>
              <p className="text-xs text-stone-600">
                Before praying, perform this refreshing water wash. It washes away spiritual burdens:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {[
                  { step: '1. Hands', desc: 'Wash hands to wrists 3 times, say Bismillah' },
                  { step: '2. Mouth & Nose', desc: 'Rinse mouth & sniff water into nose 3 times' },
                  { step: '3. Face', desc: 'Wash entire face from hairline to chin 3 times' },
                  { step: '4. Arms', desc: 'Wash arms up to elbows 3 times (right, then left)' },
                  { step: '5. Head', desc: 'Wipe wet hands once over hair front-to-back' },
                  { step: '6. Ears', desc: 'Wipe inside & back of ears with wet fingers' },
                  { step: '7. Feet', desc: 'Wash feet up to ankles 3 times (right, then left)' },
                  { step: '8. Complete', desc: 'Say Ash-hadu an la ilaha illa-Allah' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <span className="font-bold text-emerald-800 text-[11px] font-mono">{item.step}</span>
                    <p className="text-stone-600 text-[11px] leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The 5 Daily Prayers Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-800" />
                <span>The 5 Daily Prayers & Units (Rak'ahs)</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                  <thead className="bg-stone-100 text-stone-700 font-bold">
                    <tr>
                      <th className="p-3">Prayer Name</th>
                      <th className="p-3">Timing Window</th>
                      <th className="p-3">Units (Rak'ahs)</th>
                      <th className="p-3">Recitation Style</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    <tr className="bg-white hover:bg-stone-50">
                      <td className="p-3 font-bold text-emerald-950">Fajr (Dawn)</td>
                      <td className="p-3 text-stone-600">From true dawn until right before sunrise</td>
                      <td className="p-3 font-mono font-bold text-emerald-800">2 Rak'ahs</td>
                      <td className="p-3 text-stone-600">Audible recitation</td>
                    </tr>
                    <tr className="bg-stone-50/50 hover:bg-stone-50">
                      <td className="p-3 font-bold text-emerald-950">Dhuhr (Noon)</td>
                      <td className="p-3 text-stone-600">After the sun passes its highest zenith</td>
                      <td className="p-3 font-mono font-bold text-emerald-800">4 Rak'ahs</td>
                      <td className="p-3 text-stone-600">Silent recitation</td>
                    </tr>
                    <tr className="bg-white hover:bg-stone-50">
                      <td className="p-3 font-bold text-emerald-950">Asr (Afternoon)</td>
                      <td className="p-3 text-stone-600">Late afternoon until the sky begins to turn gold</td>
                      <td className="p-3 font-mono font-bold text-emerald-800">4 Rak'ahs</td>
                      <td className="p-3 text-stone-600">Silent recitation</td>
                    </tr>
                    <tr className="bg-stone-50/50 hover:bg-stone-50">
                      <td className="p-3 font-bold text-emerald-950">Maghrib (Sunset)</td>
                      <td className="p-3 text-stone-600">Immediately after the sun dips below horizon</td>
                      <td className="p-3 font-mono font-bold text-emerald-800">3 Rak'ahs</td>
                      <td className="p-3 text-stone-600">First 2 audible, 3rd silent</td>
                    </tr>
                    <tr className="bg-white hover:bg-stone-50">
                      <td className="p-3 font-bold text-emerald-950">Isha (Night)</td>
                      <td className="p-3 text-stone-600">After evening twilight fades into night</td>
                      <td className="p-3 font-mono font-bold text-emerald-800">4 Rak'ahs</td>
                      <td className="p-3 text-stone-600">First 2 audible, last 2 silent</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Prayer Poster Callout */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-xs text-emerald-950">Need a Printable Visual Chart?</p>
                <p className="text-[11px] text-emerald-800">
                  We have printable charts of prayer movements, Wudu steps, and the 99 Names of Allah ready to download.
                </p>
              </div>
              <button
                onClick={() => onNavigate('printables')}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
              >
                View Printable Charts →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: HALAL LIVING & FAMILY */}
      {/* ========================================================================= */}
      {activeTab === 'lifestyle' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Daily Living & Social Grace
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-0.5">
                Food, Family & Character
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Islam is not just rituals; it is how you speak, how you eat, and how gently you treat those around you.
              </p>
            </div>

            {/* Family & Non-Muslim Parents */}
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Honoring Your Non-Muslim Parents & Family</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                One of the greatest commandments in the Qur'an is to treat your parents with profound kindness, affection, and respect—even if they do not share your faith:
              </p>
              <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80 text-xs italic text-stone-800">
                "And accompany them in this world with kindness..." (Surah Luqman 31:15)
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                Be even kinder to your mother and father than you were before Islam. Help around the house, listen attentively, smile, and show them that Islam has made you a more loving, patient, and caring child. Your character will be the greatest testimony to them.
              </p>
            </div>

            {/* Food & Halal Basics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>What is Halal (Permissible)?</span>
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Virtually all wholesome foods created by Allah are Halal!
                </p>
                <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                  <li>All fruits, vegetables, grains, legumes, nuts</li>
                  <li>All seafood, fish, and freshwater produce</li>
                  <li>Eggs, dairy, honey, and herbal teas</li>
                  <li>Meat from animals slaughtered in the Islamic prescribed manner (Zabiha)</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 text-rose-950">
                  <Info className="w-4 h-4 text-rose-600" />
                  <span>What is Prohibited (Haram)?</span>
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Islam prohibits only that which causes physical, mental, or spiritual harm:
                </p>
                <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                  <li>Pork, bacon, ham, and pork-derived gelatin</li>
                  <li>Alcohol, intoxicants, and recreational drugs</li>
                  <li>Meat not slaughtered in the name of God or carrion</li>
                  <li>Carnivorous animals with fangs or predatory birds</li>
                </ul>
              </div>
            </div>

            {/* Personal Habits & Modesty */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-stone-900">
                Patience with Personal Habits & Transition
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                If you have habits or vices from your past (like smoking, past lifestyles, or dietary habits), work on leaving them step by step. If you stumble, immediately say <em>"Astaghfirullah"</em> (I seek Allah's forgiveness) and carry on. The doors of Allah's mercy never close.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: REAL QUESTIONS & FEARS (FAQ) */}
      {/* ========================================================================= */}
      {activeTab === 'common-questions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Clear & Honest Answers
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-0.5">
                Frequently Asked Fears & Questions
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Every convert experiences these feelings. Here is authentic, comforting reassurance.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'mistakes-prayer',
                  q: 'What if I make mistakes or forget words while praying?',
                  a: `Do not worry at all! Allah looks at your sincere devotion, not perfection. The Prophet Muhammad ﷺ said: "The one who recites the Qur'an with difficulty and stammering will have DOUBLE the reward" (Sahih Muslim 798). If you forget what Rak'ah you are on or forget a word, simply do your best and continue. Your prayer is accepted insha'Allah.`
                },
                {
                  id: 'family-reaction',
                  q: 'How and when should I tell my family about my conversion?',
                  a: `There is no rush to announce it publicly if doing so could cause immediate harm, distress, or hostility. Take your time. First, let your parents and family see your newfound peace, gentleness, kindness, and patience. When you do share, emphasize that Islam has increased your love for them, not alienated you.`
                },
                {
                  id: 'changing-name',
                  q: 'Do I have to change my legal name or adopt an Arabic name?',
                  a: `No! In Islam, you are commanded to maintain your lineage and family heritage. The Prophet ﷺ did not change the names of his companions unless their name had a pagan or derogatory meaning (like "Slave of the Sun"). If your birth name has a good or neutral meaning (e.g., Peter, Michael, Sarah, David, Robert, Emily), you can proudly keep it.`
                },
                {
                  id: 'feeling-overwhelmed',
                  q: 'I feel overwhelmed by so many rules online. What should I do?',
                  a: `Avoid getting sucked into internet debates or strict sectarian controversies. In your first months, strictly focus on three things: 1. Deepening your personal relationship with Allah through prayer and dua, 2. Reading the Quran in English, and 3. Being good to people. Everything else can be learned gradually over the coming years.`
                },
                {
                  id: 'language-arabic',
                  q: 'Do I have to learn the Arabic language?',
                  a: `You only need to learn enough phonetic Arabic to perform the basic phrases of prayer (like Surah Al-Fatihah and Takbeer). Outside of prayer, you can make Dua (personal supplication) to Allah in your native language anytime, anywhere. Allah created all languages and understands the innermost whisper of your heart.`
                }
              ].map((faq) => {
                const isOpen = !!expandedFaq[faq.id];
                return (
                  <div key={faq.id} className="rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden transition-all">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-xs sm:text-sm text-stone-900">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-emerald-800 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white border-t border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Forum Callout */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-emerald-950">Have a specific question or scenario?</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Visit our Debates & Q&A section where you can post your question anonymously or join scholarly discussions.
                </p>
              </div>
              <button
                onClick={() => onNavigate('community-qa')}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                Go to Community Q&A →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: WORDS & DUAS GLOSSARY */}
      {/* ========================================================================= */}
      {activeTab === 'glossary' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Daily Islamic Vocabulary
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-0.5">
                Everyday Words & Duas You Will Hear
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                You will frequently hear Muslims use these words. Here is what they mean and when to say them:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  arabic: 'السَّلَامُ عَلَيْكُمْ',
                  transliteration: 'Assalamu Alaikum',
                  meaning: 'Peace be upon you',
                  usage: 'The universal greeting when meeting another Muslim.'
                },
                {
                  arabic: 'بِسْمِ اللَّهِ',
                  transliteration: 'Bismillah',
                  meaning: 'In the name of Allah',
                  usage: 'Say before eating, drinking, or starting any good action.'
                },
                {
                  arabic: 'الْحَمْدُ لِلَّهِ',
                  transliteration: 'Alhamdulillah',
                  meaning: 'Praise be to Allah',
                  usage: 'Say after finishing food, when sneezing, or expressing gratitude.'
                },
                {
                  arabic: 'إِنْ شَاءَ اللَّهُ',
                  transliteration: "Insha'Allah",
                  meaning: 'If Allah wills',
                  usage: 'Say when speaking about any future plan or promise.'
                },
                {
                  arabic: 'سُبْحَانَ اللَّهِ',
                  transliteration: 'SubhanAllah',
                  meaning: 'Glory be to Allah',
                  usage: 'Say when seeing something awe-inspiring in nature or creation.'
                },
                {
                  arabic: 'جَزَاكَ اللَّهُ خَيْرًا',
                  transliteration: 'JazakAllahu Khair',
                  meaning: 'May Allah reward you with goodness',
                  usage: 'The Islamic way of saying "Thank you very much".'
                },
                {
                  arabic: 'مَا شَاءَ اللَّهُ',
                  transliteration: "Masha'Allah",
                  meaning: 'What Allah has willed',
                  usage: 'Say when admiring something beautiful to avoid the evil eye.'
                },
                {
                  arabic: 'أَسْتَغْفِرُ اللَّهَ',
                  transliteration: 'Astaghfirullah',
                  meaning: "I seek forgiveness from Allah",
                  usage: 'Say when you make a mistake or feel remorse.'
                },
                {
                  arabic: 'اللَّهُ أَكْبَرُ',
                  transliteration: 'Allahu Akbar',
                  meaning: 'Allah is the Greatest',
                  usage: 'Recited during prayer and to remember God is greater than any obstacle.'
                }
              ].map((phrase, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-emerald-950 font-serif">
                      {phrase.transliteration}
                    </span>
                    <span className="font-arabic text-lg text-stone-900">
                      {phrase.arabic}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800">
                    "{phrase.meaning}"
                  </p>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {phrase.usage}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Dua for New Muslims */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-center sm:text-left">
              <span className="font-bold text-xs text-amber-900 uppercase tracking-wide">
                A Beautiful Prophetic Dua to Keep on Your Tongue
              </span>
              <p className="font-arabic text-xl text-stone-900 leading-loose">
                رَبِّ زِدْنِي عِلْمًا
              </p>
              <p className="text-xs font-serif italic text-stone-700">
                "Rabbi zidnee 'ilma" — (My Lord, increase me in knowledge) [Surah Taha 20:114]
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
