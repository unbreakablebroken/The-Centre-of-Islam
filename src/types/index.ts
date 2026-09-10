export type PageId = 
  | 'home'
  | 'prayer-times'
  | 'quran'
  | 'calendar'
  | 'hadith'
  | 'daily-quotes'
  | 'printables'
  | 'community-qa'
  | 'study-notes'
  | 'salah-counter'
  | 'tasbih'
  | 'about'
  | 'privacy'
  | 'terms';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
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

export interface BoardSubjectNote {
  id: string;
  board: 'IGCSE' | 'CBSE' | 'NCERT' | 'SSC';
  boardFullName: string;
  subjectTitle: string;
  gradeLevel: string;
  topics: {
    id: string;
    title: string;
    summary: string;
    keyPoints: string[];
    importantTerms: { term: string; definition: string }[];
    sampleQuestions: { question: string; marks: number; modelAnswer: string }[];
  }[];
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
