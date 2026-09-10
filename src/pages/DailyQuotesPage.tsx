import React, { useState } from 'react';
import { DAILY_QUOTES } from '../data/quotesData';
import { QuoteItem } from '../types';
import { 
  Quote, 
  Sparkles, 
  Copy, 
  Check, 
  Shuffle, 
  Download, 
  Share2, 
  Image as ImageIcon,
  X
} from 'lucide-react';

export const DailyQuotesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [posterModalQuote, setPosterModalQuote] = useState<QuoteItem | null>(null);

  const categories = ['All', 'Patience & Hope', 'Gratitude', 'Mercy & Forgiveness', 'Knowledge', 'Good Character', 'Prayer & Remembrance'];

  const filteredQuotes = DAILY_QUOTES.filter(q => 
    selectedCategory === 'All' || q.category === selectedCategory
  );

  const currentDaily = DAILY_QUOTES[activeQuoteIndex % DAILY_QUOTES.length];

  const handleNextQuote = () => {
    setActiveQuoteIndex(prev => (prev + 1) % DAILY_QUOTES.length);
  };

  const handleCopy = (quote: QuoteItem) => {
    const textToCopy = `"${quote.quote}"\n— ${quote.source}\nVia Centre of Islam`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Quote className="w-4 h-4" />
            <span>Islamic Inspiration & Reminders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Daily Quotes of Reflection
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Profound ayahs from the Noble Quran and radiant words of the Beloved Prophet (ﷺ).
          </p>
        </div>

        <button
          id="shuffle-quote-btn"
          onClick={handleNextQuote}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Next Inspiring Quote</span>
        </button>
      </div>

      {/* Featured Quote Spotlight Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-emerald-800 shadow-xl text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Quote of the Day • {currentDaily.category}</span>
        </div>

        {currentDaily.arabic && (
          <p dir="rtl" className="font-arabic text-2xl sm:text-4xl text-amber-300 leading-relaxed font-normal">
            {currentDaily.arabic}
          </p>
        )}

        <blockquote className="text-xl sm:text-3xl font-serif italic text-white/95 max-w-3xl mx-auto leading-relaxed">
          "{currentDaily.quote}"
        </blockquote>

        <div className="pt-2 text-sm text-emerald-200 font-semibold tracking-wide">
          — {currentDaily.source}
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => handleCopy(currentDaily)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-colors border border-white/20"
          >
            {copiedId === currentDaily.id ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId === currentDaily.id ? 'Copied' : 'Copy Quote'}</span>
          </button>
          <button
            onClick={() => setPosterModalQuote(currentDaily)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Generate Poster Card</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === c
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Quotes Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredQuotes.map((q) => {
          const isCopied = copiedId === q.id;
          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {q.category}
                  </span>
                  <span className="font-mono text-[11px]">{q.source}</span>
                </div>

                {q.arabic && (
                  <p dir="rtl" className="font-arabic text-xl text-stone-800 text-right leading-loose">
                    {q.arabic}
                  </p>
                )}

                <p className="text-stone-800 text-sm leading-relaxed italic">
                  "{q.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => setPosterModalQuote(q)}
                  className="text-xs text-stone-600 hover:text-emerald-800 font-semibold flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Card View</span>
                </button>

                <button
                  onClick={() => handleCopy(q)}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                    isCopied ? 'text-emerald-800 font-bold' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Poster Card Modal */}
      {posterModalQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setPosterModalQuote(null)}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster Canvas */}
            <div id="quote-poster-canvas" className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 text-white p-8 sm:p-10 text-center space-y-6 border-b border-emerald-800">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/30">
                <span className="font-arabic text-xl">☪</span>
              </div>

              {posterModalQuote.arabic && (
                <p dir="rtl" className="font-arabic text-2xl sm:text-3xl text-amber-300 leading-relaxed font-normal">
                  {posterModalQuote.arabic}
                </p>
              )}

              <p className="text-lg sm:text-xl font-serif italic text-white/95 leading-relaxed">
                "{posterModalQuote.quote}"
              </p>

              <div className="pt-2">
                <div className="text-sm font-semibold text-amber-200">
                  {posterModalQuote.source}
                </div>
                <div className="text-[11px] text-emerald-300/80 uppercase tracking-widest mt-1">
                  Centre of Islam • Islamic Guidance
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 flex items-center justify-between text-xs">
              <span className="text-stone-500">Perfect for sharing with family & friends</span>
              <button
                onClick={() => handleCopy(posterModalQuote)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Quote Text</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
