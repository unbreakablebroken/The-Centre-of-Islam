import React, { useState, useEffect, useRef } from 'react';
import { SURAH_LIST, fetchSurahVerses, POPULAR_SURAHS_SAMPLE, QURAN_RECITERS, QuranReciter } from '../data/quranData';
import { SurahMeta, Ayah } from '../types';
import { 
  BookOpen, 
  Search, 
  Play, 
  Pause, 
  Bookmark, 
  BookmarkCheck, 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  Settings2, 
  ChevronRight,
  Sparkles,
  RotateCcw,
  Mic
} from 'lucide-react';

export const QuranPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Meccan' | 'Medinan'>('All');
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta>(SURAH_LIST[0]);
  const [ayahs, setAyahs] = useState<Ayah[]>(POPULAR_SURAHS_SAMPLE[1] || []);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [arabicFontSize, setArabicFontSize] = useState(26); // px
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
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
  const [bookmarks, setBookmarks] = useState<{ surah: number; ayah: number }[]>(() => {
    try {
      const saved = localStorage.getItem('coi_quran_bookmarks');
      return saved ? JSON.parse(saved) : [{ surah: 1, ayah: 1 }];
    } catch {
      return [];
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load verses when selected surah changes
  useEffect(() => {
    let isMounted = true;
    setLoadingVerses(true);
    setCurrentPlayingAyah(null);
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    fetchSurahVerses(selectedSurah.number).then((verses) => {
      if (isMounted) {
        setAyahs(verses);
        setLoadingVerses(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedSurah.number]);

  const toggleBookmark = (surahNum: number, ayahNum: number) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.surah === surahNum && b.ayah === ayahNum);
      const next = exists 
        ? prev.filter(b => !(b.surah === surahNum && b.ayah === ayahNum))
        : [...prev, { surah: surahNum, ayah: ayahNum }];
      localStorage.setItem('coi_quran_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const isBookmarked = (surahNum: number, ayahNum: number) => {
    return bookmarks.some(b => b.surah === surahNum && b.ayah === ayahNum);
  };

  // Reciter audio url generator with dynamic reciter folder
  const getAudioUrl = (surahNum: number, ayahNum: number, folder?: string) => {
    const s = surahNum.toString().padStart(3, '0');
    const a = ayahNum.toString().padStart(3, '0');
    const targetFolder = folder || selectedReciter.folder;
    return `https://everyayah.com/data/${targetFolder}/${s}${a}.mp3`;
  };

  const handleReciterChange = (reciterId: string) => {
    const newReciter = QURAN_RECITERS.find(r => r.id === reciterId);
    if (!newReciter) return;
    setSelectedReciter(newReciter);
    try {
      localStorage.setItem('coi_selected_reciter', newReciter.id);
    } catch {}

    // If currently playing, seamlessly switch to the new reciter for current verse
    if (isPlaying && currentPlayingAyah !== null) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const url = getAudioUrl(selectedSurah.number, currentPlayingAyah, newReciter.folder);
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = url;
      audioRef.current.play().catch(err => console.error('Audio reciter switch error:', err));
    }
  };

  const playAyahAudio = (ayahNum: number, overrideReciter?: QuranReciter) => {
    if (currentPlayingAyah === ayahNum && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    const targetFolder = overrideReciter ? overrideReciter.folder : selectedReciter.folder;
    const url = getAudioUrl(selectedSurah.number, ayahNum, targetFolder);
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.src = url;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setCurrentPlayingAyah(ayahNum);
    }).catch(err => {
      console.error('Audio play error:', err);
    });

    audioRef.current.onended = () => {
      // Auto-play next verse if available
      if (ayahNum < ayahs.length) {
        playAyahAudio(ayahNum + 1);
      } else {
        setIsPlaying(false);
        setCurrentPlayingAyah(null);
      }
    };
  };

  const filteredSurahs = SURAH_LIST.filter(s => {
    const matchesSearch = s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery.trim() ||
      s.name.includes(searchQuery);
    const matchesFilter = filterType === 'All' || s.revelationType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>The Noble Quran (القرآن الكريم)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Read, Listen & Reflect
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Authentic Uthmani text, verified English translations, and audio recitations from 14 world-renowned Qaris.
          </p>
        </div>

        {/* Font size adjuster */}
        <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
          <span className="text-xs text-stone-600 font-medium pl-1">Arabic Font Size:</span>
          <button
            onClick={() => setArabicFontSize(prev => Math.max(20, prev - 2))}
            className="w-7 h-7 bg-white rounded-lg border border-stone-300 text-xs font-bold hover:bg-stone-100 flex items-center justify-center text-stone-700"
            title="Decrease font size"
          >
            A-
          </button>
          <span className="text-xs font-mono font-bold text-emerald-800 px-1">{arabicFontSize}px</span>
          <button
            onClick={() => setArabicFontSize(prev => Math.min(42, prev + 2))}
            className="w-7 h-7 bg-white rounded-lg border border-stone-300 text-xs font-bold hover:bg-stone-100 flex items-center justify-center text-stone-700"
            title="Increase font size"
          >
            A+
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Surah List Column (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <input
                id="quran-search-input"
                type="text"
                placeholder="Search Surah by name or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none text-stone-900"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            {/* Filter Tabs */}
            <div className="flex rounded-lg bg-stone-100 p-1 text-xs font-semibold text-stone-600">
              {(['All', 'Meccan', 'Medinan'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`flex-1 py-1 rounded-md transition-all ${
                    filterType === t ? 'bg-white text-emerald-900 shadow-xs' : 'hover:text-stone-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Surah Index Scroll list */}
          <div className="max-h-[600px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-stone-100">
            {filteredSurahs.map((surah) => {
              const isSelected = selectedSurah.number === surah.number;
              return (
                <button
                  key={surah.number}
                  id={`surah-item-${surah.number}`}
                  onClick={() => setSelectedSurah(surah)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all pt-2.5 ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                      isSelected ? 'bg-emerald-900 text-amber-300' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {surah.number}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-none">
                        {surah.englishName}
                      </div>
                      <div className={`text-[10px] mt-1 ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>
                        {surah.englishNameTranslation} • {surah.numberOfAyahs} ayahs
                      </div>
                    </div>
                  </div>

                  <div className={`font-arabic text-base font-bold ${isSelected ? 'text-amber-300' : 'text-stone-800'}`}>
                    {surah.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Surah Reader Column (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Surah Hero Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-emerald-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-1">
                  Surah {selectedSurah.number} • {selectedSurah.revelationType} • {selectedSurah.numberOfAyahs} Verses
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {selectedSurah.englishName} ({selectedSurah.englishNameTranslation})
                </h2>
              </div>

              <div className="font-arabic text-4xl text-amber-300 text-right">
                سُورَةُ {selectedSurah.name}
              </div>
            </div>

            {/* Audio Recitation Bar */}
            <div className="mt-6 pt-4 border-t border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  id="play-all-surah-btn"
                  onClick={() => playAyahAudio(1)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause Recitation' : 'Listen to Full Surah'}</span>
                </button>
                {isPlaying && currentPlayingAyah && (
                  <span className="text-[11px] text-emerald-200 bg-emerald-900/80 px-2.5 py-1 rounded-lg border border-emerald-700/60 font-medium">
                    Ayah {currentPlayingAyah} of {selectedSurah.numberOfAyahs}
                  </span>
                )}
              </div>

              {/* Reciter Voice Selector */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold shrink-0">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Voice:</span>
                </div>
                <div className="relative">
                  <select
                    id="quran-reciter-select"
                    value={selectedReciter.id}
                    onChange={(e) => handleReciterChange(e.target.value)}
                    aria-label="Select Quran Reciter"
                    className="appearance-none bg-emerald-900/90 hover:bg-emerald-800/90 text-white text-xs font-semibold pl-3 pr-8 py-2 rounded-xl border border-emerald-700/80 focus:ring-2 focus:ring-amber-400 focus:outline-none cursor-pointer transition-all shadow-2xs"
                  >
                    {QURAN_RECITERS.map((r) => (
                      <option key={r.id} value={r.id} className="bg-stone-900 text-white py-1">
                        {r.name} • {r.style} ({r.origin})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-300 text-xs">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Reciter Detail Info Chip */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between text-[11px] text-emerald-200/90 pt-1 border-t border-emerald-900/60">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Active Voice: <strong className="text-white">{selectedReciter.name}</strong></span>
                <span className="text-emerald-500">•</span>
                <span className="font-arabic text-amber-200 text-xs">{selectedReciter.arabicName}</span>
              </span>
              <span className="text-emerald-300/80 italic text-[11px] mt-1 sm:mt-0">
                {selectedReciter.description}
              </span>
            </div>
          </div>

          {/* Bismillah Banner for non-Tawbah surahs */}
          {selectedSurah.number !== 9 && selectedSurah.number !== 1 && (
            <div className="text-center py-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <p className="font-arabic text-2xl text-emerald-900 font-medium">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-xs text-stone-500 mt-1 italic">
                In the name of Allah, the Entirely Merciful, the Especially Merciful.
              </p>
            </div>
          )}

          {/* Verses Container */}
          {loadingVerses ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-stone-600 font-medium">Loading authentic verses & translations...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ayahs.map((ayah) => {
                const bookmarked = isBookmarked(selectedSurah.number, ayah.numberInSurah);
                const isCurrentAudio = currentPlayingAyah === ayah.numberInSurah && isPlaying;

                return (
                  <div
                    key={ayah.numberInSurah}
                    id={`ayah-${selectedSurah.number}-${ayah.numberInSurah}`}
                    className={`bg-white rounded-2xl p-6 border transition-all shadow-xs ${
                      isCurrentAudio 
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20' 
                        : 'border-stone-200 hover:border-emerald-200'
                    }`}
                  >
                    {/* Verse Controls Header */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 text-xs text-stone-500">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-xs">
                          {ayah.numberInSurah}
                        </span>
                        <span className="font-medium text-stone-600">
                          {selectedSurah.number}:{ayah.numberInSurah}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => playAyahAudio(ayah.numberInSurah)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isCurrentAudio 
                              ? 'bg-emerald-800 text-amber-300' 
                              : 'text-stone-500 hover:text-emerald-800 hover:bg-stone-100'
                          }`}
                          title="Play Ayah audio"
                        >
                          {isCurrentAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => toggleBookmark(selectedSurah.number, ayah.numberInSurah)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            bookmarked ? 'text-amber-600 bg-amber-50' : 'text-stone-400 hover:text-amber-600 hover:bg-stone-100'
                          }`}
                          title="Bookmark Ayah"
                        >
                          {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text (Right-to-Left) */}
                    <p
                      dir="rtl"
                      className="font-arabic text-stone-900 leading-loose text-right mb-4 font-normal"
                      style={{ fontSize: `${arabicFontSize}px` }}
                    >
                      {ayah.textArabic}{' '}
                      <span className="inline-block text-emerald-800 text-base font-bold font-mono mr-1">
                        ۝{ayah.numberInSurah}
                      </span>
                    </p>

                    {/* Transliteration if present */}
                    {ayah.transliteration && (
                      <p className="text-xs text-emerald-800/80 italic mb-2 font-medium">
                        {ayah.transliteration}
                      </p>
                    )}

                    {/* English Translation */}
                    <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                      {ayah.textEnglish}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
