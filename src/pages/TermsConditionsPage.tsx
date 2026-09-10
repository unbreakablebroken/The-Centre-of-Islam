import React from 'react';
import { FileText, CheckCircle2, AlertTriangle, Scale, ShieldAlert } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>User Agreement & Code of Adab</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs text-stone-500">
          Last Updated: September 2026 • Centre of Islam Governing Rules & Etiquette
        </p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs space-y-8 text-stone-800 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2 border-b border-stone-100 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By accessing or using <strong>Centre of Islam</strong> (including its online Quran, prayer times, hadith repository, educational board study notes, printable charts, monthly Salah habit counter, tasbih counter, and community Q&A forums), you agree to be bound by these Terms and Conditions and adhere to Islamic adab (etiquette).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2 border-b border-stone-100 pb-2">
            <ShieldAlert className="w-4 h-4 text-emerald-800" />
            <span>2. Code of Conduct for Community Debates & Q&A</span>
          </h2>
          <p>
            Our community Q&A and debate forum is dedicated to sincere learning, mutual respect, and scholarly evidence. In accordance with the requirement that <strong>commenting requires user registration</strong>, all participants must strictly adhere to the following rules:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-stone-700">
            <li>
              <strong>Mandatory Authenticity & Citations:</strong> When expressing legal or theological stances, users are strongly urged to substantiate their arguments with verified references (e.g. Quranic Surah & Ayah numbers, recognized Hadith collections with numbers, or classical scholarly consensus).
            </li>
            <li>
              <strong>Prohibition of Takfir & Sectarian Slander:</strong> Users are strictly forbidden from declaring fellow Muslims to be outside the fold of Islam (Takfir), engaging in sectarian abuse, or insulting venerable companions (Sahabah) or classical scholars of Islam.
            </li>
            <li>
              <strong>Civil and Respectful Language:</strong> No profanity, abusive harassment, vulgarity, hate speech, or ad hominem personal insults will be tolerated. The platform adheres to the Quranic command: <em>"And speak to people good words"</em> (2:83).
            </li>
            <li>
              <strong>Content Moderation:</strong> Centre of Islam administrators reserve the right to remove any comment, question, or reference that violates these guidelines and suspend or terminate offending accounts without prior notice.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2 border-b border-stone-100 pb-2">
            <AlertTriangle className="w-4 h-4 text-emerald-800" />
            <span>3. Religious & Academic Disclaimer</span>
          </h2>
          <p>
            The educational materials, community debates, and study notes provided on Centre of Islam (including summaries for IGCSE, CBSE, NCERT, and SSC boards) are designed as supplementary learning aids. While we strive for uncompromising accuracy and adherence to authentic sources:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
            <li>
              Discussions in the Q&A section reflect individual member perspectives and scholarly citations, and do not constitute an official individualized judicial ruling (Fatwa) for personal legal arbitration. Complex personal matters should be referred to local qualified muftis and scholars.
            </li>
            <li>
              Curriculum notes are independent academic study summaries and are not officially endorsed by Cambridge Assessment International Education, CBSE, NCERT, or state boards.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2 border-b border-stone-100 pb-2">
            <FileText className="w-4 h-4 text-emerald-800" />
            <span>4. Intellectual Property & Printable Charts</span>
          </h2>
          <p>
            The Holy Quran and authentic Prophetic Hadith are the sacred heritage of humanity. The printable charts, posters, and study guides compiled on this platform are made available for non-commercial educational use, madrasah instruction, and personal spiritual practice. Commercial resale of printable templates without explicit authorization is prohibited.
          </p>
        </section>
      </div>
    </div>
  );
};
