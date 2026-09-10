import React, { useState, useEffect } from 'react';
import { 
  Hash, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Check, 
  Trophy, 
  ArrowRight,
  ListFilter
} from 'lucide-react';

interface DhikrPreset {
  arabic: string;
  transliteration: string;
  meaning: string;
  virtue: string;
  defaultTarget: number;
}

const DHIKR_PRESETS: DhikrPreset[] = [
  {
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Glory be to Allah (Far removed is He from any imperfection)',
    virtue: 'Plants a date-palm tree for the reciter in Jannah (Tirmidhi).',
    defaultTarget: 33
  },
  {
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'All praise and gratitude are due to Allah alone',
    virtue: 'Fills the scale (Mizan) of good deeds on the Day of Resurrection (Muslim).',
    defaultTarget: 33
  },
  {
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest (Greater than anything in existence)',
    virtue: 'Beloved to Allah and completes the post-Salah remembrance.',
    defaultTarget: 33
  },
  {
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    meaning: 'I seek forgiveness from Allah',
    virtue: 'Opens closed doors, brings rainfall, relief from anxiety, and wealth (Surah Nuh).',
    defaultTarget: 100
  },
  {
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illallah',
    meaning: 'There is no deity worthy of worship except Allah',
    virtue: 'The most virtuous remembrance (Afdal ad-Dhikr) and the key to Paradise.',
    defaultTarget: 100
  },
  {
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'SubhanAllahi wa bihamdihi, SubhanAllahil Azeem',
    meaning: 'Glory be to Allah and His is the praise, Glory be to Allah the Supreme',
    virtue: 'Two words light on the tongue, heavy on the balance, beloved to the Most Merciful (Bukhari).',
    defaultTarget: 100
  },
  {
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    meaning: 'There is no might nor power except through Allah',
    virtue: 'A treasure from beneath the Throne of Allah (Bukhari & Muslim).',
    defaultTarget: 33
  },
  {
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    transliteration: 'Allahumma salli wa sallim \'ala Nabiyyina Muhammad',
    meaning: 'O Allah, send peace and blessings upon our Prophet Muhammad',
    virtue: 'Whoever sends blessings once, Allah sends blessings upon him ten times (Muslim).',
    defaultTarget: 100
  }
];

