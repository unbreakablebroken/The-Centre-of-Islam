import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { GeneralNoteItem, NoteAttachment } from '../types';
import { 
  FileText, 
  Search, 
  Printer, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Paperclip,
  Download,
  FileImage,
  FileSpreadsheet,
  FileCode,
  File,
  Sparkles,
  HelpCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface StudyNotesPageProps {
  onNavigate?: (page: string) => void;
}

export const StudyNotesPage: React.FC<StudyNotesPageProps> = ({ onNavigate }) => {
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [allNotes, setAllNotes] = useState<GeneralNoteItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch admin uploaded notes from Firestore
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'notes'));
        const customNotes: GeneralNoteItem[] = [];

        snap.forEach((d) => {
          const data = d.data();
          let parsedKeyPoints: string[] = [];
          let parsedTerms: { term: string; definition: string }[] = [];
          let parsedQuestions: { question: string; marks?: number; modelAnswer: string }[] = [];
          let parsedAttachments: NoteAttachment[] = [];

          try {
            parsedKeyPoints = typeof data.keyPoints === 'string' ? JSON.parse(data.keyPoints) : data.keyPoints || [];
          } catch { parsedKeyPoints = []; }

          try {
            parsedTerms = typeof data.importantTerms === 'string' ? JSON.parse(data.importantTerms) : data.importantTerms || [];
          } catch { parsedTerms = []; }

          try {
            parsedQuestions = typeof data.sampleQuestions === 'string' ? JSON.parse(data.sampleQuestions) : data.sampleQuestions || [];
          } catch { parsedQuestions = []; }

          try {
            parsedAttachments = typeof data.attachments === 'string' ? JSON.parse(data.attachments) : data.attachments || [];
          } catch { parsedAttachments = []; }

          customNotes.push({
            id: d.id,
            title: data.title || 'Untitled Note',
            category: data.category || 'General Notes',
            description: data.description || '',
            content: data.content || '',
            keyPoints: parsedKeyPoints,
            importantTerms: parsedTerms,
            sampleQuestions: parsedQuestions,
            attachments: parsedAttachments,
            authorEmail: data.authorEmail,
            createdAt: data.createdAt || ''
          });
        });

        // Also check legacy board_study_notes
        try {
          const legacySnap = await getDocs(collection(db, 'board_study_notes'));
          legacySnap.forEach((d) => {
            if (!customNotes.some(n => n.id === d.id)) {
              const data = d.data();
              let parsedKeyPoints = [];
              let parsedTerms = [];
              let parsedQuestions = [];
              try { parsedKeyPoints = typeof data.keyPoints === 'string' ? JSON.parse(data.keyPoints) : data.keyPoints || []; } catch {}
              try { parsedTerms = typeof data.importantTerms === 'string' ? JSON.parse(data.importantTerms) : data.importantTerms || []; } catch {}
              try { parsedQuestions = typeof data.sampleQuestions === 'string' ? JSON.parse(data.sampleQuestions) : data.sampleQuestions || []; } catch {}

              customNotes.push({
                id: d.id,
                title: data.topicTitle || data.title || 'Curriculum Topic',
                category: data.subjectTitle || 'Study Notes',
                description: data.summary || '',
                content: data.summary || '',
                keyPoints: parsedKeyPoints,
                importantTerms: parsedTerms,
                sampleQuestions: parsedQuestions,
                attachments: [],
                authorEmail: data.authorEmail,
                createdAt: data.createdAt || ''
              });
            }
          });
        } catch {}

        setAllNotes(customNotes);
      } catch (err) {
        console.warn('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const toggleQuestionReveal = (id: string) => {
    setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Get distinct categories
  const categories: string[] = ['All', ...Array.from(new Set<string>(allNotes.map(n => n.category)))];

  // Filter notes based on category and search query
  const filteredNotes = allNotes.filter(note => {
    const matchesCategory = selectedCategory === 'All' || note.category.toLowerCase() === selectedCategory.toLowerCase();
    
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const inTitle = note.title.toLowerCase().includes(q);
    const inCategory = note.category.toLowerCase().includes(q);
    const inDesc = note.description.toLowerCase().includes(q);
    const inContent = (note.content || '').toLowerCase().includes(q);
    const inPoints = (note.keyPoints || []).some(p => p.toLowerCase().includes(q));
    const inTerms = (note.importantTerms || []).some(t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q));
    const inQuestions = (note.sampleQuestions || []).some(qItem => qItem.question.toLowerCase().includes(q) || qItem.modelAnswer.toLowerCase().includes(q));
    const inAttachments = (note.attachments || []).some(a => a.name.toLowerCase().includes(q));

    return inTitle || inCategory || inDesc || inContent || inPoints || inTerms || inQuestions || inAttachments;
  });

  // Helper file type icon
  const getFileIcon = (mimeType: string, name: string) => {
    if (mimeType.startsWith('image/') || /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(name)) {
      return <FileImage className="w-5 h-5 text-emerald-700" />;
    }
    if (mimeType.includes('pdf') || /\.pdf$/i.test(name)) {
      return <FileText className="w-5 h-5 text-rose-600" />;
    }
    if (mimeType.includes('sheet') || mimeType.includes('excel') || /\.(xls|xlsx|csv)$/i.test(name)) {
      return <FileSpreadsheet className="w-5 h-5 text-teal-600" />;
    }
    if (mimeType.includes('text') || /\.(txt|md|rtf)$/i.test(name)) {
      return <FileCode className="w-5 h-5 text-amber-600" />;
    }
    return <File className="w-5 h-5 text-stone-600" />;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Islamic Learning & Curriculum Materials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Notes
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Structured Islamic study notes, direct computer uploads, essential definitions, and revision questions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && onNavigate && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Upload / Type Notes (Admin)</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold border border-stone-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Notes</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar (no-print) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-4 no-print">
        {/* Search Field */}
        <div className="relative">
          <input
            id="notes-search-input"
            type="text"
            placeholder="Search notes by title, topic, explanation, key points, terms, or attached files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-medium">Loading authentic study notes...</p>
        </div>
      ) : allNotes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7 text-emerald-800" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-lg sm:text-xl">No study notes published yet</h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-1.5 leading-relaxed">
              Curriculum notes, study guides, and syllabus materials uploaded by the administrator will appear here with downloadable attachments and model answers.
            </p>
          </div>
          {isAdmin && onNavigate && (
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Create Notes in Admin Portal</span>
            </button>
          )}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-3">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-bold text-stone-800 text-lg">No notes found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            We couldn't find any study notes matching "{searchQuery}". Try searching with different keywords or switch the category filter.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0"
            >
              {/* Note Header */}
              <div className="border-b border-stone-100 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-900">
                    {note.category}
                  </span>
                  {note.createdAt && (
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(note.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug">
                  {note.title}
                </h2>

                <p className="text-sm text-stone-600 mt-2 leading-relaxed font-medium">
                  {note.description}
                </p>
              </div>

              {/* Typed Full Content (if provided) */}
              {note.content && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-800" />
                    <span>Study Content & Explanation</span>
                  </h3>
                  <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line font-sans">
                    {note.content}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* ATTACHED FILES (Images, Text, Documents from Computer) */}
              {/* ============================================================= */}
              {note.attachments && note.attachments.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-emerald-800" />
                    <span>Attached Files & Documents ({note.attachments.length})</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {note.attachments.map((att, attIdx) => {
                      const isImg = att.type.startsWith('image/');
                      return (
                        <div
                          key={attIdx}
                          className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between gap-3 group hover:border-emerald-300 transition-all shadow-2xs"
                        >
                          <div className="flex items-start gap-3">
                            {isImg ? (
                              <img
                                src={att.dataUrl}
                                alt={att.name}
                                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 cursor-pointer"
                                onClick={() => {
                                  // Open enlarged image preview in new window / tab
                                  const win = window.open();
                                  if (win) {
                                    win.document.write(`<img src="${att.dataUrl}" style="max-width:100%; height:auto; margin:auto; display:block;" />`);
                                  }
                                }}
                              />
                            ) : (
                              <div className="p-3 bg-white rounded-xl border border-stone-200 shrink-0">
                                {getFileIcon(att.type, att.name)}
                              </div>
                            )}

                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-stone-900 truncate" title={att.name}>
                                {att.name}
                              </p>
                              <span className="text-[10px] text-stone-500 block">
                                {att.size}
                              </span>
                            </div>
                          </div>

                          <a
                            href={att.dataUrl}
                            download={att.name}
                            className="w-full py-1.5 px-3 bg-white hover:bg-emerald-800 hover:text-white text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors no-print"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download File</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Points */}
              {note.keyPoints && note.keyPoints.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                    <span>Essential Key Points</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {note.keyPoints.map((point, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-800 flex items-start gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0"></span>
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Important Terms & Glossary */}
              {note.importantTerms && note.importantTerms.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Key Terms & Glossary</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {note.importantTerms.map((term, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1"
                      >
                        <span className="font-bold text-xs text-emerald-900 block font-mono">
                          {term.term}
                        </span>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {term.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Review & Exam Questions */}
              {note.sampleQuestions && note.sampleQuestions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-800" />
                    <span>Self-Testing & Model Answers</span>
                  </h3>
                  <div className="space-y-2.5">
                    {note.sampleQuestions.map((q, qIdx) => {
                      const qKey = `${note.id}-q-${qIdx}`;
                      const isRevealed = expandedQuestions[qKey];
                      return (
                        <div
                          key={qIdx}
                          className="rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden transition-all"
                        >
                          <button
                            onClick={() => toggleQuestionReveal(qKey)}
                            className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-stone-100 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center shrink-0">
                                {qIdx + 1}
                              </span>
                              <p className="font-semibold text-xs sm:text-sm text-stone-900">
                                {q.question}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {q.marks && (
                                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                                  [{q.marks} Marks]
                                </span>
                              )}
                              {isRevealed ? (
                                <ChevronUp className="w-4 h-4 text-stone-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-stone-500" />
                              )}
                            </div>
                          </button>

                          {isRevealed && (
                            <div className="p-4 bg-white border-t border-stone-200 text-xs text-stone-700 leading-relaxed space-y-1 animate-fadeIn">
                              <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-800 block">
                                Model Answer & Scholarly References:
                              </span>
                              <p className="whitespace-pre-line">{q.modelAnswer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
