import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  getHadithBooks, 
  getBookChapters, 
  getHadiths, 
  CANONICAL_HADITH_BOOKS 
} from '../services/hadithApiService';
import { HadithApiBook, HadithApiChapter, HadithApiItem } from '../types';
import { 
  Scroll, 
  Search, 
  BookOpen, 
  Check, 
  Copy, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Info, 
  Filter, 
  X, 
  ShieldCheck, 
  Languages, 
  RotateCcw,
  ExternalLink,
  BookMarked,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AllHadithsPage: React.FC = () => {
  // Books & Chapters state
  const [books, setBooks] = useState<HadithApiBook[]>(CANONICAL_HADITH_BOOKS);
  const [selectedBookSlug, setSelectedBookSlug] = useState<string>('sahih-bukhari'); // default to Sahih Bukhari or 'All'
  const [chapters, setChapters] = useState<HadithApiChapter[]>([]);
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(0); // 0 = all chapters
  const [loadingChapters, setLoadingChapters] = useState<boolean>(false);

  // Search & Filter state
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const [hadithNumberInput, setHadithNumberInput] = useState<string>('');
  const [activeHadithNumber, setActiveHadithNumber] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All'); // All, Sahih, Hasan, Da'if

  // Hadiths data & Pagination state
  const [hadiths, setHadiths] = useState<HadithApiItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [totalHadiths, setTotalHadiths] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(15);
  const [loadingHadiths, setLoadingHadiths] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Jump to page input
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Display & Reading preferences
  const [showUrdu, setShowUrdu] = useState<boolean>(false);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [arabicFontSize, setArabicFontSize] = useState<number>(24);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Bookmarks state (saved to localStorage)
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('coi_hadith_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showBookmarksModal, setShowBookmarksModal] = useState<boolean>(false);
  const [bookmarkedItems, setBookmarkedItems] = useState<HadithApiItem[]>(() => {
    try {
      const saved = localStorage.getItem('coi_hadith_bookmarked_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Top anchor ref for smooth scrolling on page change
  const hadithListTopRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch available Books on mount
  useEffect(() => {
    let isMounted = true;
    getHadithBooks().then(fetchedBooks => {
      if (isMounted && fetchedBooks.length > 0) {
        setBooks(fetchedBooks);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // 2. Load Chapters when Book changes
  useEffect(() => {
    let isMounted = true;
    setSelectedChapterNum(0); // reset chapter on book change

    if (!selectedBookSlug || selectedBookSlug === 'All') {
      setChapters([]);
      return;
    }

    setLoadingChapters(true);
    getBookChapters(selectedBookSlug).then(fetchedChapters => {
      if (isMounted) {
        setChapters(fetchedChapters);
        setLoadingChapters(false);
      }
    });

    return () => { isMounted = false; };
  }, [selectedBookSlug]);

  // 3. Fetch Hadiths whenever Book, Chapter, Search Query, Hadith Number, Grade, Page, or PerPage changes
  useEffect(() => {
    let isMounted = true;
    setLoadingHadiths(true);
    setFetchError(null);

    getHadiths({
      book: selectedBookSlug !== 'All' ? selectedBookSlug : undefined,
      chapter: selectedChapterNum > 0 ? selectedChapterNum : undefined,
      hadithEnglish: activeSearchQuery.trim() ? activeSearchQuery.trim() : undefined,
      hadithNumber: activeHadithNumber.trim() ? activeHadithNumber.trim() : undefined,
      status: selectedGrade !== 'All' ? selectedGrade : undefined,
      page: currentPage,
      paginate: perPage
    })
      .then(res => {
        if (!isMounted) return;
        if (res && res.hadiths && Array.isArray(res.hadiths.data)) {
          setHadiths(res.hadiths.data);
          setTotalHadiths(res.hadiths.total || res.hadiths.data.length);
          setLastPage(res.hadiths.last_page || 1);
        } else {
          setHadiths([]);
          setTotalHadiths(0);
          setLastPage(1);
        }
        setLoadingHadiths(false);
      })
      .catch(err => {
        if (!isMounted) return;
        console.error("Failed to fetch hadiths:", err);
        setFetchError("Unable to connect to HadithAPI. Please verify your connection or try again.");
        setLoadingHadiths(false);
      });

    return () => { isMounted = false; };
  }, [selectedBookSlug, selectedChapterNum, activeSearchQuery, activeHadithNumber, selectedGrade, currentPage, perPage]);

  // Current selected book meta
  const currentBook = useMemo(() => {
    return books.find(b => b.bookSlug === selectedBookSlug) || null;
  }, [books, selectedBookSlug]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchQuery(searchInput);
    setActiveHadithNumber(hadithNumberInput);
    setCurrentPage(1); // reset to first page
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchInput('');
    setActiveSearchQuery('');
    setHadithNumberInput('');
    setActiveHadithNumber('');
    setSelectedGrade('All');
    setSelectedChapterNum(0);
    setCurrentPage(1);
  };

  // Jump to specific page
  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= lastPage) {
      setCurrentPage(p);
      setJumpPageInput('');
      scrollToTop();
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    if (hadithListTopRef.current) {
      hadithListTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Copy Hadith
  const handleCopyHadith = (hadith: HadithApiItem) => {
    const bookTitle = hadith.book?.bookName || currentBook?.bookName || hadith.bookSlug;
    const chapterTitle = hadith.chapter?.chapterEnglish ? `Chapter: ${hadith.chapter.chapterEnglish} | ` : '';
    const heading = hadith.headingEnglish ? `[${hadith.headingEnglish}]\n` : '';
    const narrator = hadith.englishNarrator ? `${hadith.englishNarrator}\n` : '';
    const textToCopy = `${heading}${narrator}"${hadith.hadithEnglish}"\n\n${hadith.hadithArabic}\n\n— ${bookTitle}, Hadith ${hadith.hadithNumber} (${chapterTitle}Status: ${hadith.status})\nVia Centre of Islam (HadithAPI)`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Share Hadith
  const handleShareHadith = (hadith: HadithApiItem) => {
    const bookTitle = hadith.book?.bookName || currentBook?.bookName || hadith.bookSlug;
    const shareData = {
      title: `${bookTitle} - Hadith #${hadith.hadithNumber}`,
      text: `"${hadith.hadithEnglish.slice(0, 150)}..." — ${bookTitle}, Hadith ${hadith.hadithNumber} (Status: ${hadith.status})`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => handleCopyHadith(hadith));
    } else {
      handleCopyHadith(hadith);
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (hadith: HadithApiItem) => {
    setBookmarks(prev => {
      const exists = prev.includes(hadith.id);
      const next = exists ? prev.filter(id => id !== hadith.id) : [...prev, hadith.id];
      localStorage.setItem('coi_hadith_bookmarks', JSON.stringify(next));
      return next;
    });

    setBookmarkedItems(prev => {
      const exists = prev.some(h => h.id === hadith.id);
      const next = exists ? prev.filter(h => h.id !== hadith.id) : [...prev, hadith];
      localStorage.setItem('coi_hadith_bookmarked_items', JSON.stringify(next));
      return next;
    });
  };

  // Format Status Badge Style
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('sahih')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <ShieldCheck className="w-3 h-3 text-emerald-700" />
          <span>Sahih (Authentic)</span>
        </span>
      );
    }
    if (s.includes('hasan')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span>Hasan (Good)</span>
        </span>
      );
    }
    if (s.includes('da') || s.includes('weak')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <Info className="w-3 h-3 text-amber-700" />
          <span>{status || "Da'eef"}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
        <span>{status || 'Authenticated'}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Hero Header Banner */}
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-700/50 shadow-md">
        <div className="max-w-7xl mx-auto">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-xs font-medium text-amber-300">
              <Scroll className="w-3.5 h-3.5 text-amber-400" />
              <span>Prophetic Sunnah & Hadith Encyclopedia</span>
              <span className="text-emerald-400">•</span>
              <span>Powered by HadithAPI</span>
            </div>

            {/* Saved Bookmarks Counter Button */}
            <button
              onClick={() => setShowBookmarksModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 border border-amber-400/40 text-amber-200 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span>Saved Hadiths ({bookmarks.length})</span>
            </button>
          </div>

          {/* Title & Description */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
                Complete Hadith Library <span className="text-amber-300 font-serif text-2xl sm:text-3xl font-normal block sm:inline mt-1 sm:mt-0">(جامع الأحاديث النبوية)</span>
              </h1>
              <p className="text-emerald-100/90 text-sm sm:text-base max-w-3xl leading-relaxed">
                Explore over <strong>40,000+ authentic hadiths</strong> from the Kutub al-Sittah (Six Canonical Books) including Sahih Bukhari, Sahih Muslim, Sunan Abu Dawood, Jami' at-Tirmidhi, and beyond — with full Arabic text, narrator chains, English & Urdu translations, and scholarly grading.
              </p>

              {/* Fast Stats Bar */}
              <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/40 text-emerald-200">
                  Total Corpus: <strong className="text-amber-300">40,465+ Hadiths</strong>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/40 text-emerald-200">
                  Canonical Books: <strong className="text-amber-300">9 Compilations</strong>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/40 text-emerald-200">
                  Authenticity Verified: <strong className="text-amber-300">Sahih & Hasan</strong>
                </span>
              </div>
            </div>

            {/* Quick Hadith Search Card */}
            <div className="lg:col-span-4">
              <form 
                onSubmit={handleSearchSubmit}
                className="bg-emerald-950/80 rounded-2xl p-4 sm:p-5 border border-amber-400/30 shadow-inner space-y-3"
              >
                <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span>Search All Hadiths</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search keywords (e.g. intention, prayer, fasting, mercy)..."
                    className="w-full pl-3 pr-8 py-2 bg-emerald-900/70 border border-emerald-700 rounded-xl text-xs sm:text-sm text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-emerald-300 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={hadithNumberInput}
                    onChange={e => setHadithNumberInput(e.target.value)}
                    placeholder="Hadith # (e.g. 1)"
                    className="w-full px-3 py-1.5 bg-emerald-900/70 border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />

                  <select
                    value={selectedGrade}
                    onChange={e => { setSelectedGrade(e.target.value); setCurrentPage(1); }}
                    className="w-full px-2.5 py-1.5 bg-emerald-900/70 border border-emerald-700 rounded-xl text-xs text-emerald-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="All">All Grades</option>
                    <option value="Sahih">Sahih Only</option>
                    <option value="Hasan">Hasan</option>
                    <option value="Da`eef">Da'if</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Hadiths</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div ref={hadithListTopRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Canonical Books Carousel / Selector Grid */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm sm:text-base font-bold text-stone-900">
                Choose a Canonical Book ({books.length} Collections)
              </h2>
            </div>
            
            {/* Global All Books Switcher */}
            <button
              onClick={() => { setSelectedBookSlug('All'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                selectedBookSlug === 'All'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-stone-50 hover:bg-emerald-50 text-stone-700 border-stone-200'
              }`}
            >
              All Books (Global Search)
            </button>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {books.map(book => {
              const isSelected = selectedBookSlug === book.bookSlug;
              return (
                <button
                  key={book.id || book.bookSlug}
                  onClick={() => {
                    setSelectedBookSlug(book.bookSlug);
                    setCurrentPage(1);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-950 shadow-md ring-2 ring-amber-400/80 scale-[1.02]'
                      : 'bg-stone-50 hover:bg-emerald-50/60 text-stone-800 border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-bold leading-tight line-clamp-2">
                      {book.bookName}
                    </h3>
                    <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>
                      {book.writerName}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-stone-200/50 flex items-center justify-between text-[10px]">
                    <span className={isSelected ? 'text-amber-300 font-semibold' : 'text-emerald-700 font-semibold'}>
                      {book.hadiths_count > 0 ? `${book.hadiths_count.toLocaleString()}` : 'Canonical'}
                    </span>
                    <span className={isSelected ? 'text-emerald-300' : 'text-stone-400'}>
                      {book.chapters_count > 0 ? `${book.chapters_count} ch` : ''}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Book Information & Chapter Filter Bar */}
          {currentBook && selectedBookSlug !== 'All' && (
            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-800">{currentBook.bookName}</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-600">Compiled by {currentBook.writerName} ({currentBook.writerDeath})</span>
                <span className="text-stone-400">•</span>
                <span className="text-emerald-700 font-medium">{currentBook.hadiths_count.toLocaleString()} Hadiths in {currentBook.chapters_count} Chapters</span>
              </div>

              {/* Chapters Dropdown */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-600 whitespace-nowrap">Chapter:</span>
                <select
                  disabled={loadingChapters || chapters.length === 0}
                  value={selectedChapterNum}
                  onChange={e => {
                    setSelectedChapterNum(parseInt(e.target.value, 10));
                    setCurrentPage(1);
                  }}
                  className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-medium max-w-xs truncate focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value={0}>
                    {loadingChapters ? "Loading chapters..." : `All Chapters (${chapters.length})`}
                  </option>
                  {chapters.map(ch => (
                    <option key={ch.id || ch.chapterNumber} value={ch.chapterNumber}>
                      Ch. {ch.chapterNumber}: {ch.chapterEnglish} {ch.chapterArabic ? `(${ch.chapterArabic})` : ''}
                    </option>
                  ))}
                </select>

                {selectedChapterNum > 0 && (
                  <button
                    onClick={() => { setSelectedChapterNum(0); setCurrentPage(1); }}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100"
                    title="Clear Chapter Filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Toolbar & Filter Stats */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left: Active Filters Summary & Total Count */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium">
                Showing <strong className="text-emerald-900 font-bold">{totalHadiths.toLocaleString()}</strong> Hadiths:
              </span>

              {selectedBookSlug !== 'All' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  <span>{currentBook?.bookName || selectedBookSlug}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  <span>All Books</span>
                </span>
              )}

              {selectedChapterNum > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-300">
                  <span>Chapter #{selectedChapterNum}</span>
                  <button onClick={() => { setSelectedChapterNum(0); setCurrentPage(1); }} className="hover:text-red-600">✕</button>
                </span>
              )}

              {activeSearchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                  <span>Keyword: "{activeSearchQuery}"</span>
                  <button onClick={() => { setActiveSearchQuery(''); setSearchInput(''); setCurrentPage(1); }} className="hover:text-red-600">✕</button>
                </span>
              )}

              {activeHadithNumber && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                  <span>Hadith #{activeHadithNumber}</span>
                  <button onClick={() => { setActiveHadithNumber(''); setHadithNumberInput(''); setCurrentPage(1); }} className="hover:text-red-600">✕</button>
                </span>
              )}

              {selectedGrade !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-300">
                  <span>Grade: {selectedGrade}</span>
                  <button onClick={() => { setSelectedGrade('All'); setCurrentPage(1); }} className="hover:text-red-600">✕</button>
                </span>
              )}

              {(activeSearchQuery || activeHadithNumber || selectedChapterNum > 0 || selectedGrade !== 'All') && (
                <button
                  onClick={handleClearFilters}
                  className="text-emerald-700 hover:text-emerald-900 underline font-medium ml-1"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Right: Display Preferences Toggles */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              
              {/* Urdu Translation Toggle */}
              <button
                onClick={() => setShowUrdu(!showUrdu)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                  showUrdu 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                }`}
                title="Toggle Urdu translation"
              >
                اردو Translation: {showUrdu ? 'ON' : 'OFF'}
              </button>

              {/* English Translation Toggle */}
              <button
                onClick={() => setShowEnglish(!showEnglish)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                  showEnglish 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                }`}
              >
                English: {showEnglish ? 'ON' : 'OFF'}
              </button>

              {/* Arabic Font Slider */}
              <div className="hidden sm:flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1">
                <span className="text-[11px] text-stone-500">Arabic:</span>
                <input
                  type="range"
                  min="20"
                  max="36"
                  value={arabicFontSize}
                  onChange={e => setArabicFontSize(parseInt(e.target.value, 10))}
                  className="w-16 accent-emerald-700 h-1 bg-stone-200 rounded-lg cursor-pointer"
                  title={`Arabic Font: ${arabicFontSize}px`}
                />
                <span className="text-[10px] font-mono text-stone-600">{arabicFontSize}px</span>
              </div>

              {/* Per Page selector */}
              <div className="flex items-center gap-1">
                <span className="text-stone-500 text-[11px]">Show:</span>
                <select
                  value={perPage}
                  onChange={e => {
                    setPerPage(parseInt(e.target.value, 10));
                    setCurrentPage(1);
                  }}
                  className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Hadith List Container */}
        {loadingHadiths ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-700 border-t-transparent mb-4"></div>
            <h3 className="text-base font-bold text-stone-800">Searching Hadith Collections...</h3>
            <p className="text-xs text-stone-500 mt-1">Fetching authenticated hadith text, chains, and translations from HadithAPI</p>
          </div>
        ) : fetchError ? (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-xs">
            <Info className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">Connection Notice</h3>
            <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">{fetchError}</p>
            <button
              onClick={() => handlePageChange(currentPage)}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : hadiths.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
            <Scroll className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No hadiths found matching your criteria</h3>
            <p className="text-xs text-stone-500 mt-1">Try modifying your search keywords, clearing chapter filters, or switching canonical books.</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {hadiths.map((hadith) => {
              const isBooked = bookmarks.includes(hadith.id);
              const bookTitle = hadith.book?.bookName || currentBook?.bookName || hadith.bookSlug;
              const chapterTitle = hadith.chapter?.chapterEnglish || '';

              return (
                <div
                  key={hadith.id}
                  id={`hadith-card-${hadith.id}`}
                  className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all p-5 sm:p-6 shadow-xs"
                >
                  {/* Card Header: Metadata Badges & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3.5 border-b border-stone-100">
                    
                    {/* Left: Book, Chapter, Hadith Number, Grade */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-800 text-white text-xs font-bold shadow-xs">
                        <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                        <span>{bookTitle}</span>
                      </span>

                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-mono font-bold border border-stone-200">
                        Hadith #{hadith.hadithNumber}
                      </span>

                      {chapterTitle && (
                        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg bg-stone-50 text-stone-600 text-xs font-medium border border-stone-200">
                          {hadith.chapter?.chapterNumber ? `Ch. ${hadith.chapter.chapterNumber}: ` : ''}{chapterTitle}
                        </span>
                      )}

                      {getStatusBadge(hadith.status)}
                    </div>

                    {/* Right: Actions (Copy, Bookmark, Share) */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleBookmark(hadith)}
                        className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                          isBooked
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                        }`}
                        title={isBooked ? 'Bookmarked' : 'Save Hadith'}
                      >
                        {isBooked ? (
                          <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyHadith(hadith)}
                        className="p-1.5 rounded-xl text-xs text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Copy full Hadith with citation"
                      >
                        {copiedId === hadith.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleShareHadith(hadith)}
                        className="p-1.5 rounded-xl text-xs text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Share Hadith"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Heading / Chapter Context (if available) */}
                  {(hadith.headingEnglish || hadith.headingArabic) && (
                    <div className="mb-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      {hadith.headingEnglish && (
                        <span className="font-semibold text-stone-700">
                          <strong>Section:</strong> {hadith.headingEnglish}
                        </span>
                      )}
                      {hadith.headingArabic && (
                        <span className="font-serif text-right text-emerald-900 font-semibold dir-rtl">
                          {hadith.headingArabic}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Arabic Text */}
                  {hadith.hadithArabic && (
                    <div
                      className="font-serif text-right text-stone-900 leading-[2.3] dir-rtl select-text my-4 pr-1"
                      style={{ fontSize: `${arabicFontSize}px` }}
                    >
                      {hadith.hadithArabic}
                    </div>
                  )}

                  {/* English Translation */}
                  {showEnglish && (
                    <div className="border-t border-stone-100 pt-3 text-stone-700 text-sm sm:text-base leading-relaxed">
                      {hadith.englishNarrator && (
                        <span className="font-bold text-stone-900 block mb-1 italic">
                          {hadith.englishNarrator}
                        </span>
                      )}
                      <p className="select-text font-sans">
                        "{hadith.hadithEnglish}"
                      </p>
                    </div>
                  )}

                  {/* Urdu Translation (Optional Toggle) */}
                  {showUrdu && hadith.hadithUrdu && (
                    <div className="border-t border-stone-100 mt-3 pt-3 text-stone-800 text-sm sm:text-base leading-[2] dir-rtl font-serif text-right select-text bg-emerald-50/40 p-3 rounded-xl">
                      {hadith.urduNarrator && (
                        <span className="font-bold text-emerald-950 block mb-1">
                          {hadith.urduNarrator}
                        </span>
                      )}
                      <p>{hadith.hadithUrdu}</p>
                    </div>
                  )}

                  {/* Card Footer: Volume, Chapter Reference */}
                  <div className="mt-4 pt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-400">
                    <div className="flex items-center gap-2">
                      <span>{bookTitle}</span>
                      {hadith.volume && (
                        <>
                          <span>•</span>
                          <span>Vol. {hadith.volume}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Hadith #{hadith.hadithNumber}</span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-700">
                      <span>Grade: {hadith.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {lastPage > 1 && (
          <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Prev Page */}
            <button
              disabled={currentPage <= 1 || loadingHadiths}
              onClick={() => handlePageChange(currentPage - 1)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            {/* Page info & Jump input */}
            <div className="flex items-center gap-3 text-xs text-stone-600">
              <span>
                Page <strong className="text-emerald-900 font-bold">{currentPage}</strong> of <strong className="text-stone-800">{lastPage.toLocaleString()}</strong>
              </span>

              {/* Jump to page form */}
              <form onSubmit={handleJumpPage} className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max={lastPage}
                  value={jumpPageInput}
                  onChange={e => setJumpPageInput(e.target.value)}
                  placeholder="Go to..."
                  className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs text-center focus:outline-none focus:border-emerald-700"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
                >
                  Go
                </button>
              </form>
            </div>

            {/* Next Page */}
            <button
              disabled={currentPage >= lastPage || loadingHadiths}
              onClick={() => handlePageChange(currentPage + 1)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* BOOKMARKS MODAL */}
      {showBookmarksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 to-emerald-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-1">
                  <Bookmark className="w-4 h-4" />
                  <span>Personal Study Collection</span>
                </div>
                <h3 className="text-xl font-bold">Saved Hadiths ({bookmarkedItems.length})</h3>
              </div>
              <button
                onClick={() => setShowBookmarksModal(false)}
                className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Bookmarks List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
              {bookmarkedItems.length === 0 ? (
                <div className="text-center py-10 text-stone-500">
                  <Bookmark className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="text-sm font-semibold">No hadiths saved yet.</p>
                  <p className="text-xs text-stone-400 mt-1">Click the bookmark icon on any hadith card to save it here for offline reflection.</p>
                </div>
              ) : (
                bookmarkedItems.map(item => (
                  <div key={item.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/40 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-emerald-900">
                        {item.book?.bookName || item.bookSlug} • Hadith #{item.hadithNumber}
                      </span>
                      <button
                        onClick={() => toggleBookmark(item)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-stone-700 line-clamp-3 italic">
                      "{item.hadithEnglish}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span>Saved locally in your browser</span>
              <button
                onClick={() => setShowBookmarksModal(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-semibold cursor-pointer"
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
