import React, { useState } from 'react';
import { HADITH_COLLECTION } from '../data/hadithData';
import { HadithItem } from '../types';
import { 
  Scroll, 
  Search, 
  Copy, 
  Check, 
  Share2, 
  BookMarked, 
  Tag, 
  CheckCircle2 
} from 'lucide-react';

export const HadithPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedBook, setSelectedBook] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const topics = ['All', 'Intentions & Sincerity', 'Purity & Faith', 'Brotherhood & Character', 'Guarding Speech', 'Seeking Knowledge', 'Kindness & Mercy', 'Tawakkul & Trust in Allah', 'Dhikr & Remembrance', 'Repentance (Tawbah)', 'Charity & Good Deeds'];
  const books = ['All', 'Sahih al-Bukhari', 'Sahih Muslim', '40 Hadith Nawawi', 'Riyad as-Salihin', 'Sunan at-Tirmidhi'];

  const filteredHadiths = HADITH_COLLECTION.filter(h => {
    const matchesSearch = 
      h.englishText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.narrator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.arabicText && h.arabicText.includes(searchQuery)) ||
      h.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'All' || h.topic === selectedTopic;
    const matchesBook = selectedBook === 'All' || h.book.includes(selectedBook);
    return matchesSearch && matchesTopic && matchesBook;
  });

  const handleCopy = (hadith: HadithItem) => {
    const textToCopy = `"${hadith.englishText}"\n— ${hadith.narrator}\n[${hadith.book}, Hadith ${hadith.hadithNumber} - Grade: ${hadith.grade || 'Sahih'}]\nVia Centre of Islam`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Scroll className="w-4 h-4" />
            <span>The Prophetic Traditions (الحديث النبوي الشريف)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Authentic Hadith Collections
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Carefully verified traditions from Sahih al-Bukhari, Sahih Muslim, 40 Hadith Nawawi, and Riyad as-Salihin.
          </p>
        </div>

        <div className="text-xs text-stone-500 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
          Showing <strong className="text-emerald-900">{filteredHadiths.length}</strong> authenticated hadiths
        </div>
      </div>

      {/* Search & Topic Filters */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="relative">
          <input
            id="hadith-search-input"
            type="text"
            placeholder="Search hadith by topic, narrator, wording, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Filter Pills */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Filter by Topic:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedTopic === t
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hadith Cards Feed */}
      <div className="space-y-5">
        {filteredHadiths.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500 text-sm">No hadiths matching your search filters.</p>
          </div>
        ) : (
          filteredHadiths.map((hadith) => {
            const isCopied = copiedId === hadith.id;
            return (
              <div
                key={hadith.id}
                id={`hadith-card-${hadith.id}`}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4 hover:border-emerald-200 transition-colors"
              >
                {/* Meta Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                      {hadith.book}
                    </span>
                    <span className="text-stone-500">
                      Hadith #{hadith.hadithNumber}
                    </span>
                    {hadith.grade && (
                      <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-semibold border border-amber-200">
                        {hadith.grade}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md font-medium">
                      {hadith.topic}
                    </span>
                    <button
                      onClick={() => handleCopy(hadith)}
                      className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                        isCopied
                          ? 'bg-emerald-800 text-white'
                          : 'text-stone-500 hover:text-emerald-800 hover:bg-stone-100'
                      }`}
                      title="Copy hadith text with citation"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Arabic Text if provided */}
                {hadith.arabicText && (
                  <p
                    dir="rtl"
                    className="font-arabic text-xl sm:text-2xl text-stone-900 leading-loose text-right"
                  >
                    {hadith.arabicText}
                  </p>
                )}

                {/* English Text */}
                <p className="text-stone-800 text-base sm:text-lg leading-relaxed font-normal">
                  {hadith.englishText}
                </p>

                {/* Narrator */}
                <div className="pt-2 flex items-center justify-between text-xs text-stone-500 italic">
                  <span>{hadith.narrator}</span>
                  <span className="not-italic text-[11px] text-emerald-800 font-semibold">
                    Centre of Islam Authentic Repository
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
