import React, { useState } from 'react';
import { getHijriDate } from '../utils/prayerTimes';
import { 
  Calendar as CalendarIcon, 
  Moon, 
  Sparkles, 
  ArrowLeftRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Info,
  Clock
} from 'lucide-react';

interface IslamicEvent {
  title: string;
  hijriDate: string;
  gregorianApprox: string;
  significance: string;
  recommendedDeeds: string[];
}

const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    title: 'Islamic New Year (Ra\'s al-Sanah al-Hijriyyah)',
    hijriDate: '1 Muharram',
    gregorianApprox: 'Early July / Mid-Year',
    significance: 'Commemorates the Hijrah (emigration) of Prophet Muhammad (ﷺ) from Makkah to Madinah in 622 CE, initiating the Islamic lunar calendar.',
    recommendedDeeds: ['Reflecting on personal spiritual goals', 'Voluntary fasting in Muharram', 'Repentance and renewal of intentions']
  },
  {
    title: 'Day of Ashura',
    hijriDate: '10 Muharram',
    gregorianApprox: 'July',
    significance: 'The historic day Allah delivered Prophet Musa (AS) and the Children of Israel from Pharaoh by parting the sea. Also solemnized for the martyrdom of Imam Husayn (RA) at Karbala.',
    recommendedDeeds: ['Fasting on the 9th and 10th of Muharram (or 10th and 11th)', 'Generosity to family and the needy', 'Recitation of Quran and du\'a']
  },
  {
    title: 'Mawlid an-Nabi (Prophet\'s Birthday / Seerah Commemoration)',
    hijriDate: '12 Rabi\' al-Awwal',
    gregorianApprox: 'September',
    significance: 'Commemoration of the birth of the final Messenger of Allah, Muhammad (ﷺ), sent as a Mercy to all the worlds.',
    recommendedDeeds: ['Sending abundant Salawat (blessings) upon the Prophet', 'Studying the noble Seerah', 'Feeding the poor and spreading peace']
  },
  {
    title: 'Al-Isra\' wal-Mi\'raj (The Night Journey & Ascension)',
    hijriDate: '27 Rajab',
    gregorianApprox: 'February',
    significance: 'The miraculous night journey from the Sacred Mosque in Makkah to Al-Aqsa in Jerusalem, and the ascension through the seven heavens where the 5 daily prayers were instituted.',
    recommendedDeeds: ['Reflecting on the sanctity of Salah', 'Supplicating for Al-Quds and the Ummah', 'Night voluntary prayers (Qiyam)']
  },
  {
    title: 'Mid-Sha\'ban (Laylat al-Bara\'ah)',
    hijriDate: '15 Sha\'ban',
    gregorianApprox: 'February / March',
    significance: 'A night of heightened divine mercy, forgiveness, and preparation for the arrival of the blessed month of Ramadan.',
    recommendedDeeds: ['Seeking Istighfar (forgiveness) from sins', 'Clearing grudges with fellow believers', 'Voluntary fasting the White Days']
  },
  {
    title: 'First Day of Ramadan',
    hijriDate: '1 Ramadan',
    gregorianApprox: 'March',
    significance: 'Commencement of the holy month of fasting, during which the Quran was first revealed to humanity.',
    recommendedDeeds: ['Daily fasting from dawn until sunset', 'Nightly Taraweeh prayers', 'Completing the recitation of the Quran', 'Increased charity']
  },
  {
    title: 'Laylat al-Qadr (The Night of Power & Decree)',
    hijriDate: 'Last 10 odd nights of Ramadan (21st, 23rd, 25th, 27th, 29th)',
    gregorianApprox: 'March / April',
    significance: 'Better than a thousand months (Surah Al-Qadr). The night when angels descend and divine decrees for the year are written.',
    recommendedDeeds: ['Itikaf in the mosque', 'Dua: Allahumma innaka \'afuwwun tuhibbul \'afwa fa\'fu \'anni', 'Night-long Qiyam and sincere repentance']
  },
  {
    title: 'Eid al-Fitr (Festival of Breaking the Fast)',
    hijriDate: '1 Shawwal',
    gregorianApprox: 'April',
    significance: 'Celebration of gratitude marking the completion of the blessed month of Ramadan.',
    recommendedDeeds: ['Paying Zakat al-Fitr before the Eid prayer', 'Attending the Eid congregational prayer & Takbirat', 'Visiting family and sharing gifts']
  },
  {
    title: 'Day of Arafah',
    hijriDate: '9 Dhu al-Hijjah',
    gregorianApprox: 'June',
    significance: 'The pinnacle of the Hajj pilgrimage where pilgrims stand in prayer on the plains of Arafah. The day Allah forgives the greatest number of souls.',
    recommendedDeeds: ['Fasting for non-pilgrims (expiates sins of previous and upcoming year)', 'Abundant Takbir, Tahlil, and sincere du\'a']
  },
  {
    title: 'Eid al-Adha (Festival of the Sacrifice)',
    hijriDate: '10 - 13 Dhu al-Hijjah (Days of Tashreeq)',
    gregorianApprox: 'June',
    significance: 'Commemorates the profound devotion and willingness of Prophet Ibrahim (AS) to sacrifice his son Ismail in obedience to Allah.',
    recommendedDeeds: ['Performing the Qurbani / Udhiyah sacrifice', 'Attending Eid prayer', 'Reciting Takbirat al-Tashreeq after each prayer']
  }
];

