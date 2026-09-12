import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Question, Comment } from '../types';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  MessageSquareQuote, 
  PlusCircle, 
  ThumbsUp, 
  BookOpen, 
  Search, 
  Tag, 
  ShieldCheck, 
  User, 
  Send, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft,
  X,
  Sparkles,
  ExternalLink,
  Flag,
  Trash2,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-seed-1',
    title: 'How should prayer times be determined in high-latitude regions during polar summer?',
    details: 'In Scandinavian and northern territories (like Tromsø or northern Canada), the sun does not set for weeks during summer, meaning astronomical twilight or true sunset does not occur for Maghrib and Isha. What are the principal scholarly references and council fatwas regarding estimation?',
    category: 'Fiqh & Rulings',
    tags: ['Salah', 'High Latitudes', 'Fiqh Council', 'Isha'],
    authorId: 'scholarly-council',
    authorName: 'Dr. Zaid Al-Qadi',
    upvotes: 24,
    commentsCount: 3,
    createdAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'q-seed-2',
    title: 'Is it permissible to utilize AI-assisted translation for understanding Quranic grammar (I\'rab)?',
    details: 'With recent advances in linguistic models, many students use AI to parse Arabic roots and Balaghah (rhetoric). What boundaries and cross-references against classical dictionaries (like Lisan al-Arab) are necessary to prevent theological errors?',
    category: 'Contemporary & Ethics',
    tags: ['Quran', 'Technology', 'Arabic Grammar', 'Ethics'],
    authorId: 'student-bilal',
    authorName: 'Bilal Farooq',
    upvotes: 18,
    commentsCount: 2,
    createdAt: '2026-08-28T14:30:00Z'
  },
  {
    id: 'q-seed-3',
    title: 'Calculation of Zakat on Modern Retirement Accounts (401k / Pension Funds)',
    details: 'What is the preferred methodology for calculating Zakat on employee-matched retirement accounts where early withdrawal incurs penalties? Should Zakat be paid on the gross vested amount annually or upon liquidation?',
    category: 'Fiqh & Rulings',
    tags: ['Zakat', 'Finance', 'Wealth', 'Pensions'],
    authorId: 'user-fatima',
    authorName: 'Fatima Zahra',
    upvotes: 31,
    commentsCount: 3,
    createdAt: '2026-09-02T08:15:00Z'
  }
];

const INITIAL_COMMENTS: Record<string, Comment[]> = {
  'q-seed-1': [
    {
      id: 'c1',
      questionId: 'q-seed-1',
      text: 'The European Council for Fatwa and Research (ECFR) and the Islamic Fiqh Academy of Makkah addressed this directly. When normal astronomical signs disappear, Muslims are permitted to estimate (Taqdir) timings based on the nearest temperate latitude (typically 45° or 48° North), or anchor against the timings of Makkah al-Mukarramah.',
      references: 'Reference: Sahih Muslim 2937 (Hadith of Dajjal: "Estimate for it its measure" / "Uqdurū lahu qadrah"); ECFR Resolution 3/19 (2009).',
      stance: 'Scholarly Reference',
      authorId: 'sheikh-amin',
      authorName: 'Shaykh Aminullah',
      upvotes: 19,
      createdAt: '2026-08-20T12:30:00Z'
    },
    {
      id: 'c2',
      questionId: 'q-seed-1',
      text: 'Practically, local mosques in Tromsø and Reykjavik adopt the Makkah schedule or the nearest city with distinguishable twilight (such as Oslo). It provides consistency for the entire congregational community.',
      references: 'Fiqh al-Sunnah by Sayyid Sabiq, Vol. 1, Chapter on Timings in Polar Regions.',
      stance: 'Perspective',
      authorId: 'karim-nordic',
      authorName: 'Karim Lindqvist',
      upvotes: 8,
      createdAt: '2026-08-21T09:15:00Z'
    }
  ],
  'q-seed-2': [
    {
      id: 'c3',
      questionId: 'q-seed-2',
      text: 'Using tools for lexical lookup of root words (Jadh\'r) is permissible as a study aid, but no theological deduction (Istinbat) or novel Tafsir can be made through statistical models. Classical exegetes like At-Tabari, Al-Qurtubi, and Ibn Kathir must remain the authoritative benchmarks.',
      references: 'Hadith: "Whoever speaks about the Quran without knowledge should take his seat in the Fire." (Sunan at-Tirmidhi 2950, Hasan).',
      stance: 'Scholarly Reference',
      authorId: 'ustadh-ahmed',
      authorName: 'Ustadh Ahmed Siddiqui',
      upvotes: 14,
      createdAt: '2026-08-29T11:00:00Z'
    }
  ],
  'q-seed-3': [
    {
      id: 'c4',
      questionId: 'q-seed-3',
      text: 'Prominent modern jurists (including Dr. Yusuf al-Qaradawi and the Fiqh Council of North America) suggest calculating Zakat strictly on the accessible portion: deducting the mandatory early withdrawal penalties and anticipated tax liabilities, then paying 2.5% on the net accessible liquid amount if above Nisab.',
      references: 'Fiqh az-Zakat by Dr. Yusuf al-Qaradawi, Chapter on Modern Incorporeal Wealth; AAOIFI Shari\'ah Standard No. 35.',
      stance: 'Scholarly Reference',
      authorId: 'scholar-hamza',
      authorName: 'Mufti Hamza Tariq',
      upvotes: 22,
      createdAt: '2026-09-02T10:45:00Z'
    }
  ]
};

