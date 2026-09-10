import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageId, AdminPrintableChart, GeneralNoteItem, NoteAttachment } from '../types';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  Printer, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Upload,
  Eye,
  File,
  FileImage,
  FileSpreadsheet,
  FileCode,
  Download,
  BookOpen,
  HelpCircle,
  Sparkles,
  Paperclip,
  Check
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: PageId) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user, isAdmin, verifyAdminPasscode, grantAdminAccess, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'notes' | 'charts'>('notes');
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Lists of records
  const [uploadedNotes, setUploadedNotes] = useState<GeneralNoteItem[]>([]);
  const [uploadedCharts, setUploadedCharts] = useState<AdminPrintableChart[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // --- FORM STATE: NOTES ---
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState('Quran & Tafsir');
  const [customCategory, setCustomCategory] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteAttachments, setNoteAttachments] = useState<NoteAttachment[]>([]);
  const [noteKeyPoints, setNoteKeyPoints] = useState<string[]>(['']);
  const [noteTerms, setNoteTerms] = useState<{ term: string; definition: string }[]>([
    { term: '', definition: '' }
  ]);
  const [noteQuestions, setNoteQuestions] = useState<{ question: string; marks?: number; modelAnswer: string }[]>([
    { question: '', marks: 4, modelAnswer: '' }
  ]);
  const [noteAuthorSource, setNoteAuthorSource] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isDraggingNoteFiles, setIsDraggingNoteFiles] = useState(false);

  // --- FORM STATE: CHARTS & POSTERS ---
  const [chartTitle, setChartTitle] = useState('');
  const [chartSubtitle, setChartSubtitle] = useState('');
  const [chartCategory, setChartCategory] = useState('Salah & Worship');
  const [chartDescription, setChartDescription] = useState('');
  const [chartFooter, setChartFooter] = useState('');
  const [chartAttachments, setChartAttachments] = useState<NoteAttachment[]>([]);
  const [chartSections, setChartSections] = useState<
    { heading: string; items: { label: string; arabic: string; transliteration: string; detail: string }[] }[]
  >([
    {
      heading: 'Primary Etiquette & Steps',
      items: [
        { label: 'Step 1', arabic: 'بِسْمِ اللَّهِ', transliteration: 'Bismillah', detail: 'Begin in the name of Allah with sincere intention.' }
      ]
    }
  ]);
  const [isSubmittingChart, setIsSubmittingChart] = useState(false);
  const [isDraggingChartFiles, setIsDraggingChartFiles] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartFileInputRef = useRef<HTMLInputElement>(null);

  // Load existing records from Firestore
  const loadAdminItems = async () => {
    setLoadingRecords(true);
    try {
      // 1. Fetch Notes from 'notes' collection (and fallback 'board_study_notes')
      const notesSnap = await getDocs(collection(db, 'notes'));
      const notesList: GeneralNoteItem[] = [];

      notesSnap.forEach((d) => {
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

        notesList.push({
          id: d.id,
          title: data.title || '',
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

      // Also check board_study_notes for any legacy items
      try {
        const legacySnap = await getDocs(collection(db, 'board_study_notes'));
        legacySnap.forEach((d) => {
          if (!notesList.some(n => n.id === d.id)) {
            const data = d.data();
            let parsedKeyPoints: string[] = [];
            let parsedTerms: { term: string; definition: string }[] = [];
            let parsedQuestions: { question: string; marks?: number; modelAnswer: string }[] = [];
            try { parsedKeyPoints = typeof data.keyPoints === 'string' ? JSON.parse(data.keyPoints) : data.keyPoints || []; } catch {}
            try { parsedTerms = typeof data.importantTerms === 'string' ? JSON.parse(data.importantTerms) : data.importantTerms || []; } catch {}
            try { parsedQuestions = typeof data.sampleQuestions === 'string' ? JSON.parse(data.sampleQuestions) : data.sampleQuestions || []; } catch {}

            notesList.push({
              id: d.id,
              title: data.topicTitle || data.title || 'Untitled Note',
              category: data.subjectTitle || data.board || 'Curriculum Reference',
              description: data.summary || data.description || '',
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

      setUploadedNotes(notesList);

      // 2. Fetch Charts & Posters
      const chartsSnap = await getDocs(collection(db, 'printable_charts'));
      const chartsList: AdminPrintableChart[] = [];
      chartsSnap.forEach((d) => {
        const data = d.data();
        let parsedSections = [];
        let parsedAttachments = [];
        try {
          parsedSections = data.sections ? (typeof data.sections === 'string' ? JSON.parse(data.sections) : data.sections) : [];
        } catch { parsedSections = []; }
        try {
          parsedAttachments = data.attachments ? (typeof data.attachments === 'string' ? JSON.parse(data.attachments) : data.attachments) : [];
        } catch { parsedAttachments = []; }

        chartsList.push({
          id: d.id,
          title: data.title || '',
          subtitle: data.subtitle,
          category: data.category || 'Salah & Worship',
          description: data.description || '',
          imageUrl: data.imageUrl,
          attachments: parsedAttachments,
          sections: parsedSections,
          footerNote: data.footerNote,
          authorEmail: data.authorEmail,
          createdAt: data.createdAt || ''
        });
      });
      setUploadedCharts(chartsList);

    } catch (err) {
      console.warn('Error loading admin items:', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminItems();
    }
  }, [isAdmin]);

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = verifyAdminPasscode(passcode);
    if (!ok) {
      setPasscodeError(true);
    }
  };

  // Format file size nicely
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle files selected from computer for Notes
  const handleProcessNoteFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newAttachment: NoteAttachment = {
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: formatFileSize(file.size),
          dataUrl
        };

        setNoteAttachments((prev) => [...prev, newAttachment]);

        // If it's a plain text file, and user hasn't typed content yet, give an easy option to populate
        if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          const textReader = new FileReader();
          textReader.onload = () => {
            const textContent = textReader.result as string;
            if (textContent && !noteContent) {
              setNoteContent(textContent);
            }
          };
          textReader.readAsText(file);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // Handle files selected for Charts/Posters
  const handleProcessChartFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newAttachment: NoteAttachment = {
          name: file.name,
          type: file.type || 'image/png',
          size: formatFileSize(file.size),
          dataUrl
        };
        setChartAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Helper icon for file types
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

  // Submit New Note
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteDescription.trim()) {
      alert('Please provide both a Title and Description for the note.');
      return;
    }

    const effectiveCategory = noteCategory === 'Custom...' ? (customCategory.trim() || 'General Notes') : noteCategory;

    setIsSubmittingNote(true);
    try {
      const activeKeyPoints = noteKeyPoints.filter(p => p.trim() !== '');
      const activeTerms = noteTerms.filter(t => t.term.trim() !== '');
      const activeQuestions = noteQuestions.filter(q => q.question.trim() !== '');

      const docData = {
        title: noteTitle.trim(),
        category: effectiveCategory,
        description: noteDescription.trim(),
        content: noteContent.trim(),
        keyPoints: JSON.stringify(activeKeyPoints),
        importantTerms: JSON.stringify(activeTerms),
        sampleQuestions: JSON.stringify(activeQuestions),
        attachments: JSON.stringify(noteAttachments),
        authorEmail: user?.email || 'admin@centreofislam.org',
        authorSource: noteAuthorSource.trim(),
        createdAt: new Date().toISOString()
      };

      // Save to 'notes' collection
      const docRef = await addDoc(collection(db, 'notes'), docData);

      // Also save to 'board_study_notes' for backward compatibility
      try {
        await addDoc(collection(db, 'board_study_notes'), {
          board: 'IGCSE',
          subjectTitle: effectiveCategory,
          gradeLevel: 'General & Study',
          topicTitle: noteTitle.trim(),
          summary: noteDescription.trim() + (noteContent ? '\n\n' + noteContent.trim() : ''),
          keyPoints: JSON.stringify(activeKeyPoints),
          importantTerms: JSON.stringify(activeTerms),
          sampleQuestions: JSON.stringify(activeQuestions),
          authorEmail: user?.email || 'admin@centreofislam.org',
          createdAt: new Date().toISOString()
        });
      } catch {}

      setActionSuccessMsg(`Note "${noteTitle}" published successfully with ${noteAttachments.length} attached files!`);

      // Reset form
      setNoteTitle('');
      setNoteDescription('');
      setNoteContent('');
      setNoteAttachments([]);
      setNoteKeyPoints(['']);
      setNoteTerms([{ term: '', definition: '' }]);
      setNoteQuestions([{ question: '', marks: 4, modelAnswer: '' }]);
      setNoteAuthorSource('');

      await loadAdminItems();
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: any) {
      alert('Failed to publish note: ' + err.message);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Submit New Chart/Poster
  const handleCreateChart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chartTitle.trim() || !chartDescription.trim()) {
      alert('Please fill in both Chart Title and Description.');
      return;
    }

    setIsSubmittingChart(true);
    try {
      const docData = {
        title: chartTitle.trim(),
        subtitle: chartSubtitle.trim() || 'Centre of Islam • Visual Reference & Study Poster',
        category: chartCategory,
        description: chartDescription.trim(),
        sections: JSON.stringify(chartSections),
        attachments: JSON.stringify(chartAttachments),
        imageUrl: chartAttachments[0]?.dataUrl || '',
        footerNote: chartFooter.trim() || 'Centre of Islam • Authentic Guidance and Verified References',
        authorEmail: user?.email || 'admin@centreofislam.org',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'printable_charts'), docData);
      setActionSuccessMsg(`Poster "${chartTitle}" published successfully!`);

      // Reset
      setChartTitle('');
      setChartSubtitle('');
      setChartDescription('');
      setChartFooter('');
      setChartAttachments([]);
      setChartSections([
        {
          heading: 'Primary Actions & Etiquette',
          items: [{ label: 'Step 1', arabic: '', transliteration: '', detail: 'Begin with sincere intention.' }]
        }
      ]);

      await loadAdminItems();
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: any) {
      alert('Failed to upload chart: ' + err.message);
    } finally {
      setIsSubmittingChart(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteDoc(doc(db, 'notes', id));
      try {
        await deleteDoc(doc(db, 'board_study_notes', id));
      } catch {}
      setUploadedNotes((prev) => prev.filter((n) => n.id !== id));
      setActionSuccessMsg('Note deleted successfully.');
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleDeleteChart = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this printable chart?')) return;
    try {
      await deleteDoc(doc(db, 'printable_charts', id));
      setUploadedCharts((prev) => prev.filter((c) => c.id !== id));
      setActionSuccessMsg('Chart deleted successfully.');
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // If user is not admin, show Admin Gate
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Administrator Portal
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Please sign in with an administrator account or enter the administrative security key.
            </p>
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Sign In with Admin Account</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-stone-400 text-xs font-semibold uppercase tracking-wider">or passcode</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          <form onSubmit={handleVerifyPasscode} className="space-y-3">
            <div>
              <input
                id="admin-passcode-input"
                type="password"
                placeholder="Enter Admin Passcode..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                className="w-full px-3.5 py-2.5 text-center text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900"
              />
              {passcodeError && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  Invalid passcode. Use 'centre2026' or sign in with admin email.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Unlock Admin Portal
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100">
            <button
              onClick={() => grantAdminAccess()}
              className="text-xs text-emerald-800 hover:underline font-semibold cursor-pointer"
            >
              Quick Test: Authorize Admin for Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Authenticated Administrator Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Admin Content & Publishing Portal
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Upload files directly from your computer, type down comprehensive notes, and publish printable posters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('study-notes')}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-800" />
            <span>Live Notes Page</span>
          </button>
          <button
            onClick={() => onNavigate('printables')}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-800" />
            <span>Live Posters Page</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 text-sm shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccessMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Notes & Study Material</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'notes' ? 'bg-amber-400 text-emerald-950' : 'bg-stone-100 text-stone-600'
          }`}>
            {uploadedNotes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('charts')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'charts'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Charts & Posters</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'charts' ? 'bg-amber-400 text-emerald-950' : 'bg-stone-100 text-stone-600'
          }`}>
            {uploadedCharts.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: NOTES (UPLOAD FROM COMPUTER OR TYPE DIRECTLY) */}
      {/* ========================================================================= */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Note Publishing Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-800" />
                <span>Publish New Note</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Type notes directly, or upload text, image, and document files from your computer.
              </p>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-5 text-xs sm:text-sm">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-800 mb-1">
                    Note Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sources of Islamic Jurisprudence (Usul al-Fiqh)"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Category / Subject
                  </label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none"
                  >
                    <option value="Quran & Tafsir">Quran & Tafsir</option>
                    <option value="Hadith & Sunnah">Hadith & Sunnah</option>
                    <option value="Fiqh & Worship">Fiqh & Worship</option>
                    <option value="Islamic History & Seerah">Islamic History & Seerah</option>
                    <option value="Aqeedah & Creed">Aqeedah & Creed</option>
                    <option value="Islamic Ethics & Character">Islamic Ethics & Character</option>
                    <option value="General Notes">General Notes</option>
                    <option value="Custom...">+ Add Custom Category</option>
                  </select>
                </div>

                {noteCategory === 'Custom...' && (
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Custom Category Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Arabic Grammar, Duas"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Description / Overview <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="A concise summary of what this note covers..."
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none"
                />
              </div>

              {/* Type Down Notes Content Directly */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-800">
                    Type Note Content Directly
                  </label>
                  <span className="text-[11px] text-stone-500">
                    {noteContent.length} characters
                  </span>
                </div>
                <textarea
                  rows={6}
                  placeholder="Type down the complete notes, explanations, Qur'anic daleel, or study points directly here..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none font-sans text-xs sm:text-sm leading-relaxed"
                />
              </div>

              {/* ================================================================= */}
              {/* FILE UPLOAD ZONE FROM COMPUTER (Images, Documents, Text files) */}
              {/* ================================================================= */}
              <div className="space-y-2.5">
                <label className="block font-bold text-stone-800">
                  Upload Files from Computer (Text, Image & Document Files)
                </label>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingNoteFiles(true); }}
                  onDragLeave={() => setIsDraggingNoteFiles(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingNoteFiles(false);
                    handleProcessNoteFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDraggingNoteFiles
                      ? 'border-emerald-700 bg-emerald-50/80 scale-[1.01]'
                      : 'border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-emerald-600'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".txt,.md,.rtf,.pdf,.doc,.docx,.odt,.ppt,.pptx,.xls,.xlsx,image/*"
                    onChange={(e) => handleProcessNoteFiles(e.target.files)}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-stone-800 text-xs sm:text-sm">
                    Click to browse files or drag and drop here
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Supports <strong>all text files</strong> (.txt, .md), <strong>images</strong> (.png, .jpg, .webp, .svg), and <strong>documents</strong> (.pdf, .doc, .docx, .ppt, .xls)
                  </p>
                </div>

                {/* List of Attached Files */}
                {noteAttachments.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-stone-700 block">
                      Attached Files ({noteAttachments.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {noteAttachments.map((att, idx) => {
                        const isImg = att.type.startsWith('image/');
                        return (
                          <div
                            key={idx}
                            className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              {isImg ? (
                                <img
                                  src={att.dataUrl}
                                  alt={att.name}
                                  className="w-8 h-8 rounded object-cover border border-stone-300 shrink-0"
                                />
                              ) : (
                                <div className="p-1.5 bg-stone-200/70 rounded shrink-0">
                                  {getFileIcon(att.type, att.name)}
                                </div>
                              )}
                              <div className="overflow-hidden">
                                <p className="text-xs font-semibold text-stone-800 truncate" title={att.name}>
                                  {att.name}
                                </p>
                                <span className="text-[10px] text-stone-500">
                                  {att.size}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setNoteAttachments(prev => prev.filter((_, i) => i !== idx))}
                              className="p-1 text-stone-400 hover:text-rose-600 transition-colors shrink-0"
                              title="Remove file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ================================================================= */}
              {/* OTHER STUFF: KEY POINTS, TERMS, QUESTIONS, AUTHOR */}
              {/* ================================================================= */}
              <div className="pt-2 border-t border-stone-200 space-y-4">
                <span className="block font-extrabold text-stone-800 text-xs uppercase tracking-wider text-emerald-900">
                  Additional Structured Metadata
                </span>

                {/* Key Points */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-800 text-xs">
                      Key Takeaway Points
                    </label>
                    <button
                      type="button"
                      onClick={() => setNoteKeyPoints([...noteKeyPoints, ''])}
                      className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Point
                    </button>
                  </div>
                  {noteKeyPoints.map((point, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Key point #${idx + 1}`}
                        value={point}
                        onChange={(e) => {
                          const updated = [...noteKeyPoints];
                          updated[idx] = e.target.value;
                          setNoteKeyPoints(updated);
                        }}
                        className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                      {noteKeyPoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setNoteKeyPoints(noteKeyPoints.filter((_, i) => i !== idx))}
                          className="text-stone-400 hover:text-rose-600 px-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Important Terms */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-800 text-xs">
                      Important Terms & Definitions
                    </label>
                    <button
                      type="button"
                      onClick={() => setNoteTerms([...noteTerms, { term: '', definition: '' }])}
                      className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Term
                    </button>
                  </div>
                  {noteTerms.map((t, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Term (e.g., Ijma)"
                        value={t.term}
                        onChange={(e) => {
                          const updated = [...noteTerms];
                          updated[idx].term = e.target.value;
                          setNoteTerms(updated);
                        }}
                        className="sm:col-span-2 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Definition / Explanation"
                        value={t.definition}
                        onChange={(e) => {
                          const updated = [...noteTerms];
                          updated[idx].definition = e.target.value;
                          setNoteTerms(updated);
                        }}
                        className="sm:col-span-3 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  ))}
                </div>

                {/* Study / Practice Questions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-800 text-xs">
                      Study & Review Questions with Answers
                    </label>
                    <button
                      type="button"
                      onClick={() => setNoteQuestions([...noteQuestions, { question: '', marks: 4, modelAnswer: '' }])}
                      className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Question
                    </button>
                  </div>
                  {noteQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder={`Question #${idx + 1}`}
                          value={q.question}
                          onChange={(e) => {
                            const updated = [...noteQuestions];
                            updated[idx].question = e.target.value;
                            setNoteQuestions(updated);
                          }}
                          className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium"
                        />
                        {noteQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setNoteQuestions(noteQuestions.filter((_, i) => i !== idx))}
                            className="text-stone-400 hover:text-rose-600 px-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Model answer or reference notes for this question..."
                        value={q.modelAnswer}
                        onChange={(e) => {
                          const updated = [...noteQuestions];
                          updated[idx].modelAnswer = e.target.value;
                          setNoteQuestions(updated);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  ))}
                </div>

                {/* Author / Source attribution */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1 text-xs">
                    Source Attribution or Citation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Compiled by Ustadh Farooq • Sources: Tafsir Ibn Kathir, Fiqh us-Sunnah"
                    value={noteAuthorSource}
                    onChange={(e) => setNoteAuthorSource(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Submit Note Button */}
              <button
                type="submit"
                disabled={isSubmittingNote}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmittingNote ? 'Publishing Note...' : 'Publish Note to Website'}</span>
              </button>
            </form>
          </div>

          {/* List of Published Notes (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center justify-between border-b border-stone-100 pb-3">
              <span>Published Notes</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {uploadedNotes.length}
              </span>
            </h3>

            {loadingRecords ? (
              <p className="text-xs text-stone-400 py-4 text-center">Loading notes...</p>
            ) : uploadedNotes.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
                No notes published yet. Use the form to write or upload your first note!
              </div>
            ) : (
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {uploadedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-2 relative group hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-100 inline-block mb-1">
                          {note.category}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm">{note.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {note.description}
                    </p>

                    {/* Attached files summary */}
                    {note.attachments && note.attachments.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium pt-1">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{note.attachments.length} file{note.attachments.length > 1 ? 's' : ''} attached</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-200/60">
                      <span>{note.keyPoints?.length || 0} points • {note.sampleQuestions?.length || 0} Qs</span>
                      <button
                        onClick={() => onNavigate('study-notes')}
                        className="text-emerald-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Live</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CHARTS & POSTERS */}
      {/* ========================================================================= */}
      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-800" />
                <span>Publish Printable Chart or Wall Poster</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Upload custom infographic posters from your computer or create structured printable guides.
              </p>
            </div>

            <form onSubmit={handleCreateChart} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Chart Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Step-by-Step Guide to Janazah Prayer"
                    value={chartTitle}
                    onChange={(e) => setChartTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Category</label>
                  <select
                    value={chartCategory}
                    onChange={(e) => setChartCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none"
                  >
                    <option value="Salah & Worship">Salah & Worship</option>
                    <option value="Duas & Adhkar">Duas & Adhkar</option>
                    <option value="Ramadan & Fasting">Ramadan & Fasting</option>
                    <option value="Children & Beginners">Children & Beginners</option>
                    <option value="Tajweed & Quran">Tajweed & Quran</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Subtitle / Top Banner Note</label>
                <input
                  type="text"
                  placeholder="e.g., Visual Learning Guide for Classrooms & Homes"
                  value={chartSubtitle}
                  onChange={(e) => setChartSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Summary Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Brief description of this printable chart..."
                  value={chartDescription}
                  onChange={(e) => setChartDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none"
                />
              </div>

              {/* Upload Graphic Poster Image / PDF */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-800">
                  Upload Poster File from Computer (Optional Graphic / PDF)
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingChartFiles(true); }}
                  onDragLeave={() => setIsDraggingChartFiles(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingChartFiles(false);
                    handleProcessChartFiles(e.dataTransfer.files);
                  }}
                  onClick={() => chartFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    isDraggingChartFiles
                      ? 'border-emerald-700 bg-emerald-50'
                      : 'border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-emerald-600'
                  }`}
                >
                  <input
                    ref={chartFileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleProcessChartFiles(e.target.files)}
                    className="hidden"
                  />
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1.5 shadow-2xs">
                    <FileImage className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-stone-800 text-xs sm:text-sm">
                    Upload poster image or PDF from computer
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Images will render in full high-resolution with direct print support.
                  </p>
                </div>

                {chartAttachments.length > 0 && (
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={chartAttachments[0].dataUrl}
                        alt="Preview"
                        className="w-10 h-10 rounded object-cover border border-stone-300"
                      />
                      <div>
                        <p className="text-xs font-bold text-stone-800">{chartAttachments[0].name}</p>
                        <span className="text-[10px] text-stone-500">{chartAttachments[0].size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setChartAttachments([])}
                      className="text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Structured Sections Builder */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 text-xs uppercase tracking-wider">
                    Structured Poster Sections
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setChartSections([
                        ...chartSections,
                        { heading: 'New Section', items: [{ label: '', arabic: '', transliteration: '', detail: '' }] }
                      ]);
                    }}
                    className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Section
                  </button>
                </div>

                {chartSections.map((section, sIdx) => (
                  <div key={sIdx} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Section Heading"
                        value={section.heading}
                        onChange={(e) => {
                          const updated = [...chartSections];
                          updated[sIdx].heading = e.target.value;
                          setChartSections(updated);
                        }}
                        className="font-bold text-xs text-stone-900 bg-white px-3 py-1.5 border border-stone-300 rounded-lg flex-1"
                      />
                      {chartSections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setChartSections(chartSections.filter((_, i) => i !== sIdx))}
                          className="text-stone-400 hover:text-rose-600 px-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {section.items.map((item, iIdx) => (
                        <div key={iIdx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                          <input
                            type="text"
                            placeholder="Step / Label"
                            value={item.label}
                            onChange={(e) => {
                              const updated = [...chartSections];
                              updated[sIdx].items[iIdx].label = e.target.value;
                              setChartSections(updated);
                            }}
                            className="px-2 py-1 bg-white border border-stone-200 rounded"
                          />
                          <input
                            type="text"
                            placeholder="Arabic Text"
                            value={item.arabic}
                            onChange={(e) => {
                              const updated = [...chartSections];
                              updated[sIdx].items[iIdx].arabic = e.target.value;
                              setChartSections(updated);
                            }}
                            className="px-2 py-1 bg-white border border-stone-200 rounded font-arabic"
                          />
                          <input
                            type="text"
                            placeholder="Detail / Action"
                            value={item.detail}
                            onChange={(e) => {
                              const updated = [...chartSections];
                              updated[sIdx].items[iIdx].detail = e.target.value;
                              setChartSections(updated);
                            }}
                            className="px-2 py-1 bg-white border border-stone-200 rounded sm:col-span-2"
                          />
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...chartSections];
                          updated[sIdx].items.push({ label: '', arabic: '', transliteration: '', detail: '' });
                          setChartSections(updated);
                        }}
                        className="text-[11px] text-stone-600 hover:text-emerald-800 font-semibold flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add item
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Footer Citation / Note</label>
                <input
                  type="text"
                  placeholder="e.g., Centre of Islam • Authentic Guidance and References"
                  value={chartFooter}
                  onChange={(e) => setChartFooter(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingChart}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmittingChart ? 'Uploading Poster...' : 'Publish Poster to Website'}</span>
              </button>
            </form>
          </div>

          {/* List of Existing Charts (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center justify-between border-b border-stone-100 pb-3">
              <span>Admin Uploaded Posters</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                {uploadedCharts.length}
              </span>
            </h3>

            {loadingRecords ? (
              <p className="text-xs text-stone-400 py-4 text-center">Loading uploaded records...</p>
            ) : uploadedCharts.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
                No custom charts uploaded yet. Use the form to publish your first poster!
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {uploadedCharts.map((chart) => (
                  <div
                    key={chart.id}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-2 relative group hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                          {chart.category}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm">{chart.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDeleteChart(chart.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete poster"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {chart.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-200/60">
                      <span>{chart.sections?.length || 0} sections</span>
                      <button
                        onClick={() => onNavigate('printables')}
                        className="text-emerald-800 font-semibold hover:underline cursor-pointer"
                      >
                        View Live →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
