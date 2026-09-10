import React, { useState } from 'react';
import { PRINTABLE_CHARTS, PrintableChartItem } from '../data/printableChartsData';
import { 
  Printer, 
  Download, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Maximize2, 
  X 
} from 'lucide-react';

export const PrintablesPage: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<PrintableChartItem>(PRINTABLE_CHARTS[0]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const handlePrint = (chart: PrintableChartItem) => {
    setSelectedChart(chart);
    // Allow brief render then trigger print
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
          <button
            onClick={() => handlePrint(selectedChart)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Current Chart</span>
          </button>
        </div>
      </div>

      {/* Chart Selector Cards (no-print) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {PRINTABLE_CHARTS.map((chart) => {
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
                <p className={`text-xs mt-2 leading-relaxed ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
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
                      <div className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                        {item.step && (
                          <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-mono shrink-0">
                            {item.step}
                          </span>
                        )}
                        <span>{item.label}</span>
                      </div>
                    </div>

                    {item.arabic && (
                      <p dir="rtl" className="font-arabic text-lg text-emerald-950 text-right my-1">
                        {item.arabic}
                      </p>
                    )}

                    {item.transliteration && (
                      <p className="text-[11px] text-stone-500 italic font-mono">
                        {item.transliteration}
                      </p>
                    )}

                    <p className="text-xs text-stone-700 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Salah Blank Printable Table (Special view for Salah Breakdown or Tracker) */}
        {selectedChart.id === 'salah-breakdown' && (
          <div className="mt-6 pt-4 border-t border-stone-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 mb-2">
              Weekly Prayer Consistency Scorecard (Cut & Check)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse border border-stone-300">
                <thead>
                  <tr className="bg-stone-100 font-bold">
                    <th className="border border-stone-300 p-2 text-left">Day</th>
                    <th className="border border-stone-300 p-2">Fajr (2)</th>
                    <th className="border border-stone-300 p-2">Dhuhr (4)</th>
                    <th className="border border-stone-300 p-2">Asr (4)</th>
                    <th className="border border-stone-300 p-2">Maghrib (3)</th>
                    <th className="border border-stone-300 p-2">Isha (4)</th>
                    <th className="border border-stone-300 p-2">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                    <tr key={day}>
                      <td className="border border-stone-300 p-2 text-left font-semibold">{day}</td>
                      <td className="border border-stone-300 p-2">▢</td>
                      <td className="border border-stone-300 p-2">▢</td>
                      <td className="border border-stone-300 p-2">▢</td>
                      <td className="border border-stone-300 p-2">▢</td>
                      <td className="border border-stone-300 p-2">▢</td>
                      <td className="border border-stone-300 p-2 font-mono">/5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Poster Footer Note */}
        <div className="pt-6 border-t-2 border-stone-900 text-center space-y-1">
          <p className="text-xs font-semibold text-stone-800">
            {selectedChart.footerNote}
          </p>
          <p className="text-[10px] text-stone-500 tracking-wider uppercase">
            Printed from Centre of Islam • Dedicated for personal & madrasah education
          </p>
        </div>
      </div>
    </div>
  );
};