export const CommunityQAPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSpamQueueOnly, setShowSpamQueueOnly] = useState(false);

  // Spam tracking & notifications
  const [flaggedIds, setFlaggedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('centre_flagged_spams') || '[]');
    } catch {
      return [];
    }
  });
  const [spamAlertNotice, setSpamAlertNotice] = useState<string | null>(null);

  // Open Author states (no sign up required)
  const [authorNameInput, setAuthorNameInput] = useState<string>(() => {
    try {
      return localStorage.getItem('centre_guest_author_name') || '';
    } catch {
      return '';
    }
  });
  const [commentAuthorName, setCommentAuthorName] = useState<string>(() => {
    try {
      return localStorage.getItem('centre_guest_comment_author') || '';
    } catch {
      return '';
    }
  });

  // New Question Form state
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newCategory, setNewCategory] = useState<Question['category']>('Fiqh & Rulings');
  const [newTags, setNewTags] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // New Comment Form state
  const [commentText, setCommentText] = useState('');
  const [commentReferences, setCommentReferences] = useState('');
  const [commentStance, setCommentStance] = useState<Comment['stance']>('Scholarly Reference');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentFeedback, setCommentFeedback] = useState<string | null>(null);

  // Listen to Firestore questions live sync
  useEffect(() => {
    try {
      const qCol = collection(db, 'questions');
      const unsubscribe = onSnapshot(
        qCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Question[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              list.push({
                id: docSnap.id,
                ...(data as any),
                spamCount: typeof data.spamCount === 'number' ? data.spamCount : 0
              });
            });
            // Combine with initial if needed
            setQuestions((prev) => {
              const combined = [...list];
              INITIAL_QUESTIONS.forEach(init => {
                if (!combined.some(c => c.id === init.id)) {
                  combined.push(init);
                }
              });
              return combined;
            });
          }
        },
        (err) => {
          console.warn('Firestore questions live sync note:', err.message);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Questions subscription note:', e);
    }
  }, []);

  const handleOpenAskModal = () => {
    // Open immediately for everyone without sign-up barrier
    setAskModalOpen(true);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetails.trim()) return;

    setIsSubmittingQuestion(true);
    const finalAuthorName = (authorNameInput.trim() || user?.displayName || 'Community Seeker');
    try {
      localStorage.setItem('centre_guest_author_name', finalAuthorName);
    } catch {}

    const newQ: Question = {
      id: `q-${Date.now()}`,
      title: newTitle.trim(),
      details: newDetails.trim(),
      category: newCategory,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      authorId: user?.uid || 'community-guest',
      authorName: finalAuthorName,
      authorPhoto: user?.photoURL || undefined,
      upvotes: 1,
      commentsCount: 0,
      spamCount: 0,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'questions'), newQ);
    } catch (err) {
      // Local fallback
      setQuestions(prev => [newQ, ...prev]);
    }

    setQuestions(prev => (prev.some(p => p.id === newQ.id) ? prev : [newQ, ...prev]));
    setNewTitle('');
    setNewDetails('');
    setNewTags('');
    setAskModalOpen(false);
    setIsSubmittingQuestion(false);
    setSpamAlertNotice('Your question was posted to the forum successfully!');
    setTimeout(() => setSpamAlertNotice(null), 4000);
  };

  const handleOpenQuestion = (q: Question) => {
    setActiveQuestion(q);
    setCommentFeedback(null);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeQuestion) return;

    setIsSubmittingComment(true);
    const finalCommentAuthor = (commentAuthorName.trim() || user?.displayName || 'Community Contributor');
    try {
      localStorage.setItem('centre_guest_comment_author', finalCommentAuthor);
    } catch {}

    const newC: Comment = {
      id: `c-${Date.now()}`,
      questionId: activeQuestion.id,
      text: commentText.trim(),
      references: commentReferences.trim() || undefined,
      stance: commentStance,
      authorId: user?.uid || 'community-guest',
      authorName: finalCommentAuthor,
      authorPhoto: user?.photoURL || undefined,
      upvotes: 0,
      spamCount: 0,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'questions', activeQuestion.id, 'comments'), newC);
    } catch (err) {
      // Local update fallback
    }

    setCommentsMap(prev => {
      const existing = prev[activeQuestion.id] || [];
      return { ...prev, [activeQuestion.id]: [...existing, newC] };
    });

    setQuestions(prev =>
      prev.map(q => q.id === activeQuestion.id ? { ...q, commentsCount: q.commentsCount + 1 } : q)
    );

    setCommentText('');
    setCommentReferences('');
    setCommentFeedback('Your reference and comment was successfully published to the debate!');
    setIsSubmittingComment(false);
  };

  // Report message as spam
  const handleFlagSpam = async (id: string, isQuestion: boolean = true) => {
    if (flaggedIds.includes(id)) {
      setSpamAlertNotice('You have already flagged this message as spam from this device.');
      setTimeout(() => setSpamAlertNotice(null), 3500);
      return;
    }

    const updated = [...flaggedIds, id];
    setFlaggedIds(updated);
    try {
      localStorage.setItem('centre_flagged_spams', JSON.stringify(updated));
    } catch {}

    if (isQuestion) {
      // Update in Firestore
      try {
        await updateDoc(doc(db, 'questions', id), {
          spamCount: increment(1)
        });
      } catch (err) {
        console.warn('Firestore spam count increment note:', err);
      }

      setQuestions(prev =>
        prev.map(q => {
          if (q.id === id) {
            const nextCount = (q.spamCount || 0) + 1;
            return { ...q, spamCount: nextCount };
          }
          return q;
        })
      );

      if (activeQuestion && activeQuestion.id === id) {
        setActiveQuestion(prev => prev ? { ...prev, spamCount: (prev.spamCount || 0) + 1 } : null);
      }
    } else {
      // Flag a comment
      if (activeQuestion) {
        setCommentsMap(prev => {
          const list = prev[activeQuestion.id] || [];
          const nextList = list.map(c => c.id === id ? { ...c, spamCount: (c.spamCount || 0) + 1 } : c);
          return { ...prev, [activeQuestion.id]: nextList };
        });
      }
    }

    setSpamAlertNotice('Marked as spam. Messages reported 5 or more times are highlighted for administrator removal.');
    setTimeout(() => setSpamAlertNotice(null), 4500);
  };

  // Delete message permanently (available to admin or in spam moderation)
  const handleDeleteQuestion = async (qId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'questions', qId));
    } catch (e) {
      console.warn('Firestore delete note:', e);
    }

    setQuestions(prev => prev.filter(q => q.id !== qId));
    if (activeQuestion?.id === qId) {
      setActiveQuestion(null);
    }
    setSpamAlertNotice('Message permanently deleted from the forum.');
    setTimeout(() => setSpamAlertNotice(null), 3500);
  };

  // Reset spam count if marked incorrectly
  const handleResetSpamFlags = async (qId: string) => {
    try {
      await updateDoc(doc(db, 'questions', qId), {
        spamCount: 0
      });
    } catch (e) {
      console.warn('Firestore reset spam count note:', e);
    }

    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, spamCount: 0 } : q));
    if (activeQuestion?.id === qId) {
      setActiveQuestion(prev => prev ? { ...prev, spamCount: 0 } : null);
    }
    setSpamAlertNotice('Spam reports cleared. Message is marked safe.');
    setTimeout(() => setSpamAlertNotice(null), 3500);
  };

  const handleUpvoteQuestion = (qId: string) => {
    setQuestions(prev =>
      prev.map(q => q.id === qId ? { ...q, upvotes: q.upvotes + 1 } : q)
    );
    if (activeQuestion && activeQuestion.id === qId) {
      setActiveQuestion(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
    }
  };

  const handleUpvoteComment = (commentId: string) => {
    if (!activeQuestion) return;
    setCommentsMap(prev => {
      const qComments = prev[activeQuestion.id] || [];
      const updated = qComments.map(c => c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c);
      return { ...prev, [activeQuestion.id]: updated };
    });
  };

  const categories = ['All', 'Fiqh & Rulings', 'Quran & Sunnah', 'Aqeedah', 'Contemporary & Ethics', 'History & Seerah'];

  const spamCountThresholdItems = questions.filter(q => (q.spamCount || 0) >= 5);

  const filteredQuestions = questions.filter(q => {
    if (showSpamQueueOnly) {
      return (q.spamCount || 0) >= 5;
    }
    const matchesSearch = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Toast / Notification Alert Banner */}
      {spamAlertNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center justify-between gap-3 shadow-xs animate-fadeIn text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{spamAlertNotice}</span>
          </div>
          <button
            onClick={() => setSpamAlertNotice(null)}
            className="text-stone-400 hover:text-stone-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquareQuote className="w-4 h-4" />
            <span>Islamic Scholarly Debates & Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Community Questions & References Forum
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Open platform for questions, discussions, and authentic Islamic citations. Community-moderated to prevent spam.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="ask-question-btn"
            onClick={handleOpenAskModal}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ask a New Question</span>
          </button>
        </div>
      </div>

      {/* Main Content: Question List OR Question Detail */}
      {!activeQuestion ? (
        <div className="space-y-6">
          {/* Filters, Search & Spam Moderation Bar */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="relative">
              <input
                id="search-questions-input"
                type="text"
                placeholder="Search discussion topics, rulings, fiqh questions, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCategory(c);
                      setShowSpamQueueOnly(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      !showSpamQueueOnly && selectedCategory === c
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Spam Moderation Queue Filter Button */}
              <button
                id="spam-queue-toggle-btn"
                onClick={() => setShowSpamQueueOnly(!showSpamQueueOnly)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  showSpamQueueOnly
                    ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-300'
                    : spamCountThresholdItems.length > 0
                    ? 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
                title="Filter messages marked as spam 5 or more times"
              >
                <Flag className="w-3.5 h-3.5 text-rose-500" />
                <span>Spam Queue (5+ Reports)</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  showSpamQueueOnly
                    ? 'bg-white text-rose-900'
                    : 'bg-rose-200 text-rose-900'
                }`}>
                  {spamCountThresholdItems.length}
                </span>
              </button>
            </div>
          </div>

          {/* Spam Queue Active Notification Banner */}
          {showSpamQueueOnly && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Showing messages flagged 5 or more times as spam. Review and delete them below.</span>
              </div>
              <button
                onClick={() => setShowSpamQueueOnly(false)}
                className="text-xs font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
              >
                Show All Messages
              </button>
            </div>
          )}

          {/* Question Cards Feed */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-stone-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  {showSpamQueueOnly ? <ShieldCheck className="w-6 h-6 text-emerald-600" /> : <Search className="w-6 h-6" />}
                </div>
                <h3 className="font-bold text-stone-800 text-base">
                  {showSpamQueueOnly ? 'No Messages Exceed 5 Spam Reports' : 'No Discussions Found'}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {showSpamQueueOnly
                    ? 'The forum is clean! No messages currently have 5 or more community spam flags.'
                    : 'Try modifying your search filter or be the first to ask a question!'}
                </p>
                {showSpamQueueOnly && (
                  <button
                    onClick={() => setShowSpamQueueOnly(false)}
                    className="mt-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold"
                  >
                    Return to All Questions
                  </button>
                )}
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isSpamFlaggedHigh = (q.spamCount || 0) >= 5;
                const isAlreadyFlaggedByMe = flaggedIds.includes(q.id);

                return (
                  <div
                    key={q.id}
                    id={`question-card-${q.id}`}
                    onClick={() => handleOpenQuestion(q)}
                    className={`bg-white rounded-2xl p-6 border transition-all cursor-pointer space-y-3 ${
                      isSpamFlaggedHigh
                        ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                        : 'border-stone-200 shadow-xs hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                          {q.category}
                        </span>
                        <span className="text-stone-500">
                          Posted by <strong>{q.authorName}</strong>
                        </span>
                        {isSpamFlaggedHigh && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <AlertTriangle className="w-3 h-3" />
                            {q.spamCount} Spam Reports
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-stone-500">
                        <span className="flex items-center gap-1 font-semibold text-emerald-800 mr-1">
                          <MessageSquareQuote className="w-3.5 h-3.5" />
                          {q.commentsCount} {q.commentsCount === 1 ? 'citation' : 'citations'}
                        </span>

                        {/* Report as Spam button */}
                        <button
                          type="button"
                          id={`flag-spam-btn-${q.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFlagSpam(q.id, true);
                          }}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                            isAlreadyFlaggedByMe
                              ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                              : 'text-stone-500 hover:text-rose-600 hover:bg-rose-50 border-stone-200'
                          }`}
                          title="Flag this message as spam"
                        >
                          <Flag className={`w-3.5 h-3.5 ${isAlreadyFlaggedByMe ? 'text-rose-600 fill-rose-500' : 'text-stone-400'}`} />
                          <span>{isAlreadyFlaggedByMe ? 'Flagged' : 'Report Spam'}</span>
                          {(q.spamCount || 0) > 0 && (
                            <span className="font-mono font-bold text-[10px] text-rose-700">({q.spamCount})</span>
                          )}
                        </button>

                        {/* Upvote Helpful button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvoteQuestion(q.id);
                          }}
                          className="flex items-center gap-1 hover:text-emerald-800 p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                          title="Helpful question"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{q.upvotes}</span>
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 hover:text-emerald-900 transition-colors leading-snug">
                      {q.title}
                    </h3>

                    <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed">
                      {q.details}
                    </p>

                    {/* Prominent Banner if marked spam 5 or more times */}
                    {isSpamFlaggedHigh && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-rose-950">
                        <div className="flex items-center gap-2 font-semibold">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>This message has received {q.spamCount} spam reports from other community members.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResetSpamFlags(q.id);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg text-xs font-semibold"
                          >
                            Dismiss Flags
                          </button>
                          <button
                            type="button"
                            id={`delete-spam-q-${q.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(q.id);
                            }}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Message</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {q.tags.map((t, idx) => (
                          <span key={idx} className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" /> #{t}
                          </span>
                        ))}
                      </div>

                      <span className="text-xs font-semibold text-emerald-800">
                        Join Debate & View References ➜
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Detailed Thread View */
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setActiveQuestion(null)}
              className="text-xs font-bold text-stone-600 hover:text-emerald-900 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Questions</span>
            </button>

            {/* Spam / Delete controls in detail header if high flags */}
            {(activeQuestion.spamCount || 0) >= 5 && (
              <button
                type="button"
                onClick={() => handleDeleteQuestion(activeQuestion.id)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Message ({activeQuestion.spamCount} Flags)</span>
              </button>
            )}
          </div>

          {/* Full Question Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  {activeQuestion.category}
                </span>
                {(activeQuestion.spamCount || 0) >= 5 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {activeQuestion.spamCount} Community Spam Flags
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <span>By {activeQuestion.authorName}</span>
                <span>•</span>
                <span>{new Date(activeQuestion.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
              {activeQuestion.title}
            </h2>

            <p className="text-stone-700 text-base leading-relaxed whitespace-pre-line bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
              {activeQuestion.details}
            </p>

            {/* If marked 5+ times spam, show notice with deletion control */}
            {(activeQuestion.spamCount || 0) >= 5 && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-950 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Flagged by {activeQuestion.spamCount} community members as spam</span>
                  </div>
                  <p className="text-[11px] text-rose-800">
                    This message has crossed the 5-report moderation threshold. You can remove it permanently or dismiss the flags.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleResetSpamFlags(activeQuestion.id)}
                    className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-xl text-xs font-semibold"
                  >
                    Dismiss Flags
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(activeQuestion.id)}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Message</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
              <div className="flex flex-wrap gap-1.5">
                {activeQuestion.tags.map((t, idx) => (
                  <span key={idx} className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {/* Report as spam button */}
                <button
                  type="button"
                  onClick={() => handleFlagSpam(activeQuestion.id, true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                    flaggedIds.includes(activeQuestion.id)
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 border-stone-200'
                  }`}
                  title="Flag as spam"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedIds.includes(activeQuestion.id) ? 'Reported as Spam' : 'Report Spam'}</span>
                  {(activeQuestion.spamCount || 0) > 0 && (
                    <span className="font-mono font-bold text-[10px] text-rose-700">({activeQuestion.spamCount})</span>
                  )}
                </button>

                <button
                  onClick={() => handleUpvoteQuestion(activeQuestion.id)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-200"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Helpful ({activeQuestion.upvotes})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments & Debates Thread */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>Scholarly Debates & References</span>
                <span className="text-xs bg-emerald-100 text-emerald-900 font-mono px-2 py-0.5 rounded-full">
                  {(commentsMap[activeQuestion.id] || []).length}
                </span>
              </h3>
            </div>

            {/* List of comments */}
            <div className="space-y-4">
              {(!commentsMap[activeQuestion.id] || commentsMap[activeQuestion.id].length === 0) ? (
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center text-stone-500 text-sm">
                  No comments or references submitted yet. Be the first to contribute an authentic perspective below!
                </div>
              ) : (
                commentsMap[activeQuestion.id].map((comment) => {
                  const isCommentReported = flaggedIds.includes(comment.id);
                  const isCommentHighSpam = (comment.spamCount || 0) >= 5;

                  return (
                    <div
                      key={comment.id}
                      id={`comment-${comment.id}`}
                      className={`bg-white rounded-2xl p-6 border shadow-xs space-y-3 ${
                        isCommentHighSpam ? 'border-rose-300 bg-rose-50/20' : 'border-stone-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px]">
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-stone-900">{comment.authorName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                            {comment.stance}
                          </span>
                          {isCommentHighSpam && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {comment.spamCount} Spam Flags
                            </span>
                          )}
                        </div>
                        <span className="text-stone-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Argument text */}
                      <p className="text-stone-800 text-sm sm:text-base leading-relaxed">
                        {comment.text}
                      </p>

                      {/* Scholarly References highlight box */}
                      {comment.references && (
                        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-950 space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-amber-900">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Cited References (Quran / Hadith / Classical Fiqh):</span>
                          </div>
                          <p className="leading-relaxed font-serif">
                            {comment.references}
                          </p>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-end gap-2">
                        {/* Report Spam on Comment */}
                        <button
                          type="button"
                          onClick={() => handleFlagSpam(comment.id, false)}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                            isCommentReported
                              ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                              : 'text-stone-400 hover:text-rose-600 hover:bg-rose-50 border-transparent hover:border-rose-200'
                          }`}
                          title="Report this comment as spam"
                        >
                          <Flag className="w-3 h-3" />
                          <span>{isCommentReported ? 'Reported' : 'Report Spam'}</span>
                          {(comment.spamCount || 0) > 0 && (
                            <span className="font-mono font-bold text-[10px] text-rose-700">({comment.spamCount})</span>
                          )}
                        </button>

                        <button
                          onClick={() => handleUpvoteComment(comment.id)}
                          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-800 transition-colors p-1 rounded"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Helpful ({comment.upvotes})</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Commenting Box (OPEN TO EVERYONE - NO SIGN UP REQUIRED) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-700/20 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h4 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <MessageSquareQuote className="w-5 h-5 text-emerald-800" />
                  <span>Contribute Your Perspective or Scholarly Reference</span>
                </h4>
                <span className="text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Open Participation
                </span>
              </div>

              {commentFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{commentFeedback}</span>
                </div>
              )}

              {/* Open Comment Form without barrier */}
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Name / Display Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Student of Hadith, Brother Ali"
                      value={commentAuthorName}
                      onChange={(e) => setCommentAuthorName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Category of Reply
                    </label>
                    <select
                      value={commentStance}
                      onChange={(e) => setCommentStance(e.target.value as any)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900"
                    >
                      <option value="Scholarly Reference">Scholarly Reference (Quran / Hadith)</option>
                      <option value="Perspective">Analytical Perspective</option>
                      <option value="Clarification">Question / Clarification</option>
                      <option value="Counter-Argument">Polite Counter-Argument</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Authentic Citations (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sahih Bukhari 52, Surah An-Nisa 4:59"
                      value={commentReferences}
                      onChange={(e) => setCommentReferences(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Argument or Scholarly Analysis
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your constructive, reference-backed answer with clarity and Islamic adab..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] text-stone-500 italic">
                    "Speak to people good words..." (Surah Al-Baqarah 2:83)
                  </p>
                  <button
                    id="submit-comment-btn"
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingComment ? 'Submitting...' : 'Post Reference & Comment'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Ask Question Modal (OPEN TO ALL - NO SIGN UP REQUIRED) */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setAskModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-stone-900">
                Ask an Islamic Question or Debate Topic
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Open to all visitors. Post questions for community debate, references, or scholarly review.
              </p>
            </div>

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Name / Pen Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Abdullah, Sister Maryam, Student of Fiqh"
                  value={authorNameInput}
                  onChange={(e) => setAuthorNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Question Title / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ruling on delayed prayer due to work or surgical operations?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                  >
                    <option value="Fiqh & Rulings">Fiqh & Rulings</option>
                    <option value="Quran & Sunnah">Quran & Sunnah</option>
                    <option value="Aqeedah">Aqeedah</option>
                    <option value="Contemporary & Ethics">Contemporary & Ethics</option>
                    <option value="History & Seerah">History & Seerah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Salah, Work, Medical, Fiqh"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Detailed Context & Nuance
                </label>
                <textarea
                  rows={5}
                  placeholder="Explain the background, specific scenario, and what references you are looking to debate..."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:ring-2 focus:ring-emerald-700"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAskModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuestion}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingQuestion ? 'Publishing...' : 'Publish Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
