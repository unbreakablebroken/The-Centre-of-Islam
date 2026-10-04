import { HadithApiBook, HadithApiChapter, HadithApiItem, HadithApiResponse } from '../types';

export const HADITH_API_BASE_URL = 'https://hadithapi.com/api';
export const HADITH_API_KEY = '$2y$10$nKZEyvgy4LCzk1VMLROVdifwf8yZAmGIEiHukL1CAF9U1ipchu';

// Standard Books metadata fallback in case of transient network failure
export const CANONICAL_HADITH_BOOKS: HadithApiBook[] = [
  {
    id: 1,
    bookName: "Sahih Bukhari",
    writerName: "Imam Bukhari",
    aboutWriter: "Abu Abdillah Muhammad ibn Ismail al-Bukhari was an Islamic scholar from Bukhara, revered as the compiler of the most authentic hadith collection.",
    writerDeath: "256 AH",
    bookSlug: "sahih-bukhari",
    hadiths_count: 7276,
    chapters_count: 99
  },
  {
    id: 2,
    bookName: "Sahih Muslim",
    writerName: "Imam Muslim",
    aboutWriter: "Muslim ibn al-Hajjaj was an Islamic scholar from Nishapur, compiler of Sahih Muslim, considered second in authenticity only to Sahih Bukhari.",
    writerDeath: "261 AH",
    bookSlug: "sahih-muslim",
    hadiths_count: 7564,
    chapters_count: 56
  },
  {
    id: 4,
    bookName: "Jami' Al-Tirmidhi",
    writerName: "Abu `Isa Muhammad at-Tirmidhi",
    aboutWriter: "Author of Sunan al-Tirmidhi, famous for grading each hadith (Sahih, Hasan, Da'if) and documenting scholarly consensus and differences.",
    writerDeath: "279 AH",
    bookSlug: "al-tirmidhi",
    hadiths_count: 3956,
    chapters_count: 50
  },
  {
    id: 5,
    bookName: "Sunan Abu Dawood",
    writerName: "Imam Abu Dawud as-Sijistani",
    aboutWriter: "Eminent collector of legal and judicial hadiths, traveling extensively across Iraq, Egypt, Syria, and Hijaz to compile Sunan Abu Dawud.",
    writerDeath: "275 AH",
    bookSlug: "abu-dawood",
    hadiths_count: 5274,
    chapters_count: 43
  },
  {
    id: 6,
    bookName: "Sunan Ibn-e-Majah",
    writerName: "Imam Ibn Majah al-Qazvini",
    aboutWriter: "Author of Sunan Ibn Majah, completed his comprehensive hadith collection renowned for concise chapters and thematic classification.",
    writerDeath: "273 AH",
    bookSlug: "ibn-e-majah",
    hadiths_count: 4341,
    chapters_count: 39
  },
  {
    id: 7,
    bookName: "Sunan An-Nasa`i",
    writerName: "Imam Ahmad an-Nasa`i",
    aboutWriter: "Renowned for his extremely rigorous scrutiny of narrators, compiling Sunan as-Sughra, one of the Six Canonical Hadith collections.",
    writerDeath: "303 AH",
    bookSlug: "sunan-nasai",
    hadiths_count: 5761,
    chapters_count: 52
  },
  {
    id: 8,
    bookName: "Mishkat Al-Masabih",
    writerName: "Imam Khatib at-Tabrizi",
    aboutWriter: "Influential 14th-century hadith collection organizing fundamental narrations from across the canonical collections for practical study.",
    writerDeath: "741 AH",
    bookSlug: "mishkat",
    hadiths_count: 6293,
    chapters_count: 29
  },
  {
    id: 9,
    bookName: "Musnad Ahmad",
    writerName: "Imam Ahmad ibn Hanbal",
    aboutWriter: "Imam of the Hanbali school of jurisprudence and author of the colossal Musnad collection containing tens of thousands of narrations.",
    writerDeath: "241 AH",
    bookSlug: "musnad-ahmad",
    hadiths_count: 27000,
    chapters_count: 14
  },
  {
    id: 10,
    bookName: "Al-Silsila Sahiha",
    writerName: "Allama Muhammad Nasir Uddin Al-Albani",
    aboutWriter: "20th-century hadith scholar who meticulously reviewed and authenticated hadith chains across classical Islamic literature.",
    writerDeath: "1999 CE",
    bookSlug: "al-silsila-sahiha",
    hadiths_count: 4000,
    chapters_count: 28
  }
];

