export type PageId = 
  | 'home'
  | 'quran'
  | 'calendar'
  | 'hadith'
  | 'daily-quotes'
  | 'printables'
  | 'community-qa'
  | 'study-notes'
  | 'convert-guide'
  | 'salah-counter'
  | 'tasbih'
  | 'admin'
  | 'about'
  | 'privacy'
  | 'terms';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}

export interface Question {
  id: string;
  title: string;
  details: string;
  category: 'Fiqh & Rulings' | 'Quran & Sunnah' | 'Aqeedah' | 'Contemporary & Ethics' | 'History & Seerah';
  tags: string[];
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  upvotes: number;
  commentsCount: number;
  spamCount?: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  questionId: string;
  text: string;
  references?: string;
  stance: 'Scholarly Reference' | 'Perspective' | 'Clarification' | 'Counter-Argument';
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  upvotes: number;
  spamCount?: number;
  createdAt: string;
}

export interface SurahMeta {
  number: number;
  name: string; // Arabic
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  numberInSurah: number;
  textArabic: string;
  textEnglish: string;
  transliteration?: string;
}

export interface HadithItem {
  id: string;
  book: string;
  hadithNumber: string | number;
  narrator: string;
  arabicText?: string;
  englishText: string;
  topic: string;
  grade?: string;
  referenceUrl?: string;
}

export interface QuoteItem {
  id: string;
  quote: string;
  source: string; // e.g., Surah Ash-Sharh 94:5 or Sahih Bukhari 6011
  category: 'Patience & Hope' | 'Gratitude' | 'Mercy & Forgiveness' | 'Knowledge' | 'Good Character' | 'Prayer & Remembrance';
  arabic?: string;
}

export interface PrintableChart {
  id: string;
  title: string;
  category: 'Salah & Worship' | 'Ramadan & Fasting' | 'Children & Beginners' | 'Tajweed & Quran' | 'Daily Reminders';
  description: string;
  badge: string;
  previewPoints: string[];
}

export interface BoardTopic {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  importantTerms: { term: string; definition: string }[];
  sampleQuestions: { question: string; marks: number; modelAnswer: string }[];
}

export interface BoardSubjectNote {
  id: string;
  board: 'IGCSE' | 'CBSE' | 'NCERT' | 'SSC';
  boardFullName: string;
  subjectTitle: string;
  gradeLevel: string;
  topics: BoardTopic[];
}

export interface DailySalahCheck {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface MonthlySalahData {
  [dayNumber: number]: DailySalahCheck;
}

export interface NoteAttachment {
  name: string;
  type: string;
  size: string;
  dataUrl: string; // Base64 data url for viewing or downloading
}

export interface GeneralNoteItem {
  id: string;
  title: string;
  category: string;
  description: string;
  content?: string;
  keyPoints?: string[];
  importantTerms?: { term: string; definition: string }[];
  sampleQuestions?: { question: string; marks?: number; modelAnswer: string }[];
  attachments?: NoteAttachment[];
  authorEmail?: string;
  createdAt: string;
}

export interface AdminPrintableChart {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  description: string;
  imageUrl?: string;
  attachments?: NoteAttachment[];
  sections?: {
    heading: string;
    items: {
      label?: string;
      arabic?: string;
      transliteration?: string;
      detail?: string;
      stepNumber?: number;
    }[];
  }[];
  footerNote?: string;
  authorEmail?: string;
  createdAt: string;
}

export interface AdminBoardNote {
  id: string;
  board: 'IGCSE' | 'CBSE' | 'NCERT' | 'SSC';
  subjectTitle: string;
  gradeLevel: string;
  topicTitle: string;
  summary: string;
  keyPoints: string[];
  importantTerms: { term: string; definition: string }[];
  sampleQuestions: { question: string; marks: number; modelAnswer: string }[];
  attachments?: NoteAttachment[];
  authorEmail?: string;
  createdAt: string;
}
