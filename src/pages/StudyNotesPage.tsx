import React, { useState } from 'react';
import { BOARD_STUDY_NOTES } from '../data/studyNotesData';
import { BoardSubjectNote } from '../types';
import { 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Search, 
  Printer, 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  Award,
  Sparkles,
  Layers
} from 'lucide-react';

export const StudyNotesPage: React.FC = () => {
  const [selectedBoardType, setSelectedBoardType] = useState<'IGCSE' | 'CBSE' | 'NCERT' | 'SSC'>('IGCSE');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const currentBoardNote: BoardSubjectNote = 
    BOARD_STUDY_NOTES.find(b => b.board === selectedBoardType) || BOARD_STUDY_NOTES[0];

  const toggleQuestionReveal = (id: string) => {
    setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter topics based on search query
  const filteredTopics = currentBoardNote.topics.filter(topic => {
    const q = searchQuery.toLowerCase();
    const inTitle = topic.title.toLowerCase().includes(q);
    const inSummary = topic.summary.toLowerCase().includes(q);
    const inPoints = topic.keyPoints.some(p => p.toLowerCase().includes(q));
    const inTerms = topic.importantTerms.some(t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q));
    const inQuestions = topic.sampleQuestions.some(eq => eq.question.toLowerCase().includes(q) || eq.modelAnswer.toLowerCase().includes(q));
    return inTitle || inSummary || inPoints || inTerms || inQuestions;
  });

  const boardOptions: { id: 'IGCSE' | 'CBSE' | 'NCERT' | 'SSC'; label: string; code: string; desc: string }[] = [
    { id: 'IGCSE', label: 'IGCSE / O Level', code: 'Cambridge 0493 / 2058', desc: 'Core Themes, Hadith, Caliphate & Community' },
    { id: 'CBSE', label: 'CBSE Board', code: 'Central Board Grade 9-12', desc: 'Medieval Society, Sufism & Islamic Golden Age' },
    { id: 'NCERT', label: 'NCERT Curriculum', code: 'Themes in History', desc: 'Central Islamic Lands, Caliphate & Charters' },
    { id: 'SSC', label: 'SSC State Board', code: 'Secondary Certificate', desc: 'Diniyat, Taharat, Pillars & Huqooq-ul-Ibad' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Islamic Studies Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Board Study Notes & Revision
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Structured syllabi, key terminology, and marking schemes for IGCSE, CBSE, NCERT, and SSC boards.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-stone-300 shadow-xs"
        >
          <Printer className="w-4 h-4 text-emerald-800" />
          <span>Print Curriculum Guide</span>
        </button>
      </div>

      {/* Board Selector Tabs (no-print) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
        {boardOptions.map((board) => {
          const isSelected = board.id === selectedBoardType;
          return (
            <button
              key={board.id}
              id={`board-tab-${board.id.toLowerCase()}`}
              onClick={() => setSelectedBoardType(board.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-700 shadow-md ring-2 ring-amber-400/60'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isSelected ? 'text-amber-300' : 'text-emerald-800'
                }`}>
                  {board.code}
                </span>
                <GraduationCap className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-stone-400'}`} />
              </div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {board.label}
              </h3>
              <p className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>
                {board.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative no-print">
        <input
          id="search-study-notes-input"
          type="text"
          placeholder={`Search ${currentBoardNote.board} syllabus topics, key definitions, model answers...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 text-stone-900 focus:outline-none shadow-xs"
        />
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
      </div>

      {/* Board Information Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-stone-900 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-emerald-950">
            {currentBoardNote.boardFullName}
          </h2>
          <span className="text-xs bg-emerald-800 text-white font-semibold px-2.5 py-0.5 rounded-full">
            {currentBoardNote.gradeLevel}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          Subject: <strong className="text-emerald-950">{currentBoardNote.subjectTitle}</strong>. Designed specifically for board exam preparation with detailed thematic coverage, historical context, and rubric answers.
        </p>
      </div>

      {/* Topics Container */}
      <div className="space-y-8 printable-area">
        {filteredTopics.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 text-sm">
            No syllabus topics found matching "{searchQuery}".
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <div
              key={topic.id}
              id={`topic-${topic.id}`}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6"
            >
              {/* Topic Title */}
              <div className="border-b border-stone-100 pb-4 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {currentBoardNote.board} Syllabus Topic
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-950">
                  {topic.title}
                </h3>
              </div>

              {/* Summary Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Topic Overview & Synopsis</span>
                </h4>
                <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 text-stone-800 text-sm leading-relaxed">
                  {topic.summary}
                </div>
              </div>

              {/* Core Syllabus Key Points */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Key Analytical Points & Evidence</span>
                </h4>
                <div className="space-y-2">
                  {topic.keyPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs sm:text-sm text-stone-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {pIdx + 1}
                      </span>
                      <span className="leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Terminology / Glossary */}
              {topic.importantTerms.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Key Terms & Technical Glossary</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topic.importantTerms.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1"
                      >
                        <span className="font-bold text-xs text-emerald-950 block">{t.term}</span>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {t.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exam Questions & Model Solutions */}
              {topic.sampleQuestions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Model Board Exam Questions & Marking Guide</span>
                  </h4>

                  <div className="space-y-3">
                    {topic.sampleQuestions.map((eq, qIdx) => {
                      const qId = `${topic.id}-q-${qIdx}`;
                      const isExpanded = expandedQuestions[qId] ?? false;
                      return (
                        <div
                          key={qId}
                          className="rounded-2xl border border-stone-200 bg-white overflow-hidden transition-all shadow-2xs"
                        >
                          <div
                            onClick={() => toggleQuestionReveal(qId)}
                            className="p-4 bg-stone-50/80 hover:bg-stone-100/80 transition-colors cursor-pointer flex items-start justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                                  {eq.marks} Marks
                                </span>
                                <span className="text-[11px] font-mono text-stone-500">
                                  Board Rubric
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                                {eq.question}
                              </p>
                            </div>

                            <button className="p-1 text-stone-500 hover:text-stone-800 shrink-0">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="p-4 sm:p-5 bg-white border-t border-stone-100 space-y-2.5 text-xs sm:text-sm">
                              <div className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Model Evaluator Answer:</span>
                              </div>
                              <p className="text-stone-700 leading-relaxed whitespace-pre-line bg-amber-50/40 p-3.5 rounded-xl border border-amber-200/60 font-serif">
                                {eq.modelAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
