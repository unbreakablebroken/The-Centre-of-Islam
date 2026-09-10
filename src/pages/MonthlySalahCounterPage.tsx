import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  CalendarCheck, 
  Check, 
  Flame, 
  TrendingUp, 
  Award, 
  RotateCcw, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  CloudCheck
} from 'lucide-react';

interface DaySalah {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export const MonthlySalahCounterPage: React.FC = () => {
  const { user } = useAuth();
  
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
  const [isSynced, setIsSynced] = useState(false);

  const monthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  // Records state: Day 1 to daysInMonth mapped to DaySalah
  const [records, setRecords] = useState<Record<number, DaySalah>>(() => {
    try {
      const saved = localStorage.getItem(`coi_salah_${monthKey}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<number, DaySalah> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      initial[d] = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
    }
    return initial;
  });

  // Load from Firestore / LocalStorage whenever monthKey or user changes
  useEffect(() => {
    let active = true;

    // Load local storage first
    try {
      const saved = localStorage.getItem(`coi_salah_${monthKey}`);
      if (saved && active) {
        setRecords(JSON.parse(saved));
      } else {
        const initial: Record<number, DaySalah> = {};
        for (let d = 1; d <= daysInMonth; d++) {
          initial[d] = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
        }
        if (active) setRecords(initial);
      }
    } catch {}

    // If logged in, fetch from Firestore
    if (user) {
      const docRef = doc(db, 'users', user.uid, 'salahMonthly', monthKey);
      getDoc(docRef).then((snap) => {
        if (snap.exists() && active) {
          const data = snap.data();
          if (data.records) {
            setRecords(data.records);
            localStorage.setItem(`coi_salah_${monthKey}`, JSON.stringify(data.records));
            setIsSynced(true);
          }
        }
      }).catch(err => {
        console.warn('Firestore salah sync error:', err);
      });
    }

    return () => {
      active = false;
    };
  }, [monthKey, user, daysInMonth]);

  // Persist helper
  const saveRecords = (updated: Record<number, DaySalah>) => {
    setRecords(updated);
    try {
      localStorage.setItem(`coi_salah_${monthKey}`, JSON.stringify(updated));
    } catch {}

    if (user) {
      setIsSynced(false);
      const docRef = doc(db, 'users', user.uid, 'salahMonthly', monthKey);
      setDoc(docRef, { records: updated, updatedAt: new Date().toISOString() }, { merge: true })
        .then(() => setIsSynced(true))
        .catch((err) => console.warn('Sync error:', err));
    }
  };

  const toggleSalah = (day: number, prayer: keyof DaySalah) => {
    const currentDay = records[day] || { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
    const updated = {
      ...records,
      [day]: {
        ...currentDay,
        [prayer]: !currentDay[prayer]
      }
    };
    saveRecords(updated);
  };

  const markAllToday = () => {
    const todayNum = now.getDate();
    const updated = {
      ...records,
      [todayNum]: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true }
    };
    saveRecords(updated);
  };

  // Stats Calculations
  let totalPossible = daysInMonth * 5;
  let totalCompleted = 0;
  let prayerCounts = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
  let perfectDays = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const r = records[d];
    if (r) {
      if (r.fajr) { totalCompleted++; prayerCounts.fajr++; }
      if (r.dhuhr) { totalCompleted++; prayerCounts.dhuhr++; }
      if (r.asr) { totalCompleted++; prayerCounts.asr++; }
      if (r.maghrib) { totalCompleted++; prayerCounts.maghrib++; }
      if (r.isha) { totalCompleted++; prayerCounts.isha++; }

      if (r.fajr && r.dhuhr && r.asr && r.maghrib && r.isha) {
        perfectDays++;
      }
    }
  }

  const completionPercent = Math.round((totalCompleted / totalPossible) * 100);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>Spiritual Habit Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Salah Per Month Counter
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Track all five daily prayers across {monthNames[selectedMonth]} {selectedYear}.
          </p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900"
          >
            {monthNames.map((name, i) => (
              <option key={i} value={i}>{name}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl border border-stone-300 transition-colors"
            title="Print Monthly Scorecard"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Analytics Hero */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-1">
          <div className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">
            Total Monthly Progress
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-amber-300">
            {totalCompleted} <span className="text-base text-emerald-200 font-normal">/ {totalPossible}</span>
          </div>
          <div className="text-xs text-emerald-300/80">
            {completionPercent}% of monthly prayers offered
          </div>
          {/* Progress bar */}
          <div className="w-full bg-emerald-950/80 h-2 rounded-full overflow-hidden mt-2 border border-emerald-800">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-emerald-200 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Perfect Days (5/5)</span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-white">
            {perfectDays} <span className="text-base text-emerald-200 font-normal">days</span>
          </div>
          <div className="text-xs text-emerald-300/80">
            Full 5 prayers accomplished
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">
            Fajr Completion
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-indigo-300">
            {Math.round((prayerCounts.fajr / daysInMonth) * 100)}%
          </div>
          <div className="text-xs text-emerald-300/80">
            {prayerCounts.fajr} of {daysInMonth} Fajr prayers
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-2">
          <button
            id="mark-today-all-prayers-btn"
            onClick={markAllToday}
            className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark All 5 for Today ({now.getDate()} {monthNames[now.getMonth()]})</span>
          </button>
          {user ? (
            <div className="text-[11px] text-emerald-300 text-center flex items-center justify-center gap-1">
              <span>● Cloud synced to your account</span>
            </div>
          ) : (
            <div className="text-[11px] text-stone-300 text-center">
              Progress saved locally to browser
            </div>
          )}
        </div>
      </div>

      {/* Monthly Interactive Calendar Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 printable-area">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <h2 className="text-xl font-bold text-stone-900">
            Monthly Log: {monthNames[selectedMonth]} {selectedYear}
          </h2>
          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-700 rounded-sm inline-block"></span> Prayed</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-stone-100 border border-stone-300 rounded-sm inline-block"></span> Pending</span>
          </div>
        </div>

        {/* Prayers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-600 bg-stone-50/80">
                <th className="py-3 px-3 font-bold text-stone-800">Day</th>
                <th className="py-3 px-3 text-center font-bold">Fajr (فجر)</th>
                <th className="py-3 px-3 text-center font-bold">Dhuhr (ظهر)</th>
                <th className="py-3 px-3 text-center font-bold">Asr (عصر)</th>
                <th className="py-3 px-3 text-center font-bold">Maghrib (مغرب)</th>
                <th className="py-3 px-3 text-center font-bold">Isha (عشاء)</th>
                <th className="py-3 px-3 text-right font-bold">Daily Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const daySalah = records[day] || { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
                const daySum = (daySalah.fajr ? 1 : 0) + (daySalah.dhuhr ? 1 : 0) + (daySalah.asr ? 1 : 0) + (daySalah.maghrib ? 1 : 0) + (daySalah.isha ? 1 : 0);
                const isToday = day === now.getDate() && selectedMonth === now.getMonth() && selectedYear === now.getFullYear();

                return (
                  <tr
                    key={day}
                    className={`transition-colors ${
                      isToday ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-stone-50/50'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900 w-6">
                          {day}
                        </span>
                        {isToday && (
                          <span className="text-[10px] bg-emerald-800 text-white px-1.5 py-0.2 rounded font-bold">
                            Today
                          </span>
                        )}
                      </div>
                    </td>

                    {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((p) => {
                      const checked = daySalah[p];
                      return (
                        <td key={p} className="py-2 px-3 text-center">
                          <button
                            id={`salah-btn-${day}-${p}`}
                            onClick={() => toggleSalah(day, p)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-all flex items-center justify-center mx-auto border ${
                              checked
                                ? 'bg-emerald-800 text-amber-300 border-emerald-900 shadow-2xs ring-1 ring-emerald-700'
                                : 'bg-stone-50 text-stone-300 border-stone-200 hover:border-emerald-400 hover:text-emerald-700'
                            }`}
                            title={`Toggle ${p} on day ${day}`}
                          >
                            <Check className={`w-4 h-4 ${checked ? 'opacity-100 font-bold' : 'opacity-20'}`} />
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-2 px-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                        daySum === 5
                          ? 'bg-emerald-100 text-emerald-900'
                          : daySum > 0
                          ? 'bg-amber-50 text-amber-900'
                          : 'text-stone-400'
                      }`}>
                        {daySum}/5
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Printable Footer Wisdom */}
        <div className="pt-6 border-t border-stone-200 text-center space-y-1">
          <p className="font-arabic text-lg text-emerald-950">
            إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا
          </p>
          <p className="text-xs text-stone-600 italic">
            "Indeed, prayer has been decreed upon the believers a decree of specified times." — Surah An-Nisa (4:103)
          </p>
        </div>
      </div>
    </div>
  );
};
