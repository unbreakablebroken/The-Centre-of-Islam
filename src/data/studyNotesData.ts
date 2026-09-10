import { BoardSubjectNote } from '../types';

export const BOARD_STUDY_NOTES: BoardSubjectNote[] = [
  {
    id: 'igcse-islamiyat',
    board: 'IGCSE',
    boardFullName: 'Cambridge Assessment International Education (IGCSE / O Level - 0493 & 2058)',
    subjectTitle: 'Islamiyat (Paper 1 & Paper 2 Core Syllabus)',
    gradeLevel: 'Grade 9 - 11 (IGCSE / O Level)',
    topics: [
      {
        id: 'igcse-t1',
        title: 'Major Themes of the Holy Quran',
        summary: 'Detailed analysis of Passages 1-15 set by Cambridge covering Allah in Himself, Allah\'s relationship with the created world, and Allah\'s Messengers.',
        keyPoints: [
          'Theme 1: Allah in Himself (Surah Al-Baqarah 2:255 Ayatul Kursi, Surah Al-An\'am 6:101-103, Surah Fussilat 41:37, Surah Ash-Shura 42:4-5, Surah Al-Ikhlas 112). Emphasizes Tawhid (Unity of God), Omnipotence, and rejection of Shirk.',
          'Theme 2: Allah\'s Relationship with the Created World (Surah Al-Fatihah 1, Surah Al-Baqarah 2:21-22, Surah Al-Alaq 96:1-5, Surah Al-Zalzalah 99, Surah Al-Nas 114). Highlights divine benevolence, creation as signs, and ultimate accountability on Yawm al-Qiyamah.',
          'Theme 3: Allah\'s Messengers (Adam, Ibrahim, Isa, and Muhammad pbuh). Illustrates human fragility, divine election, preservation through tests, and finality of Prophethood (Khatam an-Nabiyyin).'
        ],
        importantTerms: [
          { term: 'Tawhid', definition: 'The fundamental belief in the absolute oneness, uniqueness, and indivisibility of Allah.' },
          { term: 'Shirk', definition: 'Associating partners, equals, or rivals with Allah in worship or divine attributes (the unpardonable sin if unrepented).' },
          { term: 'Wahy', definition: 'Divine revelation sent down by Allah to His chosen prophets, primarily via Archangel Jibril.' },
          { term: 'Khatam an-Nabiyyin', definition: 'The Seal of the Prophets, confirming Muhammad (pbuh) as the final messenger of Allah.' }
        ],
        sampleQuestions: [
          {
            question: 'Briefly describe the main theme in Surah Al-Ikhlas (112) and how it is applied in a Muslim\'s daily life. [4 marks]',
            marks: 4,
            modelAnswer: 'Main theme: The absolute Oneness of Allah (Tawhid). It rejects polytheism, anthropomorphism, and the concept of divine progeny ("He neither begets nor is born"). Daily life application: Muslims turn exclusively to Allah for supplication, avoid superstitious beliefs or intermediaries, and maintain undivided loyalty in worship and ethical choices.'
          },
          {
            question: 'Give an account of the conditions of pre-Islamic Arabia (Jahiliyyah) prior to the advent of Islam. [10 marks]',
            marks: 10,
            modelAnswer: 'Pre-Islamic Arabia was known as the Age of Ignorance (Jahiliyyah). Politically, there was no centralized government or rule of law; society was governed by tribal loyalty (Asabiyyah) resulting in protracted inter-tribal vendettas (such as the Harb al-Fijar). Religiously, polytheism reigned in Makkah, with 360 idols housed in the Ka\'bah, alongside minor Christian and Jewish populations and solitary monotheists (Hanifs). Socially, rampant female infanticide existed, women held negligible inheritance rights, slavery was cruel and widespread, and practices of usury (Riba) and gambling ruined the poor. The advent of Islam rectified these socio-moral evils, establishing brotherhood, equality before divine law, and strict social justice.'
          }
        ]
      },
      {
        id: 'igcse-t2',
        title: 'The Compilation & Preservation of the Quran',
        summary: 'Stages of preservation from oral memorization during the Prophet\'s life to the Abu Bakr codex and the Uthmanic standard recension.',
        keyPoints: [
          'Prophet\'s Lifetime: Written on palm branches, animal bones (scapulae), parchment, and stones by designated scribes (Zayd ibn Thabit, Ubayy ibn Ka\'b, Ali ibn Abi Talib). Memorized continuously by hundreds of Huffaz.',
          'Caliphate of Abu Bakr (RA): Prompted by the Battle of Yamama (632 CE) where over 70 Huffaz were martyred. Umar (RA) advised Abu Bakr to collect the Quran. Zayd ibn Thabit led a rigorous two-witness methodology for written verification against memorized recitations.',
          'Caliphate of Uthman (RA): Due to expanding frontiers into Persia and Azerbaijan, dialectical differences in recitation emerged. Hudhayfah ibn al-Yaman alerted Uthman. The committee standardized copies based on the Quraishi dialect, distributed master copies to provincial capitals, and retired conflicting codices.'
        ],
        importantTerms: [
          { term: 'Mushaf', definition: 'The bound written physical manuscript of the Holy Quran.' },
          { term: 'Hafiz', definition: 'A Muslim who has completely committed the entirety of the Quran to memory with exact phonetics.' },
          { term: 'Battle of Yamama', definition: 'Decisive battle in 632 CE against the false prophet Musaylimah where loss of Huffaz prompted the initial written compilation.' }
        ],
        sampleQuestions: [
          {
            question: 'Why did Caliph Uthman feel the need to compile an authoritative copy of the Quran? [10 marks]',
            marks: 10,
            modelAnswer: 'During the military campaigns in Armenia and Azerbaijan, soldiers from Syria and Iraq argued fiercely over divergent vocalizations and pronunciations of Quranic verses. General Hudhayfah ibn al-Yaman reported to Caliph Uthman: "Save this Ummah before they differ about their Book as the Jews and Christians differed." Uthman formed a committee led by Zayd ibn Thabit, obtained Hafsa’s master codex, transcribed copies in the pristine Quraishi dialect, sent copies to Kufa, Basra, Damascus, and Makkah, ensuring global textual unity preserved verbatim to this day.'
          }
        ]
      }
    ]
  },
  {
    id: 'cbse-islamic',
    board: 'CBSE',
    boardFullName: 'Central Board of Secondary Education (CBSE Class 9-12 Social Sciences & Humanities)',
    subjectTitle: 'History & Ethics: Medieval Society, Bhakti-Sufi Traditions & Islamic Civilization',
    gradeLevel: 'Class 9, 10, 11 & 12',
    topics: [
      {
        id: 'cbse-t1',
        title: 'Sufi Traditions & Syncretic Culture in Medieval India',
        summary: 'Understanding the rise of Sufism, Chishti and Suhrawardi Silsilas, Khanqahs, Ziyarat, and teachings of universal love and tolerance (Sulh-i Kul).',
        keyPoints: [
          'Origins: Emerged as an inward spiritual movement in early Islam emphasizing Tasawwuf (purification of the self), direct devotion to Allah, and ascetic simplicity.',
          'The Silsilas (Orders): Major lineages include Chishti (Khwaja Moinuddin Chishti of Ajmer, Baba Farid, Nizamuddin Auliya), Suhrawardi, Qadiri, and Naqshbandi.',
          'Khanqah Culture: Hospices led by a Shaikh/Pir where people of all religious backgrounds shared common meals (Langar), listened to spiritual assemblies (Sama), and received shelter.',
          'Philosophy of Sulh-i Kul: "Absolute Peace" and communal harmony promoted by scholars and state policy, prioritizing mutual understanding and ethical brotherhood.'
        ],
        importantTerms: [
          { term: 'Khanqah', definition: 'A spiritual hospice or community lodge where Sufi masters taught disciples and offered open hospitality to travelers.' },
          { term: 'Ziyarat', definition: 'The practice of visiting shrines or holy sites to seek spiritual inspiration and remember the righteous.' },
          { term: 'Sama', definition: 'Spiritual musical gatherings or poetry recitations intended to evoke divine remembrance and ecstasy.' }
        ],
        sampleQuestions: [
          {
            question: 'Explain the core social impact of Chishti Khanqahs in medieval Indian society. [5 marks]',
            marks: 5,
            modelAnswer: 'Chishti Khanqahs functioned as inclusive social melting pots. They instituted open communal kitchens (Langar) funded by unsolicited gifts (Futuh), breaking down caste barriers and economic stratification. The masters spoke local Hindavi dialects, communicated through folk metaphors, avoided political entanglement, and prioritized charity, mercy, and communal amity.'
          }
        ]
      },
      {
        id: 'cbse-t2',
        title: 'The Islamic Golden Age & Scientific Contributions',
        summary: 'Contributions of medieval scholars in medicine, mathematics, astronomy, and optics, and the House of Wisdom (Bayt al-Hikmah) in Baghdad.',
        keyPoints: [
          'House of Wisdom (Bayt al-Hikmah): Major intellectual academy translating Sanskrit, Greek, and Persian treatises into Arabic.',
          'Mathematics: Al-Khwarizmi formulated algebra (Al-Jabr), introduced algorithmic methodology, and popularized the Hindu-Arabic decimal numeral system.',
          'Medicine: Ibn Sina (Avicenna) wrote "The Canon of Medicine" (Al-Qanun fi al-Tibb), standardizing clinical pharmacology and infectious disease protocols. Al-Razi distinguished smallpox from measles.',
          'Optics & Physics: Ibn al-Haytham (Alhazen) pioneered the modern scientific empirical method and light refraction in "Kitab al-Manazir" (Book of Optics).'
        ],
        importantTerms: [
          { term: 'Bayt al-Hikmah', definition: 'The 9th-century House of Wisdom in Abbasid Baghdad that fostered global scientific translation and discovery.' },
          { term: 'Al-Jabr', definition: 'Algebra, coined from Al-Khwarizmi’s groundbreaking text on mathematical balance and restoration.' }
        ],
        sampleQuestions: [
          {
            question: 'How did Al-Khwarizmi revolutionize mathematics during the Islamic Golden Age? [3 marks]',
            marks: 3,
            modelAnswer: 'Al-Khwarizmi authored "Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala", establishing algebra as an independent mathematical discipline. He introduced systematic algorithmic procedures for solving linear and quadratic equations and popularized Hindu decimal numerals including zero to the Western world.'
          }
        ]
      }
    ]
  },
  {
    id: 'ncert-studies',
    board: 'NCERT',
    boardFullName: 'National Council of Educational Research and Training (NCERT Curricula)',
    subjectTitle: 'Themes in World & Indian History: Islam and Religious Traditions',
    gradeLevel: 'Middle & Senior Secondary',
    topics: [
      {
        id: 'ncert-t1',
        title: 'The Central Islamic Lands (c. 600 - 1200 CE)',
        summary: 'The birth of Islam in the Arabian peninsula, the early Caliphate (Khilafah), Umayyad and Abbasid administrations, and urbanization.',
        keyPoints: [
          'The Rise of Islam: Prophet Muhammad (pbuh) united the Arabian tribes under monotheism, establishing a state in Madinah based on the Constitution of Madinah (Mithaq al-Madinah).',
          'The Rightly Guided Caliphs (Khulafa-e-Rashideen): Abu Bakr, Umar, Uthman, and Ali (RA) expanded the state while institutionalizing the public treasury (Bayt al-Mal), judicial systems, and provincial governance.',
          'Urbanism and Commerce: Thriving hubs like Baghdad, Cairo, Damascus, and Cordoba connected Silk Road and maritime trade networks from Mediterranean to Indian Ocean.'
        ],
        importantTerms: [
          { term: 'Ummah', definition: 'The worldwide supranational community of Islamic believers bound by common faith and ethics.' },
          { term: 'Bayt al-Mal', definition: 'The central public treasury responsible for distributing zakat, pensions, and public infrastructure funds.' }
        ],
        sampleQuestions: [
          {
            question: 'Analyze the historical significance of the Constitution of Madinah (Mithaq al-Madinah). [4 marks]',
            marks: 4,
            modelAnswer: 'Drawn up by Prophet Muhammad (pbuh) in 622 CE, the Constitution of Madinah was one of history\'s earliest written constitutional charters. It established a multi-confessional federation where Muslim Muhajirun and Ansar, along with Jewish and non-Muslim tribes, were recognized as one political community (Ummah), guaranteed freedom of religion, instituted collective defense of the city, and established the rule of law over blood feuds.'
          }
        ]
      }
    ]
  },
  {
    id: 'ssc-board',
    board: 'SSC',
    boardFullName: 'Secondary School Certificate (State Boards: Diniyat & Islamic Studies / Urdu Curriculum)',
    subjectTitle: 'Islamic Studies & Moral Education (Diniyat Class 8-10 Syllabus)',
    gradeLevel: 'Class 8, 9 & 10',
    topics: [
      {
        id: 'ssc-t1',
        title: 'Taharat, Namaz & The Five Pillars of Islam (Arkan-e-Islam)',
        summary: 'Comprehensive guidelines on physical and spiritual purification (Wudu, Ghusl, Tayammum) and the mechanics and significance of Salah.',
        keyPoints: [
          'Kalima Tayyibah & Shahadah: First pillar of Islam affirming "La ilaha illallah, Muhammadur Rasulullah".',
          'Taharat (Purification): The fard (obligatory) elements of Wudu: washing face, washing arms up to elbows, wiping 1/4 of head (Masah), and washing feet up to ankles.',
          'Daily Prayers (5 Faraiz): Fajr (2 Sunnah, 2 Fard), Dhuhr (4 Sunnah, 4 Fard, 2 Sunnah, 2 Nafl), Asr (4 Sunnah ghair-muakkada, 4 Fard), Maghrib (3 Fard, 2 Sunnah, 2 Nafl), Isha (4 Sunnah, 4 Fard, 2 Sunnah, 2 Nafl, 3 Witr, 2 Nafl).',
          'Zakat & Sawm (Fasting): Obligation of 2.5% on wealth exceeding Nisab, spiritual discipline and empathy during Ramadan.'
        ],
        importantTerms: [
          { term: 'Faraiz of Wudu', definition: 'The 4 non-negotiable requirements of ablution without which prayer is invalid.' },
          { term: 'Nisab', definition: 'The minimum threshold of qualifying wealth upon which Zakat becomes obligatory (equivalent to 87.48g of gold or 612.36g of silver).' },
          { term: 'Huqooq-ul-Ibad', definition: 'The divine rights and duties owed to fellow human beings, including parents, neighbors, orphans, and the needy.' }
        ],
        sampleQuestions: [
          {
            question: 'Enumerate the four mandatory obligations (Faraiz) of Wudu according to Islamic jurisprudence. [4 marks]',
            marks: 4,
            modelAnswer: '1. Washing the entire face from hairline to below the chin and from earlobe to earlobe.\n2. Washing both hands and arms up to and including the elbows once.\n3. Performing Masah (wiping with wet hands) over at least one-fourth of the head.\n4. Washing both feet up to and including the ankles once.'
          },
          {
            question: 'Differentiate between Huqooq-Allah (Rights of Allah) and Huqooq-ul-Ibad (Rights of Creation). [6 marks]',
            marks: 6,
            modelAnswer: 'Huqooq-Allah refer to obligations directly due to the Creator, such as Iman, Salah, Fasting, and Hajj. Allah in His supreme mercy may forgive shortcomings in these through sincere repentance. Huqooq-ul-Ibad refer to the rights of fellow human beings and creation (kindness to parents, honoring neighbors, paying debts, fair trade, abstaining from backbiting). Crucially, Islam teaches that Allah will not forgive violations of Huqooq-ul-Ibad until the aggrieved person themselves grants pardon, highlighting the supreme importance of justice, empathy, and interpersonal ethics in Islam.'
          }
        ]
      }
    ]
  }
];
