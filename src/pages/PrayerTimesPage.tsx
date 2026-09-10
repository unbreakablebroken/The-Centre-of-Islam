import React, { useState, useEffect } from 'react';
import { 
  computePrayerTimes, 
  calculateQibla, 
  playPrayerChime, 
  PRESET_CITIES, 
  CALCULATION_METHODS, 
  PrayerTimes 
} from '../utils/prayerTimes';
import { 
  Clock, 
  Compass, 
  Volume2, 
  MapPin, 
  Sliders, 
  Sun, 
  Sunrise, 
  Sunset, 
  Moon, 
  CheckCircle2, 
  Navigation,
  RefreshCw
} from 'lucide-react';

export const PrayerTimesPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState(PRESET_CITIES[0].name);
  const [latitude, setLatitude] = useState(PRESET_CITIES[0].lat);
  const [longitude, setLongitude] = useState(PRESET_CITIES[0].lng);
  const [timezone, setTimezone] = useState(PRESET_CITIES[0].timezone);
  const [method, setMethod] = useState('MWL');
  const [asrJuristic, setAsrJuristic] = useState<'Standard' | 'Hanafi'>('Standard');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  // Recalculate prayer times whenever params change
  useEffect(() => {
    const pt = computePrayerTimes(new Date(), latitude, longitude, timezone, method, asrJuristic);
    setPrayerTimes(pt);
    setQiblaAngle(Math.round(calculateQibla(latitude, longitude)));

    const interval = setInterval(() => {
      setPrayerTimes(computePrayerTimes(new Date(), latitude, longitude, timezone, method, asrJuristic));
    }, 1000);

    return () => clearInterval(interval);
  }, [latitude, longitude, timezone, method, asrJuristic]);

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const found = PRESET_CITIES.find(c => c.name === cityName);
    if (found) {
      setLatitude(found.lat);
      setLongitude(found.lng);
      setTimezone(found.timezone);
      setLocError(null);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        const tzOffsetHours = -new Date().getTimezoneOffset() / 60;
        setTimezone(tzOffsetHours);
        setSelectedCity(`Current Location (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`);
      },
      (err) => {
        setIsLocating(false);
        setLocError('Unable to retrieve location. Please choose a preset city below.');
      },
      { timeout: 10000 }
    );
  };

  if (!prayerTimes) return null;

  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr, icon: <Moon className="w-5 h-5 text-indigo-400" />, desc: 'Dawn Prayer (2 Rak\'ah Fard)' },
    { name: 'Sunrise', time: prayerTimes.sunrise, icon: <Sunrise className="w-5 h-5 text-amber-500" />, desc: 'End of Fajr time' },
    { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: <Sun className="w-5 h-5 text-amber-400" />, desc: 'Midday Prayer (4 Rak\'ah Fard)' },
    { name: 'Asr', time: prayerTimes.asr, icon: <Sun className="w-5 h-5 text-orange-400" />, desc: 'Afternoon Prayer (4 Rak\'ah Fard)' },
    { name: 'Maghrib', time: prayerTimes.maghrib, icon: <Sunset className="w-5 h-5 text-rose-400" />, desc: 'Sunset Prayer (3 Rak\'ah Fard)' },
    { name: 'Isha', time: prayerTimes.isha, icon: <Moon className="w-5 h-5 text-slate-400" />, desc: 'Night Prayer (4 Rak\'ah Fard)' }
  ];

  const next = prayerTimes.nextPrayer;
  const hoursRemaining = Math.floor(next.remainingMinutes / 60);
  const minutesRemaining = next.remainingMinutes % 60;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>Accurate Astronomical Calculation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Daily Prayer Times & Qibla
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Real-time calculation based on solar declination and verified juristic angles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="detect-location-btn"
            onClick={detectLocation}
            disabled={isLocating}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-stone-300"
          >
            {isLocating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5 text-emerald-800" />}
            <span>Auto Detect Location</span>
          </button>
          <button
            id="play-chime-btn"
            onClick={playPrayerChime}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Adhan Tone Preview</span>
          </button>
        </div>
      </div>

      {locError && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl">
          {locError}
        </div>
      )}

      {/* Countdown & Next Prayer Spotlight */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Current City: {selectedCity}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Next Prayer: <span className="text-amber-300">{next.name}</span>
          </h2>
          <p className="text-emerald-200 text-sm">
            Scheduled at <strong className="text-white">{next.time}</strong>
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[220px]">
          <div className="text-xs text-emerald-200 uppercase tracking-wider font-semibold mb-1">
            Time Remaining
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-amber-300">
            {hoursRemaining > 0 ? `${hoursRemaining}h ` : ''}
            {minutesRemaining}m {next.remainingSeconds}s
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Prepare for purification & prayer
          </div>
        </div>
      </div>

      {/* 6 Prayer Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {prayers.map((p) => {
          const isNext = p.name === next.name;
          return (
            <div
              key={p.name}
              id={`prayer-card-${p.name.toLowerCase()}`}
              className={`rounded-2xl p-4 transition-all border ${
                isNext
                  ? 'bg-emerald-800 text-white border-emerald-700 shadow-md ring-2 ring-amber-400/60 transform -translate-y-1'
                  : 'bg-white text-stone-900 border-stone-200 shadow-xs hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {p.name}
                </span>
                <div className={`p-1.5 rounded-lg ${isNext ? 'bg-emerald-900 text-amber-300' : 'bg-stone-50'}`}>
                  {p.icon}
                </div>
              </div>

              <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight my-1">
                {p.time}
              </div>

              <div className={`text-[11px] leading-tight mt-2 ${isNext ? 'text-emerald-200' : 'text-stone-500'}`}>
                {p.desc}
              </div>

              {isNext && (
                <div className="mt-2.5 pt-2 border-t border-emerald-700 text-[10px] font-bold text-amber-300 flex items-center gap-1 uppercase tracking-wide">
                  <CheckCircle2 className="w-3 h-3" /> Up Next
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Location, Methods & Qibla Compass Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings & City Selector */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base border-b border-stone-100 pb-3">
            <Sliders className="w-4 h-4 text-emerald-800" />
            <span>Location & Calculation Settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city-select" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Preset Major City
              </label>
              <select
                id="city-select"
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 text-stone-900"
              >
                {PRESET_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="method-select" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Calculation Authority
              </label>
              <select
                id="method-select"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 text-stone-900"
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="asr-select" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Asr Juristic Method
              </label>
              <select
                id="asr-select"
                value={asrJuristic}
                onChange={(e) => setAsrJuristic(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 text-stone-900"
              >
                <option value="Standard">Standard (Shafi'i, Maliki, Hanbali - shadow 1x)</option>
                <option value="Hanafi">Hanafi (Shadow 2x)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Coordinates & Timezone
              </label>
              <div className="text-xs text-stone-600 bg-stone-50 p-2 rounded-xl border border-stone-200">
                Lat: {latitude.toFixed(3)}° | Lng: {longitude.toFixed(3)}° | UTC{timezone >= 0 ? `+${timezone}` : timezone}
              </div>
            </div>
          </div>
        </div>

        {/* Qibla Direction Compass Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col items-center justify-between text-center">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base border-b border-stone-100 pb-2 w-full justify-center">
            <Compass className="w-4 h-4 text-emerald-800" />
            <span>Qibla Direction</span>
          </div>

          {/* Compass Graphic */}
          <div className="relative w-36 h-36 my-4 flex items-center justify-center rounded-full bg-stone-50 border-2 border-stone-300 shadow-inner">
            <div className="absolute top-1 text-[10px] font-bold text-stone-400">N</div>
            <div className="absolute right-1 text-[10px] font-bold text-stone-400">E</div>
            <div className="absolute bottom-1 text-[10px] font-bold text-stone-400">S</div>
            <div className="absolute left-1 text-[10px] font-bold text-stone-400">W</div>

            {/* Qibla Needle */}
            <div 
              className="w-1 h-28 absolute transition-transform duration-700 ease-out pointer-events-none"
              style={{ transform: `rotate(${qiblaAngle}deg)` }}
            >
              <div className="w-3 h-10 bg-emerald-800 rounded-full mx-auto shadow-sm -mt-2 flex items-center justify-center text-[8px] text-amber-300 font-bold">
                ▲
              </div>
            </div>

            <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow-xs z-10"></div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-emerald-900 font-mono">
              {qiblaAngle}° from North
            </div>
            <p className="text-xs text-stone-500">
              Bearing toward the Ka'bah in Makkah al-Mukarramah
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
