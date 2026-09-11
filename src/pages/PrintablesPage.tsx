import React, { useState, useEffect } from 'react';
import { PRINTABLE_CHARTS, PrintableChartItem } from '../data/printableChartsData';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { 
  Printer, 
  Download, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Maximize2, 
  X,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface PrintablesPageProps {
  onNavigate?: (page: string) => void;
}

export const PrintablesPage: React.FC<PrintablesPageProps> = ({ onNavigate }) => {
  const { isAdmin } = useAuth();
  const [allCharts, setAllCharts] = useState<PrintableChartItem[]>(PRINTABLE_CHARTS);
  const [selectedChart, setSelectedChart] = useState<PrintableChartItem>(PRINTABLE_CHARTS[0]);

  // Fetch admin uploaded charts from Firestore
  useEffect(() => {
    const fetchAdminCharts = async () => {
      try {
        const snap = await getDocs(collection(db, 'printable_charts'));
        const customCharts: PrintableChartItem[] = [];
        snap.forEach((d) => {
          const data = d.data();
          let parsedSections = [];
          let parsedAttachments = [];
          try {
            parsedSections = typeof data.sections === 'string' ? JSON.parse(data.sections) : data.sections;
          } catch {
            parsedSections = [];
          }
          try {
            parsedAttachments = typeof data.attachments === 'string' ? JSON.parse(data.attachments) : data.attachments;
          } catch {
            parsedAttachments = [];
          }

          customCharts.push({
            id: d.id,
            title: data.title || '',
            subtitle: data.subtitle || '',
            category: data.category || 'Salah & Worship',
            description: data.description || '',
            imageUrl: data.imageUrl || (parsedAttachments[0]?.dataUrl),
            attachments: parsedAttachments,
            orientation: (data.orientation as any) || 'portrait',
            sections: parsedSections,
            footerNote: data.footerNote || ''
          });
        });

        if (customCharts.length > 0) {
          setAllCharts([...PRINTABLE_CHARTS, ...customCharts]);
        }
      } catch (err) {
        console.warn('Could not load extra admin charts:', err);
      }
    };

    fetchAdminCharts();
  }, []);

  const handlePrint = (chart: PrintableChartItem) => {
    setSelectedChart(chart);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Printer className="w-4 h-4" />
            <span>Islamic Wall Posters & Learning Guides</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Printable Charts & Posters
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            High-contrast, printer-friendly Islamic charts for classrooms, home prayer corners, and personal study.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && onNavigate && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Upload New Poster (Admin)</span>
            </button>
          )}

          <button
            onClick={() => handlePrint(selectedChart)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Current Chart</span>
          </button>
        </div>
      </div>

      {/* Chart Selector Cards (no-print) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {allCharts.map((chart) => {
          const isSelected = selectedChart.id === chart.id;
          return (
            <div
              key={chart.id}
              onClick={() => setSelectedChart(chart)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-900 text-white border-emerald-800 shadow-md ring-2 ring-amber-400/60'
                  : 'bg-white text-stone-900 border-stone-200 shadow-xs hover:border-emerald-300'
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-emerald-800 text-amber-300' : 'bg-stone-100 text-stone-600'
                }`}>
                  {chart.category}
                </span>
                <h3 className="font-bold text-sm sm:text-base mt-2 leading-snug">
                  {chart.title}
                </h3>
                <p className={`text-xs mt-2 leading-relaxed line-clamp-3 ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                  {chart.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100/20 flex items-center justify-between text-xs font-semibold">
                <span className={isSelected ? 'text-amber-300' : 'text-emerald-800'}>
                  {isSelected ? '● Viewing Chart' : 'Select Chart'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrint(chart);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isSelected ? 'hover:bg-emerald-800 text-white' : 'hover:bg-stone-100 text-stone-600'
                  }`}
                  title="Print directly"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Printable Display Paper */}
      <div className="printable-area bg-white rounded-3xl p-8 sm:p-12 border-2 border-stone-300 shadow-lg max-w-4xl mx-auto text-stone-900 space-y-8">
        {/* Poster Header */}
        <div className="text-center border-b-2 border-stone-900 pb-6 space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800">
            <span>Centre of Islam</span>
            <span>•</span>
            <span>Educational Publication</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-950 font-serif">
            {selectedChart.title}
          </h2>
          <p className="text-sm font-medium text-stone-600">
            {selectedChart.subtitle}
          </p>
        </div>

        {/* If the poster has an uploaded graphic image from computer */}
        {selectedChart.imageUrl && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-stone-300 shadow-sm bg-stone-50">
              <img
                src={selectedChart.imageUrl}
                alt={selectedChart.title}
                className="w-full h-auto object-contain max-h-[800px] mx-auto"
              />
            </div>
            <div className="text-center no-print">
              <a
                href={selectedChart.imageUrl}
                download={`${selectedChart.title.toLowerCase().replace(/\s+/g, '-')}-poster.png`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Download High-Res Poster File</span>
              </a>
            </div>
          </div>
        )}

        {/* Poster Sections */}
        <div className="space-y-6">
          {selectedChart.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-lg font-bold text-stone-900 border-b border-stone-200 pb-1.5 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-800"></span>
                <span>{section.heading}</span>
              </h3>

              <div className={`grid gap-4 ${
                selectedChart.id === 'names-of-allah' 
                  ? 'grid-cols-2 sm:grid-cols-4' 
                  : 'grid-cols-1 sm:grid-cols-2'
              }`}>
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wide text-emerald-800">
                        {item.label}
                      </span>
                      {item.arabic && (
                        <span className="font-arabic text-lg font-bold text-stone-900">
                          {item.arabic}
                        </span>
                      )}
                    </div>
                    {item.transliteration && (
                      <p className="text-xs font-serif italic text-stone-700">
                        {item.transliteration}
                      </p>
                    )}
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Poster Footer Citation */}
        <div className="pt-6 border-t-2 border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-2">
          <span>{selectedChart.footerNote || 'Free to download, print, and distribute for non-commercial educational purposes.'}</span>
          <span className="font-bold uppercase tracking-wider text-emerald-900">centre-of-islam.vercel.app</span>
        </div>
      </div>
    </div>
  );
};
