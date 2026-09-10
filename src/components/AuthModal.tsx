import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, UserCheck, AlertCircle, LogIn, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, authModalNotice, loginWithGoogle, loginAsGuest } = useAuth();
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google Sign-in was cancelled or encountered an error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Please enter a display name to continue.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await loginAsGuest(guestName);
    } catch (err: any) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div 
        id="auth-modal-card"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative transform transition-all"
      >
        <button
          id="close-auth-modal"
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-3 border border-emerald-100 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Sign In to Centre of Islam</h2>
          <p className="text-sm text-stone-600 mt-1">
            {authModalNotice || 'Sign up to participate in community debates, provide citations & save your personal Salah records.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-start gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <button
            id="google-signin-btn"
            type="button"
            disabled={isSubmitting}
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.54 0 2.92.54 4.01 1.43l3.01-3.01C17.2 1.7 14.77 1 12 1 7.42 1 3.54 3.63 1.67 7.45l3.66 2.84C6.21 7.28 8.87 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.67 2.85c2.14-1.98 3.75-4.89 3.75-8.67z"
              />
              <path
                fill="#FBBC05"
                d="M5.33 14.71A7.03 7.03 0 0 1 5 12c0-.95.17-1.87.48-2.71L1.82 6.45C.66 8.78 0 10.32 0 12c0 1.68.66 3.22 1.82 5.55l3.51-2.84z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.67-2.85c-1.07.72-2.44 1.16-4.26 1.16-3.13 0-5.79-2.28-6.67-5.29L1.67 15.95C3.54 19.77 7.42 22.4 12 22.4z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-stone-400 font-medium">
              Or Fast Guest Access
            </span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          <form onSubmit={handleGuestLogin} className="space-y-3">
            <div>
              <label htmlFor="guest-name-input" className="block text-xs font-semibold text-stone-700 mb-1">
                Your Preferred Community Name
              </label>
              <div className="relative">
                <input
                  id="guest-name-input"
                  type="text"
                  placeholder="e.g. Tariq Al-Ansari, Sister Fatima"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-stone-900"
                />
                <UserCheck className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <button
              id="guest-signin-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>Enter as Verified Guest</span>
            </button>
          </form>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 text-center">
          <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            Adhering to Islamic discourse ethics: respectful, authentic, and scholarly.
          </p>
        </div>
      </div>
    </div>
  );
};
