import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle, 
  LogIn, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Lock,
  UserPlus
} from 'lucide-react';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  noticeMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, noticeMessage }) => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalNotice, 
    loginWithGoogle, 
    loginWithEmailPassword,
    signUpWithEmailPassword,
    sendPasswordReset,
    loginAsGuest
  } = useAuth();

  // Mode: 'email' | 'guest'
  const [activeTab, setActiveTab] = useState<'email' | 'guest'>('email');

  // Email sub-mode: 'signin' | 'signup' | 'forgot'
  const [emailMode, setEmailMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Guest State
  const [guestName, setGuestName] = useState('');

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [unauthorizedDomainError, setUnauthorizedDomainError] = useState<boolean>(false);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  const showModal = isOpen !== undefined ? isOpen : authModalOpen;
  const activeNotice = noticeMessage !== undefined ? noticeMessage : authModalNotice;

  const handleClose = () => {
    setError(null);
    setSuccessMsg(null);
    setUnauthorizedDomainError(false);
    setPassword('');
    if (onClose) {
      onClose();
    } else {
      setAuthModalOpen(false);
    }
  };

  if (!showModal) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDomain(text);
    setTimeout(() => setCopiedDomain(null), 2500);
  };

  // Handle Email + Password Sign In / Sign Up
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setUnauthorizedDomainError(false);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (emailMode === 'forgot') {
      setIsSubmitting(true);
      try {
        const res = await sendPasswordReset(cleanEmail);
        setSuccessMsg(res.message);
      } catch (err: any) {
        setError(err.message || 'Failed to send password reset email.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (emailMode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (emailMode === 'signup') {
        await signUpWithEmailPassword(cleanEmail, password, displayName.trim());
        setSuccessMsg('Account created successfully! Signing you in...');
      } else {
        await loginWithEmailPassword(cleanEmail, password);
        setSuccessMsg('Signed in successfully!');
      }
      setTimeout(() => {
        handleClose();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessMsg(null);
    setUnauthorizedDomainError(false);
    setIsSubmitting(true);

    try {
      await loginWithGoogle();
      handleClose();
    } catch (err: any) {
      if (err.message && err.message.includes('Firebase Domain Authorization Required')) {
        setUnauthorizedDomainError(true);
        setError(err.message);
      } else {
        setError(err.message || 'Google Sign-in was cancelled or encountered an error.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Guest Login
  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Please enter a display name to continue as a guest.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await loginAsGuest(guestName.trim());
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'run.app';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            Sign In to Centre of Islam
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            {activeNotice || 'Join our Islamic educational community to discuss questions, track your prayers, and save notes.'}
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <span className="font-medium leading-relaxed block">{error}</span>
              
              {/* Specialized Guidance for auth/unauthorized-domain */}
              {unauthorizedDomainError && (
                <div className="mt-2 pt-2 border-t border-rose-200 space-y-2 text-[11px] text-rose-900">
                  <p className="font-semibold text-rose-950">
                    To authorize Google Sign-In for this domain:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 pl-1">
                    <li>Open your <strong>Firebase Console</strong></li>
                    <li>Go to <strong>Authentication</strong> → <strong>Settings</strong> tab</li>
                    <li>Scroll to <strong>Authorized domains</strong> and click <strong>Add domain</strong></li>
                    <li>Add both of these domains:</li>
                  </ol>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-rose-300 font-mono text-[10px]">
                      <span className="truncate">{currentHost}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(currentHost)}
                        className="ml-2 text-rose-700 hover:text-rose-900 flex items-center gap-1 shrink-0 font-sans font-bold"
                      >
                        {copiedDomain === currentHost ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedDomain === currentHost ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-rose-300 font-mono text-[10px]">
                      <span className="truncate">centre-of-islam.vercel.app</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('centre-of-islam.vercel.app')}
                        className="ml-2 text-rose-700 hover:text-rose-900 flex items-center gap-1 shrink-0 font-sans font-bold"
                      >
                        {copiedDomain === 'centre-of-islam.vercel.app' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedDomain === 'centre-of-islam.vercel.app' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="font-semibold text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    Tip: You can use Email & Password below right now! It does not require domain authorization.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-start gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Tab Navigation: Email vs Guest */}
        <div className="flex p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              setError(null);
              setSuccessMsg(null);
              setUnauthorizedDomainError(false);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'email'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Account</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('guest');
              setError(null);
              setSuccessMsg(null);
              setUnauthorizedDomainError(false);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'guest'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Guest Sign-In</span>
          </button>
        </div>

        {/* Tab 1: Email Account Authentication */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            {/* Sub-toggle: Sign In vs Create Account */}
            {emailMode !== 'forgot' && (
              <div className="flex justify-center gap-4 text-xs font-semibold border-b border-stone-100 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmailMode('signin');
                    setError(null);
                  }}
                  className={`pb-1 transition-colors cursor-pointer ${
                    emailMode === 'signin'
                      ? 'text-emerald-800 border-b-2 border-emerald-800 font-bold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailMode('signup');
                    setError(null);
                  }}
                  className={`pb-1 transition-colors cursor-pointer ${
                    emailMode === 'signup'
                      ? 'text-emerald-800 border-b-2 border-emerald-800 font-bold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {emailMode === 'forgot' && (
              <div className="flex items-center justify-between text-xs border-b border-stone-100 pb-2">
                <span className="font-bold text-stone-800">Reset Your Password</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmailMode('signin');
                    setError(null);
                  }}
                  className="text-emerald-800 hover:underline font-semibold cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute right-3.5 top-2.5" />
                </div>
              </div>

              {emailMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Display Name <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Tariq Al-Ansari"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900"
                    />
                    <UserCheck className="w-4 h-4 text-stone-400 absolute right-3.5 top-2.5" />
                  </div>
                </div>
              )}

              {emailMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    {emailMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmailMode('forgot');
                          setError(null);
                        }}
                        className="text-[11px] text-emerald-800 hover:underline font-semibold cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={emailMode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-10 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {emailMode === 'forgot' ? (
                  <>
                    <Mail className="w-4 h-4 text-amber-300" />
                    <span>{isSubmitting ? 'Dispatching Link...' : 'Email Me Password Reset Link'}</span>
                  </>
                ) : emailMode === 'signup' ? (
                  <>
                    <UserPlus className="w-4 h-4 text-amber-300" />
                    <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-amber-300" />
                    <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                Or With Google
              </span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-medium text-xs rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* Tab 2: Guest Sign In */}
        {activeTab === 'guest' && (
          <form onSubmit={handleGuestLogin} className="space-y-4">
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 leading-relaxed">
              Guest access allows you to participate in community discussions and use interactive trackers immediately without creating an account.
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Preferred Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Student of Knowledge"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? 'Entering...' : 'Enter as Guest'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
