import React, { useState, useEffect, useMemo } from 'react';
import { PRINTABLE_CHARTS, PrintableChartItem } from '../data/printableChartsData';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { PdfDocumentViewerModal } from '../components/PdfDocumentViewerModal';
import { 
  Printer, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  FileText, 
  FileImage, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Tag, 
  ChevronRight,
  ExternalLink,
  BookOpen,
  X
} from 'lucide-react';

interface PrintablesPageProps {
  onNavigate?: (page: string) => void;
}

export const PrintablesPage: React.FC<PrintablesPageProps> = ({ onNavigate }) => {
  const { isAdmin } = useAuth();
  const [allCharts, setAllCharts] = useState<PrintableChartItem[]>(PRINTABLE_CHARTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // PDF / Document Viewer Modal state
  const [activeViewerItem, setActiveViewerItem] = useState<PrintableChartItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  // Fetch admin uploaded posters/charts/notes from Firestore
  useEffect(() => {
    const fetchAdminCharts = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'printable_charts'));
        const customCharts: PrintableChartItem[] = [];
        snap.forEach((d) => {
          const data = d.data();
          let parsedSections = [];
          let parsedAttachments = [];
          try {
            parsedSections = typeof data.sections === 'string' ? JSON.parse(data.sections) : data.sections || [];
          } catch {
            parsedSections = [];
          }
          try {
            parsedAttachments = typeof data.attachments === 'string' ? JSON.parse(data.attachments) : data.attachments || [];
          } catch {
            parsedAttachments = [];
          }

          // Determine primary file url
          const primaryFileUrl = data.fileDataUrl || data.imageUrl || (parsedAttachments[0]?.dataUrl) || '';

          // Determine file format
          let inferredFileType = data.fileType || 'other';
          if (!data.fileType) {
            if (primaryFileUrl.startsWith('data:application/pdf') || (data.fileName && data.fileName.endsWith('.pdf'))) {
              inferredFileType = 'pdf';
            } else if (primaryFileUrl.startsWith('data:image/') || data.imageUrl) {
              inferredFileType = 'image';
            } else if (data.fileName && /\.(docx?)$/i.test(data.fileName)) {
              inferredFileType = 'docx';
            }
          }

          customCharts.push({
            id: d.id,
            title: data.title || '',
            subtitle: data.subtitle || '',
            itemType: data.itemType || 'Poster',
            category: data.category || 'Salah & Worship',
            description: data.description || '',
            fileType: inferredFileType,
            fileName: data.fileName || (parsedAttachments[0]?.name) || '',
            fileSize: data.fileSize || (parsedAttachments[0]?.size) || '',
            fileDataUrl: primaryFileUrl,
            imageUrl: data.imageUrl || (inferredFileType === 'image' ? primaryFileUrl : undefined),
            externalUrl: data.externalUrl || '',
            attachments: parsedAttachments,
            sections: parsedSections,
            footerNote: data.footerNote || '',
            authorEmail: data.authorEmail,
            createdAt: data.createdAt
          });
        });

        // Merge custom charts (most recent first) with default reference charts
        if (customCharts.length > 0) {
          // Put newest custom items at the front
          setAllCharts([...customCharts, ...PRINTABLE_CHARTS]);
        }
      } catch (err) {
        console.warn('Could not load extra admin charts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminCharts();
  }, []);

  // Compute available Types dynamically (e.g. 'Poster', 'Chart', 'Notes', 'Infographic', etc.)
  const availableTypes = useMemo(() => {
    const typesSet = new Set<string>();
    allCharts.forEach((item) => {
      if (item.itemType) {
        typesSet.add(item.itemType.trim());
      }
    });
    return ['All', ...Array.from(typesSet)];
  }, [allCharts]);

  // Compute available Categories dynamically
  const availableCategories = useMemo(() => {
    const catSet = new Set<string>();
    allCharts.forEach((item) => {
      if (item.category) {
        catSet.add(item.category.trim());
      }
    });
    return ['All', ...Array.from(catSet)];
  }, [allCharts]);

  // Filtered charts
  const filteredCharts = useMemo(() => {
    return allCharts.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.itemType && item.itemType.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q);

      const matchesType = 
        selectedType === 'All' || 
        (item.itemType && item.itemType.toLowerCase() === selectedType.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'All' || 
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [allCharts, searchQuery, selectedType, selectedCategory]);

  // Open viewer modal
  const handleOpenViewer = (item: PrintableChartItem) => {
    setActiveViewerItem(item);
    setIsViewerOpen(true);
  };

  // Direct download handler
  const handleDownloadDirect = (e: React.MouseEvent, item: PrintableChartItem) => {
    e.stopPropagation();
    const primaryFileUrl = item.fileDataUrl || item.imageUrl || (item.attachments && item.attachments[0]?.dataUrl);
    if (primaryFileUrl) {
      const link = document.createElement('a');
      link.href = primaryFileUrl;
      const isPdf = item.fileType === 'pdf' || (item.fileName && item.fileName.endsWith('.pdf'));
      const isImage = item.fileType === 'image' || Boolean(item.imageUrl);
      const isDocx = item.fileType === 'docx' || (item.fileName && item.fileName.endsWith('.docx'));
      const ext = isPdf ? 'pdf' : isImage ? 'png' : isDocx ? 'docx' : 'pdf';
      link.download = item.fileName || `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-the-centre-of-islam.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Open in viewer so they can view and print
      handleOpenViewer(item);
    }
  };

  // Direct print handler
  const handlePrintDirect = (e: React.MouseEvent, item: PrintableChartItem) => {
    e.stopPropagation();
    const primaryFileUrl = item.fileDataUrl || item.imageUrl || (item.attachments && item.attachments[0]?.dataUrl);
    
    if (item.fileType === 'image' && primaryFileUrl) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${item.title}</title>
              <style>
                @page { size: auto; margin: 0mm; }
                body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
                img { width: 100%; max-height: 100vh; object-fit: contain; }
              </style>
            </head>
            <body>
              <img src="${primaryFileUrl}" onload="window.focus(); window.print(); window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      // Open in viewer and prompt
      handleOpenViewer(item);
    }
  };

  // Helper for type color styles
  const getTypeBadgeStyle = (itemType: string = 'Poster') => {
    const t = itemType.toLowerCase();
    if (t.includes('poster')) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (t.includes('chart')) return 'bg-amber-100 text-amber-900 border-amber-300';
    if (t.includes('notes') || t.includes('note')) return 'bg-blue-100 text-blue-900 border-blue-300';
    if (t.includes('infographic')) return 'bg-purple-100 text-purple-900 border-purple-300';
    if (t.includes('syllabus') || t.includes('curriculum')) return 'bg-rose-100 text-rose-900 border-rose-300';
    return 'bg-stone-100 text-stone-800 border-stone-300';
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
            <span>Educational Publication & Visual Resources</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            Posters, Charts & Study Materials
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            High-contrast visual guides, Canva-designed infographics, and syllabus sheets. 
            Click any card to inspect it inside our PDF and high-definition viewer, download the file, or print it.
          </p>
        </div>

        {isAdmin && onNavigate && (
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Upload New Material (Admin)</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, description, category, or type (e.g. 'poster', 'wudu', 'canva', 'salah')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Type Filter Chips (User can type any type in admin like 'poster', 'notes', 'chart', 'etc') */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-emerald-800" />
            <span>Filter by Type:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {availableTypes.map((type) => {
              const isSelected = selectedType.toLowerCase() === type.toLowerCase();
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {type === 'All' ? 'All Types' : type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filters */}
        {availableCategories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-stone-100 scrollbar-thin text-xs">
            <span className="font-semibold text-stone-400 text-[11px] whitespace-nowrap">Category:</span>
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-stone-800 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat === 'All' ? 'All Subjects' : cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 shadow-xs space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-medium">Loading materials & posters...</p>
        </div>
      ) : filteredCharts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7 text-emerald-800" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-lg">No materials found</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-1 leading-relaxed">
              No posters or charts matched your search filters. Try selecting "All Types" or clearing your query.
            </p>
          </div>
          <button
            onClick={() => { setSearchQuery(''); setSelectedType('All'); setSelectedCategory('All'); }}
            className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharts.map((item) => {
            const hasImage = Boolean(item.imageUrl || (item.fileDataUrl && item.fileDataUrl.startsWith('data:image/')));
            const isPdf = item.fileType === 'pdf' || (item.fileName && item.fileName.toLowerCase().endsWith('.pdf'));
            const isDocx = item.fileType === 'docx' || item.fileType === 'doc';
            const displayType = item.itemType || 'Poster';

            return (
              <div
                key={item.id}
                onClick={() => handleOpenViewer(item)}
                className="group bg-white rounded-3xl border border-stone-200 hover:border-emerald-500/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
              >
                {/* Visual Thumbnail Banner */}
                <div className="relative aspect-[16/10] bg-stone-900 overflow-hidden flex items-center justify-center border-b border-stone-100">
                  {hasImage ? (
                    <>
                      <img
                        src={item.imageUrl || item.fileDataUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-stone-950/25 group-hover:bg-stone-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                        <span className="px-4 py-2 rounded-xl bg-white/95 text-stone-900 text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Open in PDF Viewer</span>
                        </span>
                      </div>
                    </>
                  ) : isPdf ? (
                    <div className="w-full h-full bg-gradient-to-br from-stone-800 via-stone-900 to-emerald-950 p-6 flex flex-col items-center justify-center text-center space-y-2 group-hover:scale-102 transition-transform duration-300">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center shadow-inner">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-white text-xs font-bold tracking-tight px-3 line-clamp-1">
                        {item.fileName || 'Official PDF Document'}
                      </span>
                      <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Click to view in PDF viewer
                      </span>
                    </div>
                  ) : isDocx ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-950 p-6 flex flex-col items-center justify-center text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-white text-xs font-bold line-clamp-1">{item.fileName || 'Word Document'}</span>
                      <span className="text-[11px] text-blue-200">Download & Print</span>
                    </div>
                  ) : (
                    // Default structured study sheet mockup
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-stone-900 to-stone-950 p-6 flex flex-col items-center justify-center text-center space-y-2 text-white">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-amber-300 border border-emerald-400/30 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-serif italic text-emerald-200 line-clamp-1">{item.subtitle || 'Educational Publication'}</span>
                      <span className="text-[11px] text-stone-300 flex items-center gap-1">
                        <Eye className="w-3 h-3 text-amber-400" /> Click to open in document viewer
                      </span>
                    </div>
                  )}

                  {/* Top floating format pill */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {isPdf && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                        PDF
                      </span>
                    )}
                    {hasImage && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                        Canva Graphic
                      </span>
                    )}
                    {isDocx && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                        DOCX
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Header Chips */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {/* Custom typed thing badge */}
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${getTypeBadgeStyle(displayType)}`}>
                        {displayType}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        {item.category}
                      </span>
                    </div>

                    {/* Name / Title */}
                    <h3 className="font-bold text-stone-900 text-base sm:text-lg leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Actions & Footer */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                    {/* Open in Viewer Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenViewer(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Viewer</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Print Button */}
                      <button
                        type="button"
                        onClick={(e) => handlePrintDirect(e, item)}
                        className="p-2 rounded-xl text-stone-600 hover:text-emerald-800 hover:bg-stone-100 transition-colors border border-stone-200 cursor-pointer"
                        title="Print document or poster"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* Download Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDownloadDirect(e, item)}
                        className="p-2 rounded-xl text-stone-600 hover:text-amber-600 hover:bg-amber-50 transition-colors border border-stone-200 cursor-pointer"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PDF & Document Viewer Modal */}
      <PdfDocumentViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        item={activeViewerItem}
      />
    </div>
  );
};