// In-memory cache
const memoryCache = {
  books: null as HadithApiBook[] | null,
  chapters: new Map<string, HadithApiChapter[]>(),
  hadithPages: new Map<string, HadithApiResponse>()
};

export interface FetchHadithsOptions {
  book?: string;
  chapter?: number;
  hadithNumber?: string;
  hadithEnglish?: string;
  paginate?: number;
  page?: number;
  status?: string;
}

/**
 * Fetch all available books from HadithAPI
 */
export async function getHadithBooks(): Promise<HadithApiBook[]> {
  if (memoryCache.books && memoryCache.books.length > 0) {
    return memoryCache.books;
  }

  try {
    const url = `${HADITH_API_BASE_URL}/books?apiKey=${encodeURIComponent(HADITH_API_KEY)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.books && Array.isArray(data.books) && data.books.length > 0) {
      memoryCache.books = data.books;
      return data.books;
    }
  } catch (err) {
    console.warn("Could not fetch books from HadithAPI, using canonical list:", err);
  }

  return CANONICAL_HADITH_BOOKS;
}

/**
 * Fetch chapters for a given book slug
 */
export async function getBookChapters(bookSlug: string): Promise<HadithApiChapter[]> {
  if (memoryCache.chapters.has(bookSlug)) {
    return memoryCache.chapters.get(bookSlug)!;
  }

  try {
    const url = `${HADITH_API_BASE_URL}/${bookSlug}/chapters?apiKey=${encodeURIComponent(HADITH_API_KEY)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.chapters && Array.isArray(data.chapters)) {
      memoryCache.chapters.set(bookSlug, data.chapters);
      return data.chapters;
    }
  } catch (err) {
    console.warn(`Could not fetch chapters for ${bookSlug}:`, err);
  }

  return [];
}

/**
 * Fetch hadiths with search, book, chapter, and pagination filters
 */
export async function getHadiths(options: FetchHadithsOptions): Promise<HadithApiResponse> {
  const params = new URLSearchParams();
  params.set('apiKey', HADITH_API_KEY);

  if (options.book && options.book !== 'All') {
    params.set('book', options.book);
  }

  if (options.chapter && options.chapter > 0) {
    params.set('chapter', options.chapter.toString());
  }

  if (options.hadithNumber && options.hadithNumber.trim()) {
    params.set('hadithNumber', options.hadithNumber.trim());
  }

  if (options.hadithEnglish && options.hadithEnglish.trim()) {
    params.set('hadithEnglish', options.hadithEnglish.trim());
  }

  if (options.status && options.status !== 'All') {
    params.set('status', options.status);
  }

  const paginate = options.paginate || 15;
  params.set('paginate', paginate.toString());

  const page = options.page || 1;
  params.set('page', page.toString());

  const cacheKey = params.toString();
  if (memoryCache.hadithPages.has(cacheKey)) {
    return memoryCache.hadithPages.get(cacheKey)!;
  }

  const url = `${HADITH_API_BASE_URL}/hadiths?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HadithAPI error: HTTP ${res.status}`);
  }

  const data: HadithApiResponse = await res.json();
  if (data && data.status === 200 && data.hadiths) {
    // Cache successful response (limit cache size to 40 entries)
    if (memoryCache.hadithPages.size > 40) {
      const firstKey = memoryCache.hadithPages.keys().next().value;
      if (firstKey) memoryCache.hadithPages.delete(firstKey);
    }
    memoryCache.hadithPages.set(cacheKey, data);
    return data;
  }

  return data;
}
