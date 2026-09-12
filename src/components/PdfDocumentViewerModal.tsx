import React, { useState, useEffect, useRef } from 'react';
import { PrintableChartItem } from '../data/printableChartsData';
import { 
  Printer, 
  Download, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  ExternalLink,
  FileText,
  FileImage,
  Layers,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

interface PdfDocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PrintableChartItem | null;
}

export const PdfDocumentViewerModal: React.FC<PdfDocumentViewerModalProps> = ({
  isOpen,
  onClose,
  item
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset zoom on item change or modal open
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(100);
      setIsFullscreen(false);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, item]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  // Detect file format
  const isPdf = 
    item.fileType === 'pdf' || 
    (item.fileName && item.fileName.toLowerCase().endsWith('.pdf')) ||
    (item.fileDataUrl && item.fileDataUrl.startsWith('data:application/pdf'));

  const isImage = 
    item.fileType === 'image' || 
    Boolean(item.imageUrl) ||
    (item.fileDataUrl && item.fileDataUrl.startsWith('data:image/')) ||
    (item.fileName && /\.(png|jpe?g|webp|gif|svg)$/i.test(item.fileName));

  const isDocx = 
    item.fileType === 'docx' || 
    item.fileType === 'doc' ||
    (item.fileName && /\.(docx?|odt|rtf)$/i.test(item.fileName));

  const primaryFileUrl = item.fileDataUrl || item.imageUrl || (item.attachments && item.attachments[0]?.dataUrl) || '';

  // Handle direct file download
  const handleDownload = () => {
    if (primaryFileUrl) {
      const link = document.createElement('a');
      link.href = primaryFileUrl;
      const extension = isPdf ? 'pdf' : isImage ? 'png' : isDocx ? 'docx' : 'pdf';
      const cleanName = (item.fileName || `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-centre-of-islam.${extension}`);
      link.download = cleanName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Structured fallback print-to-pdf
      window.print();
    }
  };

  // Handle printing
  const handlePrint = () => {
    if (isImage && primaryFileUrl) {
      // Print image cleanly in high quality
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${item.title} - The Centre of Islam</title>
              <style>
                @page { size: auto; margin: 0; }
                body {
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background: #fff;
                }
                img {
                  width: 100%;
                  height: auto;
                  max-height: 100vh;
                  object-fit: contain;
                }
              </style>
            </head>
            <body>
              <img src="${primaryFileUrl}" onload="window.focus(); window.print(); window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else if (isPdf && iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.print();
      } catch {
        window.print();
      }
    } else {
      window.print();
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-3xl shadow-2xl flex flex-col border border-stone-300 overflow-hidden transition-all duration-200 ${
          isFullscreen 
            ? 'w-full h-full rounded-none' 
            : 'w-full max-w-6xl h-[92vh] max-h-[1000px]'
        }`}
      >
        {/* TOP TOOLBAR */}
        <div className="bg-stone-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 border-b border-stone-800 flex-shrink-0">
          {/* Left info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/80 text-emerald-300 flex items-center justify-center flex-shrink-0 shadow-xs">
              {isImage ? <FileImage className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  {item.itemType || 'Poster'}
                </span>
                <span className="text-[10px] text-stone-400 font-medium">
                  {item.category}
                </span>
                {item.fileSize && (
                  <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
                    • {item.fileSize}
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-sm sm:max-w-md md:max-w-lg mt-0.5">
                {item.title}
              </h2>
            </div>
          </div>

          {/* Right action controls */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Zoom controls for images & documents */}
            {isImage && (
              <div className="hidden sm:flex items-center bg-stone-800 rounded-xl p-1 border border-stone-700">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="p-1.5 text-stone-300 hover:text-white disabled:opacity-40 rounded-lg hover:bg-stone-700 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-semibold px-2 min-w-[3rem] text-center text-stone-200">
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 300}
                  className="p-1.5 text-stone-300 hover:text-white disabled:opacity-40 rounded-lg hover:bg-stone-700 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-700 transition-colors"
                  title="Reset Zoom (100%)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* External / Canva link if available */}
            {item.externalUrl && (
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-colors hidden md:flex items-center gap-1.5 text-xs font-medium"
                title="Open Canva or Source Document"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Canva Link</span>
              </a>
            )}

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              title="Print document or poster"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              title="Download file to computer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-rose-900/40 rounded-xl transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEWER CANVAS BODY */}
        <div className="flex-1 bg-stone-100 overflow-auto relative">
          {/* CASE 1: EMBEDDED PDF VIEWER */}
          {isPdf && primaryFileUrl && (
            <div className="w-full h-full flex flex-col">
              <iframe
                ref={iframeRef}
                src={primaryFileUrl}
                title={item.title}
                className="w-full flex-1 border-0 bg-stone-200"
              />
              <div className="bg-stone-200 text-stone-700 px-4 py-2 text-xs flex items-center justify-between border-t border-stone-300">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-stone-500" />
                  <span>Viewing PDF document. Use toolbar buttons to print, zoom, or save.</span>
                </span>
                <button 
                  onClick={handleDownload}
                  className="font-bold text-emerald-800 hover:underline"
                >
                  Direct Download Link →
                </button>
              </div>
            </div>
          )}

          {/* CASE 2: HIGH-RES CANVA GRAPHIC OR POSTER IMAGE */}
          {isImage && primaryFileUrl && !isPdf && (
            <div className="w-full h-full min-h-[400px] overflow-auto flex items-center justify-center p-4 sm:p-8 bg-stone-950 select-none">
              <div 
                style={{ 
                  transform: `scale(${zoomLevel / 100})`, 
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out' 
                }}
                className="max-w-full flex items-center justify-center shadow-2xl rounded-xl overflow-hidden"
              >
                <img
                  src={primaryFileUrl}
                  alt={item.title}
                  className="max-w-full max-h-[82vh] object-contain rounded-lg border border-stone-800 bg-white"
                />
              </div>
            </div>
          )}

          {/* CASE 3: DOCX / OFFICE DOCUMENT */}
          {isDocx && (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-800 flex items-center justify-center shadow-sm border border-blue-200">
                <FileText className="w-10 h-10" />
              </div>
              <div className="max-w-md space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-blue-100 text-blue-900 rounded-full">
                  Microsoft Word Document (.docx)
                </span>
                <h3 className="text-xl font-bold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {item.description}
                </p>
                {item.fileSize && (
                  <p className="text-xs text-stone-400 font-mono">
                    File size: {item.fileSize}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Document (.docx)</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer border border-stone-300"
                >
                  <Printer className="w-5 h-5" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>
          )}

          {/* CASE 4: STRUCTURED ISLAMIC STUDY SHEET (Wudu, Salah, Adhkar, or Custom) */}
          {(!primaryFileUrl || item.sections) && (
            <div className="p-4 sm:p-8 md:p-12 max-w-4xl mx-auto space-y-8">
              <div className="printable-sheet bg-white rounded-3xl p-6 sm:p-12 border-2 border-stone-300 shadow-xl text-stone-900 space-y-8">
                {/* Islamic Document Header */}
                <div className="text-center border-b-2 border-stone-900 pb-6 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800">
                    <span>The Centre of Islam</span>
                    <span>•</span>
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-[11px] font-extrabold">{item.itemType || 'Educational Guide'}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-950 font-serif">
                    {item.title}
                  </h1>
                  {item.subtitle && (
                    <p className="text-sm font-medium text-stone-600">
                      {item.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-stone-500 max-w-xl mx-auto italic pt-1">
                    {item.description}
                  </p>
                </div>

                {/* Structured Sections */}
                {item.sections && item.sections.length > 0 && (
                  <div className="space-y-6">
                    {item.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-4">
                        <h3 className="text-base sm:text-lg font-bold text-stone-900 border-b border-stone-300 pb-1.5 uppercase tracking-wide flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-800"></span>
                          <span>{sec.heading}</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {sec.items.map((it, iIdx) => (
                            <div 
                              key={iIdx} 
                              className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs uppercase tracking-wide text-emerald-800">
                                  {it.label || `Point ${iIdx + 1}`}
                                </span>
                                {it.arabic && (
                                  <span className="font-arabic text-lg font-bold text-stone-900">
                                    {it.arabic}
                                  </span>
                                )}
                              </div>
                              {it.transliteration && (
                                <p className="text-xs font-serif italic text-stone-700">
                                  {it.transliteration}
                                </p>
                              )}
                              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                                {it.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Citation */}
                <div className="pt-6 border-t-2 border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-2">
                  <span>{item.footerNote || 'Free to download, print, and distribute for educational benefit.'}</span>
                  <span className="font-bold uppercase tracking-wider text-emerald-900">the-centre-of-islam.vercel.app</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="bg-white border-t border-stone-200 px-6 py-2.5 flex items-center justify-between text-xs text-stone-500 flex-shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official Educational Publication • Verified References</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded font-mono text-[10px]">Esc</kbd> to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
