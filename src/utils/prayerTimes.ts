// Astronomical prayer times calculation utility
export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: {
    name: string;
    time: string;
    remainingMinutes: number;
    remainingSeconds: number;
  };
}

export interface CalculationMethod {
  id: string;
  name: string;
  fajrAngle: number;
  ishaAngle: number;
}

export const CALCULATION_METHODS: CalculationMethod[] = [
  { id: 'MWL', name: 'Muslim World League (Fajr 18°, Isha 17°)', fajrAngle: 18, ishaAngle: 17 },
  { id: 'ISNA', name: 'Islamic Society of North America (ISNA 15°)', fajrAngle: 15, ishaAngle: 15 },
  { id: 'EGYPT', name: 'Egyptian General Authority of Survey (19.5°, 17.5°)', fajrAngle: 19.5, ishaAngle: 17.5 },
  { id: 'MAKKAH', name: 'Umm al-Qura University, Makkah (18.5°, 90 min)', fajrAngle: 18.5, ishaAngle: 19 },
  { id: 'KARACHI', name: 'University of Islamic Sciences, Karachi (18°, 18°)', fajrAngle: 18, ishaAngle: 18 }
];

export const PRESET_CITIES = [
  { name: 'Makkah, Saudi Arabia', lat: 21.4225, lng: 39.8262, timezone: 3 },
  { name: 'Madinah, Saudi Arabia', lat: 24.5247, lng: 39.5692, timezone: 3 },
  { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278, timezone: 1 },
  { name: 'New York, United States', lat: 40.7128, lng: -74.0060, timezone: -4 },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, timezone: 4 },
  { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, timezone: 3 },
  { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784, timezone: 3 },
  { name: 'Karachi, Pakistan', lat: 24.8607, lng: 67.0011, timezone: 5 },
  { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, timezone: 5.5 },
  { name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869, timezone: 8 },
  { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, timezone: -4 },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, timezone: 10 }
];

// Helper trig functions
const dtr = (d: number) => (d * Math.PI) / 180.0;
const rtd = (r: number) => (r * 180.0) / Math.PI;
const sin = (d: number) => Math.sin(dtr(d));
const cos = (d: number) => Math.cos(dtr(d));
const tan = (d: number) => Math.tan(dtr(d));
const asin = (x: number) => rtd(Math.asin(x));
const acos = (x: number) => rtd(Math.acos(x));
const atan = (x: number) => rtd(Math.atan(x));
const fixHour = (a: number) => {
  a = a - 24.0 * Math.floor(a / 24.0);
  return a < 0 ? a + 24.0 : a;
};

// Calculate Solar Position
function sunPosition(jd: number) {
  const D = jd - 2451545.0;
  const g = fixHour(357.529 + 0.98560028 * D);
  const q = fixHour(280.459 + 0.98564736 * D);
  const L = fixHour(q + 1.915 * sin(g) + 0.02 * sin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const d = asin(sin(e) * sin(L));
  let RA = atan(cos(e) * sin(L) / cos(L)) / 15.0;
  if (cos(L) < 0) RA += 12;
  else if (sin(L) < 0) RA += 24;
  const EqT = q / 15.0 - fixHour(RA);
  return { declination: d, equationOfTime: EqT };
}

function getJulianDate(date: Date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();
  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5;
}

export function computePrayerTimes(
  date: Date = new Date(),
  latitude: number = 21.4225,
  longitude: number = 39.8262,
  timezoneOffsetHours: number = 3,
  methodId: string = 'MWL',
  asrJuristic: 'Standard' | 'Hanafi' = 'Standard'
): PrayerTimes {
  const method = CALCULATION_METHODS.find(m => m.id === methodId) || CALCULATION_METHODS[0];
  const jd = getJulianDate(date);
  const { declination, equationOfTime } = sunPosition(jd);

  // Solar noon
  const noon = fixHour(12 + timezoneOffsetHours - longitude / 15.0 - equationOfTime);

  // Fajr
  const fajrHourAngle = (1 / 15.0) * acos((-sin(method.fajrAngle) - sin(latitude) * sin(declination)) / (cos(latitude) * cos(declination)));
  const fajr = fixHour(noon - fajrHourAngle);

  // Sunrise
  const sunriseHourAngle = (1 / 15.0) * acos((-sin(0.833) - sin(latitude) * sin(declination)) / (cos(latitude) * cos(declination)));
  const sunrise = fixHour(noon - sunriseHourAngle);

  // Asr
  const asrFactor = asrJuristic === 'Hanafi' ? 2 : 1;
  const asrAngle = -atan(1 / (asrFactor + tan(Math.abs(latitude - declination))));
  const asrHourAngle = (1 / 15.0) * acos((sin(asrAngle) - sin(latitude) * sin(declination)) / (cos(latitude) * cos(declination)));
  const asr = fixHour(noon + asrHourAngle);

  // Maghrib (Sunset)
  const maghribHourAngle = (1 / 15.0) * acos((-sin(0.833) - sin(latitude) * sin(declination)) / (cos(latitude) * cos(declination)));
  const maghrib = fixHour(noon + maghribHourAngle);

  // Isha
  const ishaHourAngle = (1 / 15.0) * acos((-sin(method.ishaAngle) - sin(latitude) * sin(declination)) / (cos(latitude) * cos(declination)));
  const isha = fixHour(noon + ishaHourAngle);

  const formatHour = (h: number) => {
    if (isNaN(h)) return '12:00';
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const prayers = [
    { name: 'Fajr', dec: fajr, formatted: formatHour(fajr) },
    { name: 'Sunrise', dec: sunrise, formatted: formatHour(sunrise) },
    { name: 'Dhuhr', dec: noon, formatted: formatHour(noon) },
    { name: 'Asr', dec: asr, formatted: formatHour(asr) },
    { name: 'Maghrib', dec: maghrib, formatted: formatHour(maghrib) },
    { name: 'Isha', dec: isha, formatted: formatHour(isha) }
  ];

  // Current time in local terms
  const now = new Date();
  const currentDec = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

  let next = prayers.find(p => p.dec > currentDec && p.name !== 'Sunrise');
  if (!next) {
    next = prayers[0]; // Next day's Fajr
  }

  let diffHours = next.dec - currentDec;
  if (diffHours < 0) diffHours += 24;

  const totalRemainingSeconds = Math.floor(diffHours * 3600);
  const remainingMinutes = Math.floor(totalRemainingSeconds / 60);
  const remainingSeconds = totalRemainingSeconds % 60;

  return {
    fajr: formatHour(fajr),
    sunrise: formatHour(sunrise),
    dhuhr: formatHour(noon),
    asr: formatHour(asr),
    maghrib: formatHour(maghrib),
    isha: formatHour(isha),
    nextPrayer: {
      name: next.name,
      time: next.formatted,
      remainingMinutes,
      remainingSeconds
    }
  };
}

// Calculate Qibla angle from coordinates (bearing to Makkah 21.4225, 39.8262)
export function calculateQibla(latitude: number, longitude: number): number {
  const makkahLat = dtr(21.4225);
  const makkahLng = dtr(39.8262);
  const userLat = dtr(latitude);
  const userLng = dtr(longitude);

  const deltaLng = makkahLng - userLng;
  const y = Math.sin(deltaLng);
  const x = Math.cos(userLat) * Math.tan(makkahLat) - Math.sin(userLat) * Math.cos(deltaLng);

  let qibla = rtd(Math.atan2(y, x));
  return (qibla + 360) % 360;
}

// Play gentle synthesized Adhan tone or chime
export function playPrayerChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play warm peaceful melodic harmonic chord
    const notes = [261.63, 329.63, 392.00, 523.25]; // C major gentle chord
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 2.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 2.1);
    });
  } catch (e) {
    console.error('Audio chime error:', e);
  }
}