export const CalendarPage: React.FC = () => {
  const today = new Date();
  const currentHijri = getHijriDate(today);

  // Converter state
  const [convGregDate, setConvGregDate] = useState(today.toISOString().split('T')[0]);
  const [convertedHijriResult, setConvertedHijriResult] = useState<string>(currentHijri.formatted);

  const handleConvertGregToHijri = (val: string) => {
    setConvGregDate(val);
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const h = getHijriDate(d);
      setConvertedHijriResult(h.formatted);
    }
  };

  const islamicMonths = [
    { num: 1, name: 'Muharram', ar: 'مُحَرَّم', sacred: true },
    { num: 2, name: 'Safar', ar: 'صَفَر', sacred: false },
    { num: 3, name: 'Rabi\' al-Awwal', ar: 'رَبِيع الأَوَّل', sacred: false },
    { num: 4, name: 'Rabi\' ath-Thani', ar: 'رَبِيع الآخِر', sacred: false },
    { num: 5, name: 'Jumada al-Ula', ar: 'جُمَادَى الأُولَى', sacred: false },
    { num: 6, name: 'Jumada al-Akhirah', ar: 'جُمَادَى الآخِرَة', sacred: false },
    { num: 7, name: 'Rajab', ar: 'رَجَب', sacred: true },
    { num: 8, name: 'Sha\'ban', ar: 'شَعْبَان', sacred: false },
    { num: 9, name: 'Ramadan', ar: 'رَمَضَان', sacred: false },
    { num: 10, name: 'Shawwal', ar: 'شَوَّال', sacred: false },
    { num: 11, name: 'Dhu al-Qi\'dah', ar: 'ذُو القَعْدَة', sacred: true },
    { num: 12, name: 'Dhu al-Hijjah', ar: 'ذُو الحِجَّة', sacred: true }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>Islamic Hijri Calendar (التقويم الهجري)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Sacred Dates, Months & Conversion
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Track lunar months, observe holy events, and convert between Gregorian and Hijri dates.
          </p>
        </div>

        {/* Current Date Badge */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-right">
          <div className="text-[11px] text-emerald-800 font-semibold uppercase">Today in Islamic Calendar</div>
          <div className="text-lg font-bold text-emerald-950">{currentHijri.formatted}</div>
          <div className="text-xs text-stone-500">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      {/* Date Converter Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-amber-300 text-xs font-semibold">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Gregorian to Hijri Date Converter</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Convert Any Date Accurately
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              id="greg-date-picker"
              type="date"
              value={convGregDate}
              onChange={(e) => handleConvertGregToHijri(e.target.value)}
              className="px-4 py-2.5 bg-white text-stone-900 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-400 w-full sm:w-auto"
            />
            <div className="text-emerald-200 font-bold hidden sm:block">➜</div>
            <div className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800/80 rounded-xl border border-emerald-700 text-amber-300 font-bold text-sm text-center">
              {convertedHijriResult}
            </div>
          </div>
        </div>
      </div>

      {/* 12 Months of the Islamic Calendar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">
            The 12 Lunar Months & Sacred Months
          </h2>
          <span className="text-xs text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            ★ Indicates Sacred Month (Al-Ashhur Al-Hurum)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {islamicMonths.map((m) => {
            const isCurrent = m.num - 1 === currentHijri.monthIndex;
            return (
              <div
                key={m.num}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-800 text-white border-emerald-700 shadow-md ring-2 ring-amber-400/60'
                    : 'bg-white border-stone-200 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-amber-300' : 'text-stone-400'}`}>
                    #{m.num}
                  </span>
                  {m.sacred && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isCurrent ? 'bg-amber-400 text-emerald-950' : 'bg-amber-100 text-amber-800'}`}>
                      Sacred
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm">{m.name}</div>
                <div className={`font-arabic text-base mt-1 ${isCurrent ? 'text-amber-200' : 'text-stone-600'}`}>
                  {m.ar}
                </div>
                {isCurrent && (
                  <div className="text-[10px] font-bold text-amber-300 mt-2 uppercase tracking-wider">
                    ● Current Month
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Major Islamic Events Catalog */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-stone-900">
          Major Islamic Observances & Sacred Nights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ISLAMIC_EVENTS.map((event) => (
            <div
              key={event.title}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3 hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {event.hijriDate}
                    </span>
                    <span className="text-xs text-stone-500">
                      Approx: {event.gregorianApprox}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {event.significance}
              </p>

              <div className="pt-3 border-t border-stone-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 mb-1.5">
                  Recommended Worship:
                </div>
                <ul className="space-y-1">
                  {event.recommendedDeeds.map((deed, i) => (
                    <li key={i} className="text-xs text-stone-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                      <span>{deed}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
