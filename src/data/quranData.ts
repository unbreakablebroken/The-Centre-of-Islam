import { SurahMeta, Ayah } from '../types';

export const SURAH_LIST: SurahMeta[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Faatiha", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 2, name: "البقرة", englishName: "Al-Baqara", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan" },
  { number: 3, name: "آل عمران", englishName: "Aal-i-Imraan", englishNameTranslation: "The Family of Imraan", numberOfAyahs: 200, revelationType: "Medinan" },
  { number: 4, name: "النساء", englishName: "An-Nisaa", englishNameTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan" },
  { number: 5, name: "المائدة", englishName: "Al-Maaida", englishNameTranslation: "The Table Spread", numberOfAyahs: 120, revelationType: "Medinan" },
  { number: 6, name: "الأنعام", englishName: "Al-An'aam", englishNameTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan" },
  { number: 7, name: "الأعراف", englishName: "Al-A'raaf", englishNameTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan" },
  { number: 8, name: "الأنفال", englishName: "Al-Anfaal", englishNameTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan" },
  { number: 9, name: "التوبة", englishName: "At-Tawba", englishNameTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan" },
  { number: 10, name: "يونس", englishName: "Yunus", englishNameTranslation: "Jonas", numberOfAyahs: 109, revelationType: "Meccan" },
  { number: 11, name: "هود", englishName: "Hud", englishNameTranslation: "Hud", numberOfAyahs: 123, revelationType: "Meccan" },
  { number: 12, name: "يوسف", englishName: "Yusuf", englishNameTranslation: "Joseph", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan" },
  { number: 14, name: "ابراهيم", englishName: "Ibrahim", englishNameTranslation: "Abraham", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", numberOfAyahs: 99, revelationType: "Meccan" },
  { number: 16, name: "النحل", englishName: "An-Nahl", englishNameTranslation: "The Bee", numberOfAyahs: 128, revelationType: "Meccan" },
  { number: 17, name: "الإسراء", englishName: "Al-Israa", englishNameTranslation: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 19, name: "مريم", englishName: "Maryam", englishNameTranslation: "Mary", numberOfAyahs: 98, revelationType: "Meccan" },
  { number: 20, name: "طه", englishName: "Taa-Haa", englishNameTranslation: "Taa-Haa", numberOfAyahs: 135, revelationType: "Meccan" },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiyaa", englishNameTranslation: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan" },
  { number: 22, name: "الحج", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 23, name: "المؤمنون", englishName: "Al-Muminoon", englishNameTranslation: "The Believers", numberOfAyahs: 118, revelationType: "Meccan" },
  { number: 24, name: "النور", englishName: "An-Noor", englishNameTranslation: "The Light", numberOfAyahs: 64, revelationType: "Medinan" },
  { number: 25, name: "الفرقان", englishName: "Al-Furqaan", englishNameTranslation: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan" },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'araa", englishNameTranslation: "The Poets", numberOfAyahs: 227, revelationType: "Meccan" },
  { number: 27, name: "النمل", englishName: "An-Naml", englishNameTranslation: "The Ant", numberOfAyahs: 93, revelationType: "Meccan" },
  { number: 28, name: "القصص", englishName: "Al-Qasas", englishNameTranslation: "The Stories", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 29, name: "العنكبوت", englishName: "Al-Ankaboot", englishNameTranslation: "The Spider", numberOfAyahs: 69, revelationType: "Meccan" },
  { number: 30, name: "الروم", englishName: "Ar-Room", englishNameTranslation: "The Romans", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 31, name: "لقمان", englishName: "Luqman", englishNameTranslation: "Luqman", numberOfAyahs: 34, revelationType: "Meccan" },
  { number: 32, name: "السجدة", englishName: "As-Sajda", englishNameTranslation: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzaab", englishNameTranslation: "The Combined Forces", numberOfAyahs: 73, revelationType: "Medinan" },
  { number: 34, name: "سبإ", englishName: "Saba", englishNameTranslation: "Sheba", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 35, name: "فاطر", englishName: "Faatir", englishNameTranslation: "The Originator", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 36, name: "يس", englishName: "Yaseen", englishNameTranslation: "Yaseen", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 37, name: "الصافات", englishName: "As-Saaffaat", englishNameTranslation: "Those Who Set The Ranks", numberOfAyahs: 182, revelationType: "Meccan" },
  { number: 38, name: "ص", englishName: "Saad", englishNameTranslation: "The Letter Saad", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", englishNameTranslation: "The Troops", numberOfAyahs: 75, revelationType: "Meccan" },
  { number: 40, name: "غافر", englishName: "Ghafir", englishNameTranslation: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan" },
  { number: 41, name: "فصلت", englishName: "Fussilat", englishNameTranslation: "Explained In Detail", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 42, name: "الشورى", englishName: "Ash-Shoora", englishNameTranslation: "The Consultation", numberOfAyahs: 53, revelationType: "Meccan" },
  { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", englishNameTranslation: "The Ornaments of Gold", numberOfAyahs: 89, revelationType: "Meccan" },
  { number: 44, name: "الدخان", englishName: "Ad-Dukhaan", englishNameTranslation: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan" },
  { number: 45, name: "الجاثية", englishName: "Al-Jaathiya", englishNameTranslation: "The Crouching", numberOfAyahs: 37, revelationType: "Meccan" },
  { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", englishNameTranslation: "The Wind-Curved Sandhills", numberOfAyahs: 35, revelationType: "Meccan" },
  { number: 47, name: "محمد", englishName: "Muhammad", englishNameTranslation: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan" },
  { number: 48, name: "الفتح", englishName: "Al-Fath", englishNameTranslation: "The Victory", numberOfAyahs: 29, revelationType: "Medinan" },
  { number: 49, name: "الحجرات", englishName: "Al-Hujuraat", englishNameTranslation: "The Rooms", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 50, name: "ق", englishName: "Qaaf", englishNameTranslation: "The Letter Qaaf", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 51, name: "الذاريات", englishName: "Adh-Dhaariyat", englishNameTranslation: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 52, name: "الطور", englishName: "At-Toor", englishNameTranslation: "The Mount", numberOfAyahs: 49, revelationType: "Meccan" },
  { number: 53, name: "النجم", englishName: "An-Najm", englishNameTranslation: "The Star", numberOfAyahs: 62, revelationType: "Meccan" },
  { number: 54, name: "القمر", englishName: "Al-Qamar", englishNameTranslation: "The Moon", numberOfAyahs: 55, revelationType: "Meccan" },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahmaan", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 56, name: "الواقعة", englishName: "Al-Waaqia", englishNameTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan" },
  { number: 57, name: "الحديد", englishName: "Al-Hadid", englishNameTranslation: "The Iron", numberOfAyahs: 29, revelationType: "Medinan" },
  { number: 58, name: "المجادلة", englishName: "Al-Mujaadila", englishNameTranslation: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan" },
  { number: 59, name: "الحشر", englishName: "Al-Hashr", englishNameTranslation: "The Exile", numberOfAyahs: 24, revelationType: "Medinan" },
  { number: 60, name: "الممتحنة", englishName: "Al-Mumtahana", englishNameTranslation: "She That Is To Be Examined", numberOfAyahs: 13, revelationType: "Medinan" },
  { number: 61, name: "الصف", englishName: "As-Saff", englishNameTranslation: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan" },
  { number: 62, name: "الجمعة", englishName: "Al-Jumu'a", englishNameTranslation: "The Congregation", numberOfAyahs: 11, revelationType: "Medinan" },
  { number: 63, name: "المنافقون", englishName: "Al-Munaafiqoon", englishNameTranslation: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan" },
  { number: 64, name: "التغابن", englishName: "At-Taghaabun", englishNameTranslation: "The Mutual Disillusion", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 65, name: "الطلاق", englishName: "At-Talaaq", englishNameTranslation: "The Divorce", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 66, name: "التحريم", englishName: "At-Tahrim", englishNameTranslation: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 68, name: "القلم", englishName: "Al-Qalam", englishNameTranslation: "The Pen", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 69, name: "الحاقة", englishName: "Al-Haaqqa", englishNameTranslation: "The Reality", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 70, name: "المعارج", englishName: "Al-Ma'aarij", englishNameTranslation: "The Ascending Stairways", numberOfAyahs: 44, revelationType: "Meccan" },
  { number: 71, name: "نوح", englishName: "Nooh", englishNameTranslation: "Noah", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 72, name: "الجن", englishName: "Al-Jinn", englishNameTranslation: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 73, name: "المزمل", englishName: "Al-Muzzammil", englishNameTranslation: "The Enshrouded One", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 74, name: "المدثر", englishName: "Al-Muddathir", englishNameTranslation: "The Cloaked One", numberOfAyahs: 56, revelationType: "Meccan" },
  { number: 75, name: "القيامة", englishName: "Al-Qiyaama", englishNameTranslation: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 76, name: "الإنسان", englishName: "Al-Insaan", englishNameTranslation: "The Human", numberOfAyahs: 31, revelationType: "Medinan" },
  { number: 77, name: "المرسلات", englishName: "Al-Mursalaat", englishNameTranslation: "The Emissaries", numberOfAyahs: 50, revelationType: "Meccan" },
  { number: 78, name: "النبإ", englishName: "An-Naba", englishNameTranslation: "The Tidings", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 79, name: "النازعات", englishName: "An-Naazi'aat", englishNameTranslation: "Those Who Drag Forth", numberOfAyahs: 46, revelationType: "Meccan" },
  { number: 80, name: "عبس", englishName: "Abasa", englishNameTranslation: "He Frowned", numberOfAyahs: 42, revelationType: "Meccan" },
  { number: 81, name: "التكوير", englishName: "At-Takweer", englishNameTranslation: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan" },
  { number: 82, name: "الانفطار", englishName: "Al-Infitaar", englishNameTranslation: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", englishNameTranslation: "The Defrauding", numberOfAyahs: 36, revelationType: "Meccan" },
  { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaaq", englishNameTranslation: "The Splitting Open", numberOfAyahs: 25, revelationType: "Meccan" },
  { number: 85, name: "البروج", englishName: "Al-Burooj", englishNameTranslation: "The Mansions of the Stars", numberOfAyahs: 22, revelationType: "Meccan" },
  { number: 86, name: "الطارق", englishName: "At-Taariq", englishNameTranslation: "The Morning Star", numberOfAyahs: 17, revelationType: "Meccan" },
  { number: 87, name: "الأعلى", englishName: "Al-A'laa", englishNameTranslation: "The Most High", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 88, name: "الغاشية", englishName: "Al-Ghaashiya", englishNameTranslation: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan" },
  { number: 89, name: "الفجر", englishName: "Al-Fajr", englishNameTranslation: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 90, name: "البلد", englishName: "Al-Balad", englishNameTranslation: "The City", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 91, name: "الشمس", englishName: "Ash-Shams", englishNameTranslation: "The Sun", numberOfAyahs: 15, revelationType: "Meccan" },
  { number: 92, name: "الليل", englishName: "Al-Layl", englishNameTranslation: "The Night", numberOfAyahs: 21, revelationType: "Meccan" },
  { number: 93, name: "الضحى", englishName: "Ad-Duhaa", englishNameTranslation: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", englishNameTranslation: "The Relief", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 95, name: "التين", englishName: "At-Teen", englishNameTranslation: "The Fig", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 96, name: "العلق", englishName: "Al-Alaq", englishNameTranslation: "The Clot", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 97, name: "القدر", englishName: "Al-Qadr", englishNameTranslation: "The Power", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 98, name: "البينة", englishName: "Al-Bayyina", englishNameTranslation: "The Clear Proof", numberOfAyahs: 8, revelationType: "Medinan" },
  { number: 99, name: "الزلزلة", englishName: "Az-Zalzala", englishNameTranslation: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan" },
  { number: 100, name: "العاديات", englishName: "Al-Aadiyaat", englishNameTranslation: "The Courser", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 101, name: "القارعة", englishName: "Al-Qaari'a", englishNameTranslation: "The Calamity", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 102, name: "التكاثر", englishName: "At-Takaathur", englishNameTranslation: "The Rivalry in World Increase", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 103, name: "العصر", englishName: "Al-Asr", englishNameTranslation: "The Declining Day", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 104, name: "الهمزة", englishName: "Al-Humaza", englishNameTranslation: "The Traducer", numberOfAyahs: 9, revelationType: "Meccan" },
  { number: 105, name: "الفيل", englishName: "Al-Feel", englishNameTranslation: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 106, name: "قريش", englishName: "Quraysh", englishNameTranslation: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 107, name: "الماعون", englishName: "Al-Maa'oon", englishNameTranslation: "The Small Kindnesses", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", englishNameTranslation: "The Abundance", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 109, name: "الكافرون", englishName: "Al-Kaafiroon", englishNameTranslation: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan" },
  { number: 110, name: "النصر", englishName: "An-Nasr", englishNameTranslation: "The Divine Support", numberOfAyahs: 3, revelationType: "Medinan" },
  { number: 111, name: "المسد", englishName: "Al-Masad", englishNameTranslation: "The Palm Fibre", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlaas", englishNameTranslation: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 114, name: "الناس", englishName: "An-Naas", englishNameTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan" }
];

export const POPULAR_SURAHS_SAMPLE: Record<number, Ayah[]> = {
  1: [
    { numberInSurah: 1, textArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", textEnglish: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", transliteration: "Bismillaahir Rahmaanir Raheem" },
    { numberInSurah: 2, textArabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", textEnglish: "[All] praise is [due] to Allah, Lord of the worlds -", transliteration: "Alhamdu lillaahi Rabbil 'aalameen" },
    { numberInSurah: 3, textArabic: "الرَّحْمَٰنِ الرَّحِيمِ", textEnglish: "The Entirely Merciful, the Especially Merciful,", transliteration: "Ar-Rahmaanir-Raheem" },
    { numberInSurah: 4, textArabic: "مَالِكِ يَوْمِ الدِّينِ", textEnglish: "Sovereign of the Day of Recompense.", transliteration: "Maaliki Yawmid-Deen" },
    { numberInSurah: 5, textArabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", textEnglish: "It is You we worship and You we ask for help.", transliteration: "Iyyaaka na'budu wa lyyaaka nasta'een" },
    { numberInSurah: 6, textArabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", textEnglish: "Guide us to the straight path -", transliteration: "Ihdinas-Siraatal-Mustaqeem" },
    { numberInSurah: 7, textArabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", textEnglish: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.", transliteration: "Siraatal-lazeena an'amta 'alaihim ghayril-maghdoobi 'alaihim wa lad-daaalleen" }
  ],
  112: [
    { numberInSurah: 1, textArabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", textEnglish: "Say, 'He is Allah, [who is] One,", transliteration: "Qul Huwal-Laahu Ahad" },
    { numberInSurah: 2, textArabic: "اللَّهُ الصَّمَدُ", textEnglish: "Allah, the Eternal Refuge.", transliteration: "Allahus-Samad" },
    { numberInSurah: 3, textArabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", textEnglish: "He neither begets nor is born,", transliteration: "Lam yalid wa lam yoolad" },
    { numberInSurah: 4, textArabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", textEnglish: "Nor is there to Him any equivalent.'", transliteration: "Wa lam yakul-lahu kufuwan ahad" }
  ],
  113: [
    { numberInSurah: 1, textArabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", textEnglish: "Say, 'I seek refuge in the Lord of daybreak", transliteration: "Qul a'oozu bi rabbil-falaq" },
    { numberInSurah: 2, textArabic: "مِن شَرِّ مَا خَلَقَ", textEnglish: "From the evil of that which He created", transliteration: "Min sharri maa khalaq" },
    { numberInSurah: 3, textArabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", textEnglish: "And from the evil of darkness when it settles", transliteration: "Wa min sharri ghaasiqin izaa waqab" },
    { numberInSurah: 4, textArabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", textEnglish: "And from the evil of the blowers in knots", transliteration: "Wa min sharrin-naffaasaati fil 'uqad" },
    { numberInSurah: 5, textArabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", textEnglish: "And from the evil of an envier when he envies.'", transliteration: "Wa min sharri haasidin izaa hasad" }
  ],
  114: [
    { numberInSurah: 1, textArabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", textEnglish: "Say, 'I seek refuge in the Lord of mankind,", transliteration: "Qul a'oozu bi rabbin-naas" },
    { numberInSurah: 2, textArabic: "مَلِكِ النَّاسِ", textEnglish: "The Sovereign of mankind,", transliteration: "Malikin-naas" },
    { numberInSurah: 3, textArabic: "إِلَٰهِ النَّاسِ", textEnglish: "The God of mankind,", transliteration: "Ilaahin-naas" },
    { numberInSurah: 4, textArabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", textEnglish: "From the evil of the retreating whisperer -", transliteration: "Min sharril waswaasil khannaas" },
    { numberInSurah: 5, textArabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", textEnglish: "Who whispers [evil] into the breasts of mankind -", transliteration: "Allazee yuwaswisu fee sudoorin naas" },
    { numberInSurah: 6, textArabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", textEnglish: "From among the jinn and mankind.'", transliteration: "Minal jinnati wannaas" }
  ],
  103: [
    { numberInSurah: 1, textArabic: "وَالْعَصْرِ", textEnglish: "By time,", transliteration: "Wal 'asr" },
    { numberInSurah: 2, textArabic: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", textEnglish: "Indeed, mankind is in loss,", transliteration: "Innal insaana lafee khusr" },
    { numberInSurah: 3, textArabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", textEnglish: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.", transliteration: "Illal-lazeena aamanoo wa 'amilus-saalihaati wa tawaasaw bilhaqqi wa tawaasaw bissabr" }
  ],
  108: [
    { numberInSurah: 1, textArabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", textEnglish: "Indeed, We have granted you, [O Muhammad], al-Kawthar.", transliteration: "Innaaa a'tainaakal kawthar" },
    { numberInSurah: 2, textArabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", textEnglish: "So pray to your Lord and sacrifice [to Him alone].", transliteration: "Fasalli li rabbika wanhar" },
    { numberInSurah: 3, textArabic: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", textEnglish: "Indeed, your enemy is the one cut off.", transliteration: "Inna shaani'aka huwal abtar" }
  ],
  94: [
    { numberInSurah: 1, textArabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", textEnglish: "Did We not expand for you, [O Muhammad], your breast?", transliteration: "Alam nashrah laka sadrak" },
    { numberInSurah: 2, textArabic: "وَوَضَعْنَا عَنكَ وِزْرَكَ", textEnglish: "And We removed from you your burden", transliteration: "Wa wada'naa 'anka wizrak" },
    { numberInSurah: 3, textArabic: "الَّذِي أَنقَضَ ظَهْرَكَ", textEnglish: "Which had weighed upon your back", transliteration: "Allazeee anqada zahrak" },
    { numberInSurah: 4, textArabic: "وَرَفَعْنَا لَكَ ذِكْرَكَ", textEnglish: "And raised high for you your repute.", transliteration: "Wa rafa'naa laka zikrak" },
    { numberInSurah: 5, textArabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", textEnglish: "For indeed, with hardship [will be] ease.", transliteration: "Fa inna ma'al 'usri yusra" },
    { numberInSurah: 6, textArabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", textEnglish: "Indeed, with hardship [will be] ease.", transliteration: "Inna ma'al 'usri yusra" },
    { numberInSurah: 7, textArabic: "فَإِذَا فَرَغْتَ فَانصَبْ", textEnglish: "So when you have finished [your duties], then stand up [for worship].", transliteration: "Fa izaa faraghta fansab" },
    { numberInSurah: 8, textArabic: "وَإِلَىٰ رَبِّكَ فَارْغَب", textEnglish: "And to your Lord direct [your] longing.", transliteration: "Wa ilaa rabbika farghab" }
  ],
  67: [
    { numberInSurah: 1, textArabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", textEnglish: "Blessed is He in whose hand is dominion, and He is over all things competent -", transliteration: "Tabaarakal lazee biyadihil mulku wa huwa 'alaa kulli shayin qadeer" },
    { numberInSurah: 2, textArabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", textEnglish: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -", transliteration: "Allazee khalaqal mawta walhayaata liyabluwakum ayyukum ahsanu 'amalaa; wa huwal 'azeezul ghafoor" },
    { numberInSurah: 3, textArabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ", textEnglish: "[And] who created seven heavens in layers. You see not in the creation of the Most Merciful any inconsistency.", transliteration: "Allazee khalaqa sab'a samaawaatin tibaaqam maa taraa fee khalqir rahmaani min tafaawut" }
  ]
};

export interface QuranReciter {
  id: string;
  name: string;
  arabicName: string;
  folder: string;
  style: 'Murattal' | 'Mujawwad';
  origin: string;
  description: string;
}

export const QURAN_RECITERS: QuranReciter[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    folder: 'Alafasy_128kbps',
    style: 'Murattal',
    origin: 'Kuwait',
    description: 'Beloved melodious, crystal-clear recitation'
  },
  {
    id: 'abdulbasit-murattal',
    name: 'Abdul Basit Abdul Samad (Murattal)',
    arabicName: 'عبد الباسط عبد الصمد - مرتل',
    folder: 'Abdul_Basit_Murattal_64kbps',
    style: 'Murattal',
    origin: 'Egypt',
    description: 'The Golden Throat, timeless classical Egyptian master'
  },
  {
    id: 'abdulbasit-mujawwad',
    name: 'Abdul Basit Abdul Samad (Mujawwad)',
    arabicName: 'عبد الباسط عبد الصمد - مجود',
    folder: 'Abdul_Basit_Mujawwad_128kbps',
    style: 'Mujawwad',
    origin: 'Egypt',
    description: 'Slow, soulful maqamat with breathtaking breath control'
  },
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    folder: 'Husary_128kbps',
    style: 'Murattal',
    origin: 'Egypt',
    description: 'The Master Teacher of Tajweed and perfect articulation'
  },
  {
    id: 'minshawi-murattal',
    name: 'Mohamed Siddiq El-Minshawi (Murattal)',
    arabicName: 'محمد صديق المنشاوي - مرتل',
    folder: 'Minshawy_Murattal_128kbps',
    style: 'Murattal',
    origin: 'Egypt',
    description: 'The Weeping Voice, profoundly touching and emotional'
  },
  {
    id: 'minshawi-mujawwad',
    name: 'Mohamed Siddiq El-Minshawi (Mujawwad)',
    arabicName: 'محمد صديق المنشاوي - مجود',
    folder: 'Minshawy_Mujawwad_192kbps',
    style: 'Mujawwad',
    origin: 'Egypt',
    description: 'Majestic, slow, heart-melting Quranic recital'
  },
  {
    id: 'muaiqly',
    name: 'Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    folder: 'Maher_AlMuaiqly_64kbps',
    style: 'Murattal',
    origin: 'Masjid al-Haram, Makkah',
    description: 'Distinguished Imam of the Grand Mosque in Makkah'
  },
  {
    id: 'sudais',
    name: 'Abdur-Rahman As-Sudais',
    arabicName: 'عبد الرحمن السديس',
    folder: 'Abdurrahmaan_As-Sudais_192kbps',
    style: 'Murattal',
    origin: 'Masjid al-Haram, Makkah',
    description: 'Chief Imam of the Grand Mosque in Makkah, moving & spirited'
  },
  {
    id: 'shuraim',
    name: 'Saud Ash-Shuraim',
    arabicName: 'سعود الشريم',
    folder: 'Saood_ash-Shuraym_128kbps',
    style: 'Murattal',
    origin: 'Masjid al-Haram, Makkah',
    description: 'Legendary former Imam of Masjid al-Haram, rich & rhythmic'
  },
  {
    id: 'ghamdi',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    folder: 'Ghamadi_40kbps',
    style: 'Murattal',
    origin: 'Saudi Arabia',
    description: 'Warm, gentle, and rhythmic flowing recitation'
  },
  {
    id: 'shatri',
    name: 'Abu Bakr Al-Shatri',
    arabicName: 'أبو بكر الشاطري',
    folder: 'Abu_Bakr_Ash-Shaatree_128kbps',
    style: 'Murattal',
    origin: 'Saudi Arabia / Yemen',
    description: 'Deep, powerful baritone resonance and deliberate pace'
  },
  {
    id: 'dussary',
    name: 'Yasser Ad-Dussary',
    arabicName: 'ياسر الدوسري',
    folder: 'Yasser_Ad-Dussary_128kbps',
    style: 'Murattal',
    origin: 'Masjid al-Haram, Makkah',
    description: 'Imam of Masjid al-Haram, stirring and soulful emotional depth'
  },
  {
    id: 'qatami',
    name: 'Nasser Al-Qatami',
    arabicName: 'ناصر القطامي',
    folder: 'Nasser_Alqatami_128kbps',
    style: 'Murattal',
    origin: 'Riyadh, Saudi Arabia',
    description: 'Tender, calm, and deeply meditative recitation'
  },
  {
    id: 'jaber',
    name: 'Ali Jaber',
    arabicName: 'علي جابر',
    folder: 'Ali_Jaber_64kbps',
    style: 'Murattal',
    origin: 'Masjid al-Haram, Makkah',
    description: 'Late beloved Imam of Masjid al-Haram, world-renowned voice'
  }
];

// API helper to fetch verses if needed
export async function fetchSurahVerses(surahNumber: number): Promise<Ayah[]> {
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`);
    if (!res.ok) throw new Error("Failed to fetch from Quran API");
    const data = await res.json();
    const arabicAyahs = data.data[0].ayahs;
    const englishAyahs = data.data[1].ayahs;

    return arabicAyahs.map((a: any, index: number) => ({
      numberInSurah: a.numberInSurah,
      textArabic: a.text,
      textEnglish: englishAyahs[index]?.text || "",
      transliteration: ""
    }));
  } catch (error) {
    if (POPULAR_SURAHS_SAMPLE[surahNumber]) {
      return POPULAR_SURAHS_SAMPLE[surahNumber];
    }
    // Return sample placeholder if offline
    return [
      {
        numberInSurah: 1,
        textArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        textEnglish: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        transliteration: "Bismillaahir Rahmaanir Raheem"
      }
    ];
  }
}
