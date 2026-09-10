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
  ExternalLink
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
  const { user, openAuthModalWithNotice } = useAuth();
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  // Listen to Firestore questions if available
  useEffect(() => {
    try {
      const qCol = collection(db, 'questions');
      const unsubscribe = onSnapshot(
        qCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Question[] = [];
            snapshot.forEach((doc) => {
              list.push({ id: doc.id, ...(doc.data() as any) });
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
    if (!user) {
      openAuthModalWithNotice('Please sign in or enter a display name to submit a community discussion question.');
      return;
    }
    setAskModalOpen(true);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetails.trim()) return;

    setIsSubmittingQuestion(true);
    const newQ: Question = {
      id: `q-${Date.now()}`,
      title: newTitle.trim(),
      details: newDetails.trim(),
      category: newCategory,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      authorId: user?.uid || 'anon',
      authorName: user?.displayName || 'Community Seeker',
      authorPhoto: user?.photoURL || undefined,
      upvotes: 1,
      commentsCount: 0,
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
  };

  const handleOpenQuestion = (q: Question) => {
    setActiveQuestion(q);
    setCommentFeedback(null);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModalWithNotice('Commenting and citing references requires you to sign up or log in to ensure authentic, accountable discussion.');
      return;
    }

    if (!commentText.trim() || !activeQuestion) return;

    setIsSubmittingComment(true);
    const newC: Comment = {
      id: `c-${Date.now()}`,
      questionId: activeQuestion.id,
      text: commentText.trim(),
      references: commentReferences.trim() || undefined,
      stance: commentStance,
      authorId: user.uid,
      authorName: user.displayName || 'Community Contributor',
      authorPhoto: user.photoURL || undefined,
      upvotes: 0,
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
    setCommentFeedback('Your reference & comment was successfully published to the discussion!');
    setIsSubmittingComment(false);
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

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
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
            Pose questions, engage in structured debates, and provide authentic Quranic and Hadith citations.
          </p>
        </div>

        <button
          id="ask-question-btn"
          onClick={handleOpenAskModal}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ask a New Question</span>
        </button>
      </div>

      {/* Main Content: Question List OR Question Detail */}
      {!activeQuestion ? (
        <div className="space-y-6">
          {/* Filters & Search Bar */}
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

            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === c
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Question Cards Feed */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                id={`question-card-${q.id}`}
                onClick={() => handleOpenQuestion(q)}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                      {q.category}
                    </span>
                    <span className="text-stone-500">
                      Posted by <strong>{q.authorName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-stone-500">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <MessageSquareQuote className="w-3.5 h-3.5" />
                      {q.commentsCount} {q.commentsCount === 1 ? 'citation/debate' : 'citations/debates'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvoteQuestion(q.id);
                      }}
                      className="flex items-center gap-1 hover:text-emerald-800 p-1 rounded transition-colors"
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
            ))}
          </div>
        </div>
      ) : (
        /* Detailed Thread View */
        <div className="space-y-6">
          <button
            onClick={() => setActiveQuestion(null)}
            className="text-xs font-bold text-stone-600 hover:text-emerald-900 flex items-center gap-1 bg-stone-100 px-3 py-1.5 rounded-lg w-fit transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Questions</span>
          </button>

          {/* Full Question Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                {activeQuestion.category}
              </span>
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

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
              <div className="flex flex-wrap gap-1.5">
                {activeQuestion.tags.map((t, idx) => (
                  <span key={idx} className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleUpvoteQuestion(activeQuestion.id)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-200"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-800" />
                <span>Helpful ({activeQuestion.upvotes})</span>
              </button>
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
                  No comments or references submitted yet. Be the first to contribute an authentic perspective!
                </div>
              ) : (
                commentsMap[activeQuestion.id].map((comment) => (
                  <div
                    key={comment.id}
                    id={`comment-${comment.id}`}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3"
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

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => handleUpvoteComment(comment.id)}
                        className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-800 transition-colors p-1 rounded"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful ({comment.upvotes})</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Commenting Box (MANDATORY SIGN UP REQUIREMENT AS USER SPECIFIED) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-700/30 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h4 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-800" />
                  <span>Contribute Your Perspective or Reference</span>
                </h4>
                <span className="text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {user ? `Posting as ${user.displayName}` : 'Sign Up Required to Post'}
                </span>
              </div>

              {commentFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{commentFeedback}</span>
                </div>
              )}

              {!user ? (
                /* Unauthenticated Sign-Up Barrier */
                <div className="bg-stone-50 rounded-2xl p-6 text-center space-y-3 border border-stone-200">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <User className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-stone-900 text-base">
                    Sign Up to Join the Discussion
                  </h5>
                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    To maintain the highest standard of scholarly adab, prevent spam, and verify references, commenting on debates requires signing in.
                  </p>
                  <button
                    id="comment-signup-btn"
                    type="button"
                    onClick={() => openAuthModalWithNotice('Sign up or log in to post your reference or perspective in the debate.')}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In with Google / Alias</span>
                  </button>
                </div>
              ) : (
                /* Authenticated Comment Form */
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Category of Reply
                      </label>
                      <select
                        value={commentStance}
                        onChange={(e) => setCommentStance(e.target.value as any)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900"
                      >
                        <option value="Scholarly Reference">Scholarly Reference (Citing Quran / Hadith)</option>
                        <option value="Perspective">Analytical Perspective</option>
                        <option value="Clarification">Question / Clarification</option>
                        <option value="Counter-Argument">Polite Counter-Argument</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Authentic Citations (Surah, Hadith #, Authoritative Scholar)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sahih Bukhari 52, Surah An-Nisa 4:59, Ibn Kathir"
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
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-stone-500 italic">
                      "Speak to people good words..." (Surah Al-Baqarah 2:83)
                    </p>
                    <button
                      id="submit-comment-btn"
                      type="submit"
                      disabled={isSubmittingComment || !commentText.trim()}
                      className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingComment ? 'Submitting...' : 'Post Reference & Comment'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
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
                Post questions for community debate, references, or scholarly review.
              </p>
            </div>

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
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
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
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