export const TasbihCounterPage: React.FC = () => {
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrPreset>(DHIKR_PRESETS[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [cycles, setCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalLifetimeDhikr, setTotalLifetimeDhikr] = useState(() => {
    try {
      const saved = localStorage.getItem('coi_tasbih_total');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Synthesize gentle click sound with Web Audio API
  const playBeadClick = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  };

  const playTargetChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  };

  const incrementCount = () => {
    const nextCount = count + 1;
    playBeadClick();

    if (target > 0 && nextCount >= target) {
      playTargetChime();
      setCount(0);
      setCycles(prev => prev + 1);
    } else {
      setCount(nextCount);
    }

    setTotalLifetimeDhikr(prev => {
      const updated = prev + 1;
      localStorage.setItem('coi_tasbih_total', updated.toString());
      return updated;
    });

    // Optional navigator vibrate for mobile devices
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {}
    }
  };

  const handleReset = () => {
    setCount(0);
    setCycles(0);
  };

  const handleSelectDhikr = (d: DhikrPreset) => {
    setSelectedDhikr(d);
    setTarget(d.defaultTarget);
    setCount(0);
    setCycles(0);
  };

  const progressPercent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Hash className="w-4 h-4" />
            <span>Remembrance of Allah (ذِكْرُ اللَّهِ)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Digital Tasbih & Dhikr Counter
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Count your daily adhkar with audio feedback, target goals, and authentic prophetic supplications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-colors ${
              soundEnabled 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-stone-100 text-stone-500 border-stone-300'
            }`}
            title={soundEnabled ? 'Mute Sound' : 'Enable Click Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="text-xs bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-stone-600">
            Total Dhikr Count: <strong className="text-emerald-950 font-mono">{totalLifetimeDhikr}</strong>
          </div>
        </div>
      </div>

      {/* Main Counter & Dhikr Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Counter Display & Bead Area (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md flex flex-col items-center justify-between text-center space-y-6">
          {/* Active Dhikr Display */}
          <div className="space-y-3 w-full">
            <p dir="rtl" className="font-arabic text-3xl sm:text-4xl text-emerald-950 font-medium leading-relaxed">
              {selectedDhikr.arabic}
            </p>
            <p className="text-sm sm:text-base font-semibold text-stone-800">
              {selectedDhikr.transliteration}
            </p>
            <p className="text-xs text-stone-500 max-w-md mx-auto italic">
              "{selectedDhikr.meaning}"
            </p>
          </div>

          {/* Large Tactile Click Button */}
          <div className="py-2">
            <button
              id="tasbih-main-count-btn"
              onClick={incrementCount}
              className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-b from-emerald-700 via-emerald-800 to-emerald-950 text-white shadow-xl hover:shadow-2xl active:scale-95 transition-all flex flex-col items-center justify-center p-6 border-4 border-amber-300/80 group select-none cursor-pointer focus:outline-none ring-8 ring-emerald-50"
            >
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-1">
                TAP TO COUNT
              </div>
              <div className="text-5xl sm:text-6xl font-mono font-extrabold tracking-tight text-white drop-shadow-sm group-active:scale-105 transition-transform">
                {count}
              </div>
              <div className="text-xs text-emerald-200 mt-2 font-mono">
                Target: {target > 0 ? `${target}` : 'Free'}
              </div>
            </button>
          </div>

          {/* Progress & Target Bar */}
          <div className="w-full max-w-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
              <span>Rounds Completed: <strong className="text-emerald-900 font-mono text-sm">{cycles}</strong></span>
              <span>{progressPercent}% of target</span>
            </div>
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
              <div
                className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Controls: Reset and Target Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="tasbih-reset-btn"
              onClick={handleReset}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Counter</span>
            </button>

            <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-xl border border-stone-200 text-xs font-medium">
              <span className="text-stone-500 px-1 text-[11px]">Target:</span>
              {[33, 99, 100, 1000, 0].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTarget(t);
                    setCount(0);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    target === t ? 'bg-emerald-800 text-white shadow-2xs' : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {t === 0 ? 'Free' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Virtue Callout */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 text-left space-y-1 w-full">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Authentic Virtue of this Dhikr:</span>
            </div>
            <p className="leading-relaxed">
              {selectedDhikr.virtue}
            </p>
          </div>
        </div>

        {/* Adhkar Presets List (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-emerald-800" />
              <span>Essential Sunnah Adhkar</span>
            </h3>
            <span className="text-[11px] text-stone-500 font-medium">
              8 Presets
            </span>
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {DHIKR_PRESETS.map((item, idx) => {
              const isSelected = selectedDhikr.arabic === item.arabic;
              return (
                <button
                  key={idx}
                  id={`dhikr-preset-${idx}`}
                  onClick={() => handleSelectDhikr(item)}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all space-y-1.5 ${
                    isSelected
                      ? 'bg-emerald-900 text-white border-emerald-800 shadow-sm ring-2 ring-amber-400/60'
                      : 'bg-stone-50/70 text-stone-900 border-stone-200 hover:border-emerald-300 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-emerald-950'}`}>
                      {item.transliteration}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-emerald-800 text-amber-200' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {item.defaultTarget}x
                    </span>
                  </div>

                  <p dir="rtl" className={`font-arabic text-lg leading-relaxed ${
                    isSelected ? 'text-white' : 'text-stone-800'
                  }`}>
                    {item.arabic}
                  </p>

                  <p className={`text-[11px] line-clamp-1 ${
                    isSelected ? 'text-emerald-200' : 'text-stone-500'
                  }`}>
                    {item.meaning}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
