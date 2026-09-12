export interface PrintableChartItem {
  id: string;
  title: string;
  subtitle: string;
  itemType?: string; // e.g. 'Poster', 'Chart', 'Notes', 'Infographic', 'Syllabus', etc.
  category: string;
  description: string;
  orientation?: 'portrait' | 'landscape';
  fileType?: 'pdf' | 'image' | 'docx' | 'doc' | 'sheet' | 'interactive' | string;
  fileName?: string;
  fileSize?: string;
  fileDataUrl?: string;
  externalUrl?: string;
  imageUrl?: string;
  attachments?: {
    name: string;
    type: string;
    size: string;
    dataUrl: string;
  }[];
  sections?: {
    heading: string;
    subtext?: string;
    items: {
      label: string;
      arabic?: string;
      transliteration?: string;
      detail: string;
      step?: number;
    }[];
  }[];
  footerNote?: string;
  authorEmail?: string;
  createdAt?: string;
}

export const PRINTABLE_CHARTS: PrintableChartItem[] = [
  {
    id: 'wudu-guide',
    title: 'The Complete Step-by-Step Guide to Wudu (Ablution)',
    subtitle: 'Centre of Islam • Visual Reference for Home, Madrasah & Mosque',
    itemType: 'Chart',
    fileType: 'interactive',
    category: 'Salah & Worship',
    description: 'A comprehensive step-by-step visual chart of Sunnah and Fard steps of ablution with Arabic intentions and supplications.',
    orientation: 'portrait',
    sections: [
      {
        heading: 'Intention & Essential Steps',
        items: [
          {
            step: 1,
            label: 'Intention (Niyyah) & Bismillah',
            arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            transliteration: 'Bismillahir-Rahmanir-Rahim',
            detail: 'Make pure intention in your heart to purify yourself for prayer and begin in Allah\'s name.'
          },
          {
            step: 2,
            label: 'Wash Hands (3 times)',
            detail: 'Wash both hands up to the wrists thoroughly three times, ensuring water passes between fingers.'
          },
          {
            step: 3,
            label: 'Rinse Mouth (Madmadah - 3 times)',
            detail: 'Take a handful of water with your right hand and rinse your mouth thoroughly three times.'
          },
          {
            step: 4,
            label: 'Inhale Water into Nostrils (Istinshaq - 3 times)',
            detail: 'Sniff water gently into the nose with the right hand and blow it out with the left hand three times.'
          },
          {
            step: 5,
            label: 'Wash Entire Face (Fard - 3 times)',
            detail: 'Wash the face completely from hairline to chin and earlobe to earlobe three times.'
          },
          {
            step: 6,
            label: 'Wash Arms up to the Elbows (Fard - 3 times)',
            detail: 'Wash the right arm including the elbow three times, then the left arm three times.'
          },
          {
            step: 7,
            label: 'Wipe the Head (Masah - Fard - 1 time)',
            detail: 'Wipe wet hands from front hairline to back of head and return forward.'
          },
          {
            step: 8,
            label: 'Wipe the Ears (1 time)',
            detail: 'Use wet index fingers to wipe the inner contours of ears and thumbs for the backs of the ears.'
          },
          {
            step: 9,
            label: 'Wash Feet up to the Ankles (Fard - 3 times)',
            detail: 'Wash the right foot including ankles and between toes three times, then repeat with the left foot.'
          }
        ]
      },
      {
        heading: 'Dua After Completing Wudu',
        items: [
          {
            label: 'Ash-Shahadah & Supplication',
            arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
            transliteration: 'Ashhadu alla ilaha illallahu wahdahu la shareeka lah, wa ashhadu anna Muhammadan \'abduhu wa rasooluh. Allahummaj\'alnee minat-tawwabeena waj\'alnee minal-mutatahhireen.',
            detail: 'Virtue: The 8 gates of Paradise are opened for whoever recites this after Wudu (Sahih Muslim).'
          }
        ]
      }
    ],
    footerNote: 'Centre of Islam • Distribute freely for educational and community benefit.'
  },
  {
    id: 'salah-breakdown',
    title: 'Daily 5 Prayers & Rak\'ah Breakdown Chart',
    subtitle: 'Fard, Sunnah Mu\'akkadah, Witr & Nafl Detailed Chart',
    itemType: 'Chart',
    fileType: 'interactive',
    category: 'Salah & Worship',
    description: 'Clean wall chart showing the exact order and composition of Rak\'ahs for all 5 daily prayers plus Jum\'ah.',
    orientation: 'portrait',
    sections: [
      {
        heading: 'Five Daily Fara\'id & Sunan',
        items: [
          {
            label: 'Fajr (Dawn Prayer)',
            detail: '2 Sunnah Mu\'akkadah (strongly emphasized) + 2 Fard. Total: 4 Rak\'ahs.'
          },
          {
            label: 'Dhuhr (Midday Prayer)',
            detail: '4 Sunnah Mu\'akkadah + 4 Fard + 2 Sunnah Mu\'akkadah + 2 Nafl (optional). Total: 12 Rak\'ahs.'
          },
          {
            label: 'Asr (Late Afternoon Prayer)',
            detail: '4 Sunnah Ghair-Mu\'akkadah (optional) + 4 Fard. Total: 8 Rak\'ahs.'
          },
          {
            label: 'Maghrib (Sunset Prayer)',
            detail: '3 Fard + 2 Sunnah Mu\'akkadah + 2 Nafl (optional). Total: 7 Rak\'ahs.'
          },
          {
            label: 'Isha (Night Prayer)',
            detail: '4 Sunnah (optional) + 4 Fard + 2 Sunnah Mu\'akkadah + 2 Nafl + 3 Witr Wajib + 2 Nafl. Total: 17 Rak\'ahs.'
          },
          {
            label: 'Jumu\'ah (Friday Congregational Prayer)',
            detail: 'Khutbah + 2 Fard (replaces Dhuhr) + 4 Sunnah before + 4 Sunnah after (or 2+2).'
          }
        ]
      }
    ],
    footerNote: 'The Prophet (ﷺ) said: "The first thing for which a person will be held accountable on the Day of Judgment will be his prayer." (At-Tirmidhi)'
  },
  {
    id: 'names-of-allah',
    title: 'The 99 Beautiful Names of Allah (Asma-ul-Husna)',
    subtitle: 'With Arabic Typography, English Transliteration & Meaning',
    itemType: 'Poster',
    fileType: 'interactive',
    category: 'Daily Reminders',
    description: 'A wall poster displaying divine attributes of Allah to recite, memorize, and reflect upon.',
    orientation: 'landscape',
    sections: [
      {
        heading: 'Selected Core Divine Attributes',
        items: [
          { label: 'Ar-Rahman', arabic: 'الرَّحْمَٰنُ', detail: 'The Most Gracious, entirely Merciful to all creation.' },
          { label: 'Ar-Rahim', arabic: 'الرَّحِيمُ', detail: 'The Especially Merciful, granting special mercy to believers.' },
          { label: 'Al-Malik', arabic: 'الْمَلِكُ', detail: 'The King and Sovereign Owner of all existence.' },
          { label: 'Al-Quddus', arabic: 'الْقُدُّوسُ', detail: 'The Most Holy, absolutely free from any defect.' },
          { label: 'As-Salam', arabic: 'السَّلَامُ', detail: 'The Source of Peace and Perfection.' },
          { label: 'Al-Mu\'min', arabic: 'الْمُؤْمِنُ', detail: 'The Granter of Security and Faith.' },
          { label: 'Al-Muhaymin', arabic: 'الْمُهَيْمِنُ', detail: 'The Guardian and Ever-Watchful Protector.' },
          { label: 'Al-Aziz', arabic: 'الْعَزِيزُ', detail: 'The All-Mighty, Invincible and Unconquerable.' },
          { label: 'Al-Jabbar', arabic: 'الْجَبَّارُ', detail: 'The Restorer of Brokenness, The Supreme Compeller.' },
          { label: 'Al-Mutakabbir', arabic: 'الْمُتَكَبِّرُ', detail: 'The Supreme in Greatness and Majesty.' },
          { label: 'Al-Khaliq', arabic: 'الْخَالِقُ', detail: 'The Creator from nothingness.' },
          { label: 'Al-Ghaffar', arabic: 'الْغَفَّارُ', detail: 'The Continual Forgiver of Sins.' },
          { label: 'Al-Wahhab', arabic: 'الْوَهَّابُ', detail: 'The Supreme Bestower of Unconditional Gifts.' },
          { label: 'Ar-Razzaq', arabic: 'الرَّزَّاقُ', detail: 'The Supreme Provider of All Sustenance.' },
          { label: 'Al-Alim', arabic: 'الْعَلِيمُ', detail: 'The All-Knowing, cognizant of hidden and manifest.' },
          { label: 'Al-Hakim', arabic: 'الْحَكِيمُ', detail: 'The All-Wise, in Decree and Governance.' }
        ]
      }
    ],
    footerNote: 'Surah Al-A\'raf (7:180): "And to Allah belong the best names, so invoke Him by them."'
  },
  {
    id: 'daily-duas',
    title: 'Essential Daily Duas from the Sunnah',
    subtitle: 'Morning, Evening, Meals, Travel & Rest Supplications',
    itemType: 'Notes',
    fileType: 'interactive',
    category: 'Children & Beginners',
    description: 'Pocket and fridge chart with fundamental daily remembrances for the entire household.',
    orientation: 'portrait',
    sections: [
      {
        heading: 'Everyday Practical Supplications',
        items: [
          {
            label: 'Before Eating',
            arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
            transliteration: 'Bismillahi wa \'ala barakatillah',
            detail: 'In the name of Allah and upon the blessing of Allah.'
          },
          {
            label: 'After Eating',
            arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
            transliteration: 'Alhamdu lillahilladhi at\'amana wa saqana wa ja\'alana muslimeen',
            detail: 'Praise be to Allah Who fed us, gave us drink, and made us Muslims.'
          },
          {
            label: 'Before Sleeping',
            arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
            transliteration: 'Bismika Allahumma amootu wa ahya',
            detail: 'In Your name, O Allah, I die and I live.'
          },
          {
            label: 'Upon Waking Up',
            arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
            transliteration: 'Alhamdu lillahilladhi ahyana ba\'da ma amatana wa ilaihin-nushoor',
            detail: 'Praise be to Allah Who gave us life after giving us death, and unto Him is the resurrection.'
          },
          {
            label: 'Leaving the Home',
            arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
            transliteration: 'Bismillahi tawakkaltu \'alallahi, wa la hawla wa la quwwata illa billah',
            detail: 'In the name of Allah, I place my trust in Allah; there is no power nor might except with Allah.'
          }
        ]
      }
    ],
    footerNote: 'Centre of Islam • Printable Education Series'
  }
];
