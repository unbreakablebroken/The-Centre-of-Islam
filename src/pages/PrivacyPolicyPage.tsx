import React from 'react';
import { Shield, Lock, Eye, Database, Globe, UserCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Legal & Amanah (Trust)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-stone-500">
          Last Updated: September 2026 • Centre of Islam Digital Trust & Privacy Standards
        </p>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs space-y-8 text-stone-800 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Lock className="w-4 h-4 text-emerald-800" />
            <span>1. Our Commitment to Amanah (Confidentiality & Trust)</span>
          </h2>
          <p>
            At <strong>Centre of Islam</strong>, we view data privacy not solely as a legal obligation, but as a sacred trust (Amanah). We are committed to protecting your personal information and spiritual practice data. We do not sell, rent, monetize, or trade your personal data to any third-party advertisers or data brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Database className="w-4 h-4 text-emerald-800" />
            <span>2. Information We Collect</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-stone-700">
            <li>
              <strong>Account Authentication Data:</strong> When you sign up or log in (via Google Authentication or email alias), we receive your basic public profile information, including your name, email address, and profile photo. This is utilized strictly to attribute your questions, debates, citations, and to secure your account.
            </li>
            <li>
              <strong>Community Contributions:</strong> Any questions, debate perspectives, comments, and citations you submit to the Community Q&A forum are stored in our secure database to display publicly for educational benefit.
            </li>
            <li>
              <strong>Salah Habit Tracker Records:</strong> If you are authenticated, your monthly prayer checkmarks are synchronized privately to your unique user record in Firebase Firestore (<code className="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">users/[uid]/salahMonthly/[monthKey]</code>). Only your authenticated account has read and write access to your personal Salah logs.
            </li>
            <li>
              <strong>Local Browser Storage:</strong> For your convenience, offline settings (such as Quran bookmarks, tasbih counters, preferred prayer calculation methods, and temporary guest Salah records) are stored locally on your device in your browser's LocalStorage.
            </li>
            <li>
              <strong>Geolocation Data:</strong> If you voluntarily click "Auto Detect Location" on the Prayer Times page, your browser provides temporary latitude and longitude coordinates solely to compute solar angles. This coordinate data is computed on your client device and is never stored on our remote servers.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Globe className="w-4 h-4 text-emerald-800" />
            <span>3. How We Use Your Data</span>
          </h2>
          <p>
            We use the gathered information strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
            <li>Deliver accurate astronomical prayer times and Qibla compass bearing for your location.</li>
            <li>Authenticate comments and debate contributions to prevent abuse and maintain constructive Islamic discourse.</li>
            <li>Enable multi-device synchronization of your monthly prayer habits.</li>
            <li>Ensure platform security, maintain audit logs, and adhere to our terms of conduct.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2 border-b border-stone-100 pb-2">
            <UserCheck className="w-4 h-4 text-emerald-800" />
            <span>4. User Control & Data Deletion</span>
          </h2>
          <p>
            You retain complete autonomy over your data. You may sign out at any time or request complete deletion of your personal account, Salah records, or submitted forum posts by contacting our administrative team. Clearing your browser cache or site data will immediately wipe all locally stored preferences and bookmarks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Eye className="w-4 h-4 text-emerald-800" />
            <span>5. Changes to this Policy</span>
          </h2>
          <p>
            We may periodically revise this Privacy Policy to reflect technical enhancements or regulatory updates. Any modifications will be posted here with an updated revision date.
          </p>
        </section>
      </div>
    </div>
  );
};
