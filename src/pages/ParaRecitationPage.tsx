import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PARA_LIST, fetchParaVerses, SAMPLE_JUZ_1_AYAHS } from '../data/paraData';
import { QURAN_RECITERS, QuranReciter } from '../data/quranData';
import { ParaMeta, ParaAyah } from '../types';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Volume2, 
  Search, 
  SlidersHorizontal, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Layers, 
  Share2, 
  Copy, 
  Info,
  Maximize2,
  ExternalLink,
  Flame,
  CheckCircle2,
  ListOrdered,
  Mic,
  Headphones
} from 'lucide-react';

export const ParaRecitationPage: React.FC = () => {
  // Para selection state
  const [selectedParaNum, setSelectedParaNum] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('coi_selected_para');
      if (saved) {
        const num = parseInt(saved, 10);
        if (num >= 1 && num <= 30) return num;
      }
    } catch {}
    return 1;
  });

  const selectedPara: ParaMeta = useMemo(() => {
    return PARA_LIST.find(p => p.number === selectedParaNum) || PARA_LIST[0];
  }, [selectedParaNum]);

  // Reciter state — synced with the same localStorage key as QuranPage
  const [selectedReciter, setSelectedReciter] = useState<QuranReciter>(() => {
    try {
      const saved = localStorage.getItem('coi_selected_reciter');
      if (saved) {
        const found = QURAN_RECITERS.find(r => r.id === saved);
        if (found) return found;
      }
    } catch {}
    return QURAN_RECITERS[0];
  });

  const [reciterSearch, setReciterSearch] = useState('');
  const [reciterFilterStyle, setReciterFilterStyle] = useState<'All' | 'Murattal' | 'Mujawwad'>('All');
  const [showReciterModal, setShowReciterModal] = useState(false);

  // Verses state
  const [ayahs, setAyahs] = useState<ParaAyah[]>(SAMPLE_JUZ_1_AYAHS);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [paraSearchQuery, setParaSearchQuery] = useState('');
  const [selectedSurahFilter, setSelectedSurahFilter] = useState<string>('All');

  // Display settings
  const [arabicFontSize, setArabicFontSize] = useState<number>(26);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [showParaInfo, setShowParaInfo] = useState<boolean>(false);
  const [copiedAyahId, setCopiedAyahId] = useState<number | null>(null);

  // Audio Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0); // 0-based index in `ayahs`
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [verseGapMs, setVerseGapMs] = useState<number>(0); // 0ms gapless, 1000ms, 2000ms
  const [repeatMode, setRepeatMode] = useState<'continue' | 'repeat-single'>('continue');
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<{ juz: number; ayahNum: number }[]>(() => {
    try {
      const saved = localStorage.getItem('coi_para_bookmarks');
      return saved ? JSON.parse(saved) : [{ juz: 1, ayahNum: 1 }];
    } catch {
      return [];
    }
  });

  // Audio elements refs for dual-buffering & zero-latency recitation
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const preloadedAudiosRef = useRef<Map<number, HTMLAudioElement>>(new Map());

  // Save selected para to localStorage
  useEffect(() => {
    localStorage.setItem('coi_selected_para', selectedParaNum.toString());
  }, [selectedParaNum]);

  // Load verses when Para changes
  useEffect(() => {
    let isMounted = true;
    setLoadingVerses(true);
    setIsPlaying(false);
    setCurrentAyahIndex(0);
    setAudioProgress(0);

    // Stop and clear existing audio
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.ontimeupdate = null;
      activeAudioRef.current.onended = null;
      activeAudioRef.current = null;
    }

    preloadedAudiosRef.current.forEach(aud => {
      aud.pause();
      aud.src = '';
    });
    preloadedAudiosRef.current.clear();

    fetchParaVerses(selectedParaNum).then(verses => {
      if (isMounted) {
        setAyahs(verses);
        setLoadingVerses(false);
      }
    });

    return () => {
      isMounted = false;
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      preloadedAudiosRef.current.forEach(aud => {
        aud.pause();
        aud.src = '';
      });
      preloadedAudiosRef.current.clear();
    };
  }, [selectedParaNum]);

  // Handle Reciter change
  const handleSelectReciter = (reciter: QuranReciter) => {
    setSelectedReciter(reciter);
    localStorage.setItem('coi_selected_reciter', reciter.id);
    setShowReciterModal(false);

    // If currently playing, restart active ayah with new reciter
    if (isPlaying && ayahs[currentAyahIndex]) {
      playAyahAtIndex(currentAyahIndex, reciter);
    }
  };

  // Build audio URL for any ayah
  const getAudioUrl = (surahNum: number, ayahInSurah: number, folder?: string) => {
    const s = surahNum.toString().padStart(3, '0');
    const a = ayahInSurah.toString().padStart(3, '0');
    const targetFolder = folder || selectedReciter.folder;
    return `https://everyayah.com/data/${targetFolder}/${s}${a}.mp3`;
  };

  // Preload upcoming verses into browser memory for true 0ms gapless transition
  const preloadUpcoming = (idx: number, folder: string) => {
    for (let i = idx + 1; i <= Math.min(idx + 3, ayahs.length - 1); i++) {
      const ayah = ayahs[i];
      if (!ayah) continue;
      const url = getAudioUrl(ayah.surahNumber, ayah.numberInSurah, folder);
      const existing = preloadedAudiosRef.current.get(i);
      if (!existing || existing.src !== url) {
        const nextAud = new Audio(url);
        nextAud.preload = 'auto';
        nextAud.load();
        preloadedAudiosRef.current.set(i, nextAud);
      }
    }

    // Clean up older preloaded elements to prevent memory leakage
    for (const [k, aud] of preloadedAudiosRef.current.entries()) {
      if (k < idx - 1 || k > idx + 4) {
        aud.pause();
        aud.src = '';
        preloadedAudiosRef.current.delete(k);
      }
    }
  };

  // Play Ayah at index
  const playAyahAtIndex = (index: number, overrideReciter?: QuranReciter) => {
    if (index < 0 || index >= ayahs.length) {
      setIsPlaying(false);
      return;
    }

    const curReciter = overrideReciter || selectedReciter;
    const ayah = ayahs[index];
    if (!ayah) return;

    // Clean up current active audio
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.ontimeupdate = null;
      activeAudioRef.current.onended = null;
    }

    setCurrentAyahIndex(index);
    setIsPlaying(true);

    const url = getAudioUrl(ayah.surahNumber, ayah.numberInSurah, curReciter.folder);
    let audio = preloadedAudiosRef.current.get(index);
    if (!audio || audio.src !== url) {
      audio = new Audio(url);
      audio.preload = 'auto';
    }

    audio.playbackRate = audioSpeed;
    activeAudioRef.current = audio;

    // Preload next verses in parallel
    preloadUpcoming(index, curReciter.folder);

    // Auto-scroll to playing verse
    if (isAutoScroll) {
      const el = document.getElementById(`para-ayah-${ayah.number}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    let transitioned = false;
    const triggerNext = () => {
      if (transitioned) return;
      transitioned = true;

      if (repeatMode === 'repeat-single') {
        playAyahAtIndex(index, curReciter);
      } else if (index < ayahs.length - 1) {
        if (verseGapMs > 0) {
          setTimeout(() => {
            playAyahAtIndex(index + 1, curReciter);
          }, verseGapMs);
        } else {
          playAyahAtIndex(index + 1, curReciter);
        }
      } else {
        // Reached end of Para
        setIsPlaying(false);
      }
    };

    audio.ontimeupdate = () => {
      setAudioProgress(audio.currentTime);
      setAudioDuration(audio.duration || 0);

      // Gapless trigger ~80ms before end to eliminate MP3 silence padding
      if (audio.duration > 0 && audio.currentTime >= audio.duration - 0.08) {
        triggerNext();
      }
    };

    audio.onended = () => {
      triggerNext();
    };

    audio.onerror = () => {
      console.warn("Audio playback error for ayah", ayah.number, "advancing...");
      triggerNext();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.warn("Autoplay or audio play blocked:", e);
        setIsPlaying(false);
      });
    }
  };

  // Toggle playback
  const togglePlayPause = () => {
    if (isPlaying) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (activeAudioRef.current && activeAudioRef.current.src) {
        activeAudioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          playAyahAtIndex(currentAyahIndex);
        });
      } else {
        playAyahAtIndex(currentAyahIndex);
      }
    }
  };

  // Next / Previous Ayah
  const playNextAyah = () => {
    if (currentAyahIndex < ayahs.length - 1) {
      playAyahAtIndex(currentAyahIndex + 1);
    }
  };

  const playPrevAyah = () => {
    if (currentAyahIndex > 0) {
      playAyahAtIndex(currentAyahIndex - 1);
    }
  };

  // Speed change
  const handleSpeedChange = (spd: number) => {
    setAudioSpeed(spd);
    if (activeAudioRef.current) {
      activeAudioRef.current.playbackRate = spd;
    }
  };

  // Bookmarking
  const toggleBookmark = (ayahNum: number) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.juz === selectedParaNum && b.ayahNum === ayahNum);
      const next = exists 
        ? prev.filter(b => !(b.juz === selectedParaNum && b.ayahNum === ayahNum))
        : [...prev, { juz: selectedParaNum, ayahNum }];
      localStorage.setItem('coi_para_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const isBookmarked = (ayahNum: number) => {
    return bookmarks.some(b => b.juz === selectedParaNum && b.ayahNum === ayahNum);
  };

  // Copy Ayah
  const handleCopyAyah = (ayah: ParaAyah) => {
    const textToCopy = `${ayah.textArabic}\n\n"${ayah.textEnglish}"\n\n— Holy Quran, [Surah ${ayah.surahNameEnglish} ${ayah.surahNumber}:${ayah.numberInSurah} | Para ${selectedParaNum} (${selectedPara.nameEnglish})]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyahId(ayah.number);
    setTimeout(() => setCopiedAyahId(null), 2500);
  };

  // Filtered ayahs
  const filteredAyahs = useMemo(() => {
    return ayahs.filter(a => {
      // Surah filter
      if (selectedSurahFilter !== 'All' && a.surahNameEnglish !== selectedSurahFilter) {
        return false;
      }
      // Text search
      if (!paraSearchQuery.trim()) return true;
      const q = paraSearchQuery.toLowerCase();
      return (
        a.textArabic.includes(q) ||
        a.textEnglish.toLowerCase().includes(q) ||
        a.surahNameEnglish.toLowerCase().includes(q) ||
        a.numberInSurah.toString() === q
      );
    });
  }, [ayahs, selectedSurahFilter, paraSearchQuery]);

  // Unique surahs in this Para
  const surahsInThisPara = useMemo(() => {
    const map = new Map<number, string>();
    ayahs.forEach(a => {
      if (!map.has(a.surahNumber)) {
        map.set(a.surahNumber, a.surahNameEnglish);
      }
    });
    return Array.from(map.entries()).map(([num, name]) => ({ num, name }));
  }, [ayahs]);

  // Reciters filtered in modal
  const filteredReciters = useMemo(() => {
    return QURAN_RECITERS.filter(r => {
      const matchesSearch = 
        r.name.toLowerCase().includes(reciterSearch.toLowerCase()) ||
        r.arabicName.includes(reciterSearch) ||
        r.origin.toLowerCase().includes(reciterSearch.toLowerCase()) ||
        r.description.toLowerCase().includes(reciterSearch.toLowerCase());
      
      const matchesStyle = 
        reciterFilterStyle === 'All' || r.style === reciterFilterStyle;

      return matchesSearch && matchesStyle;
    });
  }, [reciterSearch, reciterFilterStyle]);

  const currentPlayingAyah = ayahs[currentAyahIndex];

  return (
    <div className="min-h-screen bg-stone-50 pb-36">
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-700/50 shadow-md">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs / Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-xs font-medium text-amber-300">
              <Layers className="w-3.5 h-3.5" />
              <span>30 Paras (Juz) Full Recitation</span>
              <span className="text-emerald-400">•</span>
              <span>14 World Renowned Qaris</span>
            </div>

            {/* Qari Quick Switcher in Header */}
            <button
              onClick={() => setShowReciterModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800/90 hover:bg-emerald-700/90 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-semibold transition-all shadow-sm group cursor-pointer"
            >
              <Mic className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="truncate max-w-[180px] sm:max-w-xs">{selectedReciter.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 uppercase">
                {selectedReciter.style}
              </span>
            </button>
          </div>

          {/* Title & Para Headline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-amber-400 font-serif text-lg sm:text-xl font-bold">
                  پارہ {selectedPara.number}
                </span>
                <span className="text-emerald-300">•</span>
                <span className="text-stone-300 text-sm font-medium">
                  {selectedPara.surahRange}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
                Para {selectedPara.number}: <span className="text-amber-300">{selectedPara.nameEnglish}</span>
              </h1>

              <p className="text-emerald-100/90 text-sm sm:text-base max-w-3xl leading-relaxed">
                {selectedPara.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/40 text-emerald-200">
                  Total Verses: <strong className="text-amber-300">{selectedPara.totalAyahs}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/40 text-emerald-200">
                  Rukus: <strong className="text-amber-300">{selectedPara.rukuCount}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/40 text-emerald-200">
                  Surahs Covered: <strong className="text-amber-300">{selectedPara.surahsIncluded.join(', ')}</strong>
                </span>
                <button
                  onClick={() => setShowParaInfo(!showParaInfo)}
                  className="px-2.5 py-1 rounded-md bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{showParaInfo ? 'Hide Overview' : 'Key Themes & Commentary'}</span>
                </button>
              </div>
            </div>

            {/* Arabic Calligraphy Large Display */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="p-6 rounded-2xl bg-emerald-950/70 border border-amber-400/30 shadow-inner text-center w-full max-w-sm">
                <span className="text-emerald-400/80 text-xs uppercase tracking-widest block mb-1">
                  Holy Quran — Juz {selectedPara.number}
                </span>
                <div className="font-serif text-4xl sm:text-5xl text-amber-300 my-2 drop-shadow-sm font-bold dir-rtl">
                  {selectedPara.nameArabic}
                </div>
                <div className="text-xs text-emerald-200/80 font-medium">
                  {selectedPara.nameEnglish}
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs">
                  <button
                    disabled={selectedParaNum <= 1}
                    onClick={() => setSelectedParaNum(prev => Math.max(1, prev - 1))}
                    className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev Para</span>
                  </button>

                  <span className="text-amber-300 font-semibold">
                    {selectedParaNum} / 30
                  </span>

                  <button
                    disabled={selectedParaNum >= 30}
                    onClick={() => setSelectedParaNum(prev => Math.min(30, prev + 1))}
                    className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Next Para</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Expandable Key Themes & Insights */}
          {showParaInfo && (
            <div className="mt-6 p-5 rounded-2xl bg-emerald-950/90 border border-amber-400/40 text-emerald-50 text-sm animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-300 font-bold mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Major Themes & Spiritual Reflections in Para {selectedPara.number}</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm text-emerald-100/90">
                {selectedPara.keyThemes.map((theme, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-900/40 p-2.5 rounded-lg border border-emerald-800/40">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* 30 Paras Fast Navigation Grid */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-stone-900">Select any Para (1 to 30)</h2>
            </div>
            <span className="text-xs text-stone-500">
              Click to jump to any Para
            </span>
          </div>

          {/* Quick horizontal scrollable / responsive grid for all 30 Paras */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-15 gap-1.5 sm:gap-2">
            {PARA_LIST.map(para => {
              const isSelected = para.number === selectedParaNum;
              return (
                <button
                  key={para.number}
                  onClick={() => setSelectedParaNum(para.number)}
                  className={`p-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center border ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-amber-400 ring-offset-1 scale-105'
                      : 'bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border-stone-200 hover:border-emerald-300'
                  }`}
                  title={`Para ${para.number}: ${para.nameEnglish} (${para.surahRange})`}
                >
                  <span className="text-[10px] sm:text-xs font-bold font-mono">
                    {para.number}
                  </span>
                  <span className="font-serif text-xs sm:text-sm font-semibold mt-0.5 truncate w-full dir-rtl leading-tight">
                    {para.nameArabic}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Toolbar & Filter Bar */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input within active Para */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={paraSearchQuery}
                onChange={e => setParaSearchQuery(e.target.value)}
                placeholder={`Search verses in Para ${selectedParaNum} (Arabic, English, verse #)...`}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
              {paraSearchQuery && (
                <button
                  onClick={() => setParaSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Controls & Selectors */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
              
              {/* Surah dropdown within this Para */}
              {surahsInThisPara.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500 font-medium text-xs">Surah:</span>
                  <select
                    value={selectedSurahFilter}
                    onChange={e => setSelectedSurahFilter(e.target.value)}
                    className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-700 focus:outline-none focus:border-emerald-700"
                  >
                    <option value="All">All ({surahsInThisPara.length} Surahs)</option>
                    {surahsInThisPara.map(s => (
                      <option key={s.num} value={s.name}>
                        Surah {s.name} ({s.num})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Translation Toggle */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer text-xs ${
                  showTranslation 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                }`}
              >
                Translation: {showTranslation ? 'ON' : 'OFF'}
              </button>

              {/* Font Size Adjuster */}
              <div className="hidden sm:flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5">
                <span className="text-stone-500 text-xs">Font:</span>
                <input
                  type="range"
                  min="20"
                  max="38"
                  value={arabicFontSize}
                  onChange={e => setArabicFontSize(parseInt(e.target.value, 10))}
                  className="w-20 accent-emerald-700 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                  title={`Arabic Font: ${arabicFontSize}px`}
                />
                <span className="text-[11px] font-mono text-stone-600">{arabicFontSize}px</span>
              </div>

              {/* Reciter Button */}
              <button
                onClick={() => setShowReciterModal(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-amber-700" />
                <span>Qari: <strong>{selectedReciter.name.split(' ')[0]}</strong></span>
              </button>
            </div>
          </div>
        </section>

        {/* Verses Container */}
        {loadingVerses ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-700 border-t-transparent mb-4"></div>
            <h3 className="text-base font-bold text-stone-800">Loading Para {selectedParaNum} Verses...</h3>
            <p className="text-xs text-stone-500 mt-1">Retrieving authentic Uthmani script and English translations</p>
          </div>
        ) : filteredAyahs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
            <Info className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No verses found</h3>
            <p className="text-xs text-stone-500 mt-1">Try clearing your search query or selecting "All" Surahs</p>
            <button
              onClick={() => { setParaSearchQuery(''); setSelectedSurahFilter('All'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAyahs.map((ayah, idx) => {
              // Find index in overall `ayahs` for playback control
              const originalIndex = ayahs.findIndex(a => a.number === ayah.number);
              const isCurrentlyPlaying = isPlaying && currentAyahIndex === originalIndex;
              const isBooked = isBookmarked(ayah.number);

              // Check if this verse is the start of a Surah to display Surah Header
              const isSurahStart = ayah.numberInSurah === 1;

              return (
                <React.Fragment key={ayah.number}>
                  {/* Surah Header Card when a new Surah begins in this Para */}
                  {isSurahStart && (
                    <div className="my-6 rounded-2xl overflow-hidden border border-amber-300/80 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white shadow-sm p-5 text-center">
                      <div className="text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
                        Surah {ayah.surahNumber}
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                        {ayah.surahNameEnglish} <span className="text-amber-300 font-serif font-normal">({ayah.surahNameArabic})</span>
                      </div>
                      <div className="text-xs text-emerald-200/90 italic mb-3">
                        {ayah.surahEnglishTranslation}
                      </div>

                      {/* Bismillah Header (except for Surah 9 At-Tawbah) */}
                      {ayah.surahNumber !== 9 && (
                        <div className="pt-2 border-t border-emerald-700/60 font-serif text-xl sm:text-2xl text-amber-200">
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </div>
                      )}
                    </div>
                  )}

                  {/* Individual Ayah Card */}
                  <div
                    id={`para-ayah-${ayah.number}`}
                    className={`rounded-2xl transition-all p-4 sm:p-6 border ${
                      isCurrentlyPlaying
                        ? 'bg-emerald-50/90 border-emerald-600 shadow-md ring-2 ring-emerald-500/40'
                        : 'bg-white border-stone-200/90 hover:border-emerald-300 shadow-xs'
                    }`}
                  >
                    {/* Top Row: Surah info, Ayah index, Audio control & Bookmark */}
                    <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-stone-100">
                      
                      {/* Left: Ayah identifier & Sajda indicator */}
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold font-mono ${
                          isCurrentlyPlaying
                            ? 'bg-emerald-700 text-white'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {ayah.numberInSurah}
                        </span>

                        <span className="text-xs font-semibold text-stone-800">
                          {ayah.surahNameEnglish} {ayah.surahNumber}:{ayah.numberInSurah}
                        </span>

                        {ayah.isSajda && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Sajdah</span>
                          </span>
                        )}

                        {isCurrentlyPlaying && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 animate-pulse bg-emerald-100/70 px-2 py-0.5 rounded-full">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Reciting</span>
                          </span>
                        )}
                      </div>

                      {/* Right: Actions (Play this verse, Bookmark, Copy) */}
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        
                        {/* Play this specific Ayah */}
                        <button
                          onClick={() => {
                            if (isCurrentlyPlaying) {
                              togglePlayPause();
                            } else {
                              playAyahAtIndex(originalIndex);
                            }
                          }}
                          className={`p-1.5 sm:px-3 sm:py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isCurrentlyPlaying
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800'
                          }`}
                          title="Play this verse"
                        >
                          {isCurrentlyPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span className="hidden sm:inline">Listen</span>
                            </>
                          )}
                        </button>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleBookmark(ayah.number)}
                          className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                            isBooked
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                          }`}
                          title={isBooked ? 'Bookmarked' : 'Add Bookmark'}
                        >
                          {isBooked ? (
                            <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyAyah(ayah)}
                          className="p-1.5 rounded-xl text-xs text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Copy verse text and reference"
                        >
                          {copiedAyahId === ayah.number ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text with Uthmani Calligraphy Font */}
                    <div 
                      className="font-serif text-right text-stone-900 leading-[2.2] dir-rtl select-text mb-3"
                      style={{ fontSize: `${arabicFontSize}px` }}
                    >
                      {ayah.textArabic}
                      <span className="inline-flex items-center justify-center w-7 h-7 mx-2 rounded-full border border-amber-500 text-amber-800 text-xs font-sans font-bold bg-amber-50/50">
                        {ayah.numberInSurah}
                      </span>
                    </div>

                    {/* English Translation */}
                    {showTranslation && (
                      <div className="text-sm text-stone-600 leading-relaxed font-sans border-t border-stone-100 pt-2.5">
                        {ayah.textEnglish}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Bottom Pagination & Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <button
            disabled={selectedParaNum <= 1}
            onClick={() => setSelectedParaNum(prev => Math.max(1, prev - 1))}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-semibold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous: Para {selectedParaNum > 1 ? selectedParaNum - 1 : 1}</span>
          </button>

          <div className="text-center text-xs text-stone-500">
            Currently Viewing: <strong className="text-stone-800">Para {selectedParaNum} of 30</strong> ({selectedPara.nameEnglish})
          </div>

          <button
            disabled={selectedParaNum >= 30}
            onClick={() => setSelectedParaNum(prev => Math.min(30, prev + 1))}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Next: Para {selectedParaNum < 30 ? selectedParaNum + 1 : 30}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* STICKY BOTTOM AUDIO PLAYER BAR (Plays Entire Para Continuously) */}
      <aside aria-label="Audio Recitation Controls" className="fixed bottom-0 left-0 right-0 z-40 bg-emerald-950/95 backdrop-blur-md text-white border-t border-emerald-700/60 shadow-2xl px-4 py-3 sm:py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Active Ayah & Qari indicator */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowReciterModal(true)}
                className="w-10 h-10 rounded-xl bg-emerald-800 border border-amber-400/40 flex items-center justify-center text-amber-300 hover:bg-emerald-700 transition-colors shrink-0 group cursor-pointer"
                title="Change Reciter"
              >
                <Headphones className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <div className="flex flex-col truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-amber-300 truncate max-w-[130px] sm:max-w-xs">
                    {selectedReciter.name}
                  </span>
                  <span className="text-[10px] px-1 py-0.2 bg-emerald-900 text-emerald-300 rounded border border-emerald-700">
                    {selectedReciter.style}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-200/80 truncate">
                  {currentPlayingAyah ? (
                    <>
                      Para {selectedParaNum} • Surah {currentPlayingAyah.surahNameEnglish} {currentPlayingAyah.surahNumber}:{currentPlayingAyah.numberInSurah}
                    </>
                  ) : (
                    <>Para {selectedParaNum} ({selectedPara.nameEnglish})</>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Play / Pause Button in Header */}
            <div className="md:hidden flex items-center gap-1">
              <button
                onClick={togglePlayPause}
                className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center font-bold shadow-md cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Center: Audio Playback Controls */}
          <div className="flex flex-col items-center gap-1 w-full md:w-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Prev Ayah */}
              <button
                onClick={playPrevAyah}
                disabled={currentAyahIndex <= 0}
                className="p-1.5 text-emerald-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous verse"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Main Play / Pause */}
              <button
                onClick={togglePlayPause}
                className="hidden md:flex w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 items-center justify-center font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={isPlaying ? "Pause Recitation" : "Play Full Para"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              {/* Next Ayah */}
              <button
                onClick={playNextAyah}
                disabled={currentAyahIndex >= ayahs.length - 1}
                className="p-1.5 text-emerald-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next verse"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Repeat Single vs Continue Para toggle */}
              <button
                onClick={() => setRepeatMode(prev => prev === 'continue' ? 'repeat-single' : 'continue')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  repeatMode === 'repeat-single'
                    ? 'bg-amber-400 text-emerald-950'
                    : 'text-emerald-300 hover:text-white'
                }`}
                title={repeatMode === 'repeat-single' ? 'Repeating current verse' : 'Continuous Para recitation'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">{repeatMode === 'repeat-single' ? '1x' : 'All'}</span>
              </button>

              {/* Speed Selector */}
              <div className="flex items-center gap-1 bg-emerald-900/80 border border-emerald-700 rounded-lg px-2 py-0.5 text-xs text-emerald-200">
                {[0.75, 1, 1.25, 1.5].map(spd => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                      audioSpeed === spd 
                        ? 'bg-amber-400 text-emerald-950' 
                        : 'hover:text-white text-emerald-300'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Verse Progress Indicator within the Para */}
            <div className="w-full sm:w-72 flex items-center gap-2 text-[10px] text-emerald-300/80 font-mono">
              <span>{currentAyahIndex + 1}</span>
              <div className="flex-1 bg-emerald-900 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${((currentAyahIndex + 1) / Math.max(1, ayahs.length)) * 100}%` }}
                />
              </div>
              <span>{ayahs.length} verses</span>
            </div>
          </div>

          {/* Right: Gap delay & Auto scroll */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            {/* Verse Gap Delay setting */}
            <div className="flex items-center gap-1.5 text-emerald-300">
              <span className="text-[11px]">Verse Delay:</span>
              <select
                value={verseGapMs}
                onChange={e => setVerseGapMs(parseInt(e.target.value, 10))}
                className="bg-emerald-900 border border-emerald-700 text-emerald-100 rounded px-2 py-0.5 text-xs focus:outline-none"
              >
                <option value="0">0ms (Gapless Flow)</option>
                <option value="1000">1s Pause</option>
                <option value="2000">2s Pause</option>
                <option value="3000">3s (Repeat Practice)</option>
              </select>
            </div>

            {/* Auto-scroll toggle */}
            <button
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                isAutoScroll
                  ? 'bg-emerald-800 text-amber-300 border-emerald-600'
                  : 'bg-emerald-950 text-stone-400 border-emerald-800'
              }`}
            >
              Auto-Scroll: {isAutoScroll ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </aside>

      {/* ALL 14 QARIS SELECTION MODAL */}
      {showReciterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 to-emerald-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-1">
                  <Mic className="w-4 h-4" />
                  <span>14 World Renowned Quran Reciters</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">Select Reciter for Para Audio</h3>
              </div>
              <button
                onClick={() => setShowReciterModal(false)}
                className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search & Style Filter */}
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={reciterSearch}
                  onChange={e => setReciterSearch(e.target.value)}
                  placeholder="Search Qaris by name or city..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div className="flex items-center gap-1.5 self-center">
                {(['All', 'Murattal', 'Mujawwad'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => setReciterFilterStyle(style)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      reciterFilterStyle === style
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-200/80 text-stone-600 hover:bg-stone-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Reciters List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
              {filteredReciters.map(reciter => {
                const isSelected = reciter.id === selectedReciter.id;
                return (
                  <div
                    key={reciter.id}
                    onClick={() => handleSelectReciter(reciter)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/30 shadow-sm'
                        : 'bg-stone-50 hover:bg-emerald-50/40 border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {reciter.name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{reciter.name}</h4>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            reciter.style === 'Mujawwad' 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            {reciter.style}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                          <span className="font-serif text-emerald-800 font-semibold">{reciter.arabicName}</span>
                          <span>•</span>
                          <span>{reciter.origin}</span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1 italic">
                          {reciter.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <button className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-emerald-600 hover:text-white text-stone-700 text-xs font-semibold transition-colors">
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span>Reciter choice is automatically saved across the site</span>
              <button
                onClick={() => setShowReciterModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