// Hijri Date Calculation (calibrated Umm al-Qura official calendar)
export function getHijriDate(gregorianDate: Date = new Date()): {
  day: number;
  monthIndex: number;
  monthName: string;
  monthNameArabic: string;
  year: number;
  formatted: string;
} {
  const islamicMonths = [
    { en: 'Muharram', ar: 'مُحَرَّم' },
    { en: 'Safar', ar: 'صَفَر' },
    { en: 'Rabi\' al-Awwal', ar: 'رَبِيع الأَوَّل' },
    { en: 'Rabi\' ath-Thani', ar: 'رَبِيع الآخِر' },
    { en: 'Jumada al-Ula', ar: 'جُمَادَى الأُولَى' },
    { en: 'Jumada al-Akhirah', ar: 'جُمَادَى الآخِرَة' },
    { en: 'Rajab', ar: 'رَجَب' },
    { en: 'Sha\'ban', ar: 'شَعْبَان' },
    { en: 'Ramadan', ar: 'رَمَضَان' },
    { en: 'Shawwal', ar: 'شَوَّال' },
    { en: 'Dhu al-Qi\'dah', ar: 'ذُو القَعْدَة' },
    { en: 'Dhu al-Hijjah', ar: 'ذُو الحِجَّة' }
  ];

  // Try standard Umm al-Qura official Islamic calendar formatting via Intl API
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(gregorianDate);
    const dayPart = parts.find(p => p.type === 'day')?.value;
    const monthPart = parts.find(p => p.type === 'month')?.value;
    const yearPart = parts.find(p => p.type === 'year')?.value;

    if (dayPart && monthPart && yearPart) {
      const d = parseInt(dayPart, 10);
      const m = parseInt(monthPart, 10) - 1; // 0-indexed
      const y = parseInt(yearPart, 10);
      const monthData = islamicMonths[m] || islamicMonths[0];

      return {
        day: d,
        monthIndex: m,
        monthName: monthData.en,
        monthNameArabic: monthData.ar,
        year: y,
        formatted: `${d} ${monthData.en} ${y} AH`
      };
    }
  } catch (e) {
    console.warn('Intl Umm al-Qura formatter warning, using calibrated algorithmic fallback:', e);
  }

  // Calibrated astronomical lunar fallback anchored at 2026-09-10 (28 Rabi' al-Awwal 1448 AH)
  const anchorTime = Date.UTC(2026, 8, 10); // September 10, 2026
  const targetTime = Date.UTC(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth(),
    gregorianDate.getDate()
  );
  const diffDays = Math.round((targetTime - anchorTime) / (1000 * 60 * 60 * 24));

  // Anchor Hijri day absolute count from 1 Muharram 1448:
  // 1448 Muharram (30) + Safar (29) + 28 Rabi' al-Awwal = 87 days into 1448
  let dayInYear = 87 + diffDays;
  let year = 1448;

  // Month lengths in lunar calendar
  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  const yearLength = 354;

  while (dayInYear > yearLength) {
    dayInYear -= yearLength;
    year += 1;
  }
  while (dayInYear <= 0) {
    year -= 1;
    dayInYear += yearLength;
  }

  let m = 0;
  let running = 0;
  for (let i = 0; i < monthLengths.length; i++) {
    if (dayInYear <= running + monthLengths[i]) {
      m = i;
      break;
    }
    running += monthLengths[i];
  }
  const d = dayInYear - running;
  const monthData = islamicMonths[m] || islamicMonths[0];

  return {
    day: d,
    monthIndex: m,
    monthName: monthData.en,
    monthNameArabic: monthData.ar,
    year: year,
    formatted: `${d} ${monthData.en} ${year} AH`
  };
}
