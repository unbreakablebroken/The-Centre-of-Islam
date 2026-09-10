import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle, 
  LogIn, 
  Sparkles, 
  Mail, 
  KeyRound, 
  ArrowLeft, 
  CheckCircle2, 
  RefreshCw,
  Copy,
  Check
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
    loginAsGuest,
    sendVerificationCodeToEmail,
    verifyEmailCodeAndLogin
  } = useAuth();

  // Mode: 'email-otp' | 'guest'
  const [activeTab, setActiveTab] = useState<'email-otp' | 'guest'>('email-otp');

  // Email OTP Flow State
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [dispatchedCode, setDispatchedCode] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Guest State
  const [guestName, setGuestName] = useState('');

  // General Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const otpInputRef = useRef<HTMLInputElement>(null);

  const showModal = isOpen !== undefined ? isOpen : authModalOpen;
  const activeNotice = noticeMessage !== undefined ? noticeMessage : authModalNotice;

  useEffect(() => {
    let timer: any;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (codeSent && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [codeSent]);

  const handleClose = () => {
    setError(null);
    setSuccessMsg(null);
    setCodeSent(false);
    setOtpCode('');
    if (onClose) {
      onClose();
    } else {
      setAuthModalOpen(false);
    }
  };

  if (!showModal) return null;

  // Step 1: Request Email Verification Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const res = await sendVerificationCodeToEmail(cleanEmail, displayName.trim());
      setCodeSent(true);
      setDispatchedCode(res.code || null);
      setResendCountdown(30);
      setSuccessMsg(`A 6-digit verification code has been dispatched to ${cleanEmail}.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify Code and Sign In
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const verified = await verifyEmailCodeAndLogin(email, otpCode, displayName.trim());
      if (verified) {
        setSuccessMsg('Email verified successfully! Signing you in...');
        setTimeout(() => {
          handleClose();
        }, 800);
      } else {
        setError('Invalid or expired verification code. Please check and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (dispatchedCode) {
      navigator.clipboard.writeText(dispatchedCode);
      setCopiedCode(true);
      setOtpCode(dispatchedCode);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      handleClose();
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
      handleClose();
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
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center mx-auto mb-2.5 border border-emerald-100 shadow-xs">
            {codeSent ? <KeyRound className="w-6 h-6 text-emerald-700" /> : <ShieldCheck className="w-6 h-6 text-emerald-700" />}
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            {codeSent ? 'Enter Verification Code' : 'Sign In to Centre of Islam'}
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
            {activeNotice || (codeSent 
              ? `We sent a 6-digit verification code to ${email}`
              : 'Sign in to access verified discussions, debates with citations, and admin features.')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-start gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && !error && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-start gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Selection (only if not on enter code step) */}
        {!codeSent && (
          <div className="flex border-b border-stone-200 mb-4 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('email-otp'); setError(null); }}
              className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${
                activeTab === 'email-otp'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Email Verification Code
            </button>
            <button
              onClick={() => { setActiveTab('guest'); setError(null); }}
              className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${
                activeTab === 'guest'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Fast Guest Access
            </button>
          </div>
        )}

        {/* Tab 1: Email Verification Code Flow */}
        {activeTab === 'email-otp' && (
          <div>
            {!codeSent ? (
              /* Step 1: Send Code Form */
              <form onSubmit={handleSendCode} className="space-y-3.5">
                <div>
                  <label htmlFor="auth-email-input" className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="auth-email-input"
                      type="email"
                      required
                      placeholder="e.g. yourname@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-stone-900"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    We will send a 6-digit one-time code to this email.
                  </p>
                </div>

                <div>
                  <label htmlFor="auth-display-name" className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name or Display Name <span className="text-stone-400 text-[10px] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="auth-display-name"
                      type="text"
                      placeholder="e.g. Tariq Al-Ansari"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-stone-900"
                    />
                    <UserCheck className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
                  </div>
                </div>

                <button
                  id="send-verification-code-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Code...' : 'Send Verification Code'}</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Or Sign In With
                  </span>
                  <div className="flex-grow border-t border-stone-200"></div>
                </div>

                <button
                  id="google-signin-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium text-xs rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  <span>Google Account</span>
                </button>
              </form>
            ) : (
              /* Step 2: Code Verification Input */
              <form onSubmit={handleVerifyCode} className="space-y-4">
                {/* Simulated Preview Assistance Banner */}
                {dispatchedCode && (
                  <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-amber-900 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        Verification Code Sent
                      </span>
                      <span className="font-mono text-sm tracking-widest bg-amber-200 px-2 py-0.5 rounded text-amber-950 font-bold">
                        {dispatchedCode}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-amber-800/80">
                        Check your email inbox or click to auto-fill.
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode ? 'Filled' : 'Auto-fill'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="otp-input" className="block text-xs font-semibold text-stone-700">
                      Enter 6-Digit Code
                    </label>
                    <button
                      type="button"
                      onClick={() => { setCodeSent(false); setOtpCode(''); }}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" /> Edit Email
                    </button>
                  </div>
                  <input
                    ref={otpInputRef}
                    id="otp-input"
                    type="text"
                    maxLength={6}
                    required
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setOtpCode(val);
                    }}
                    className="w-full text-center text-2xl font-mono tracking-[0.4em] py-3 bg-stone-50 border-2 border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-stone-900 font-bold transition-all"
                  />
                </div>

                <button
                  id="verify-code-btn"
                  type="submit"
                  disabled={isSubmitting || otpCode.length < 6}
                  className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying...' : 'Verify & Sign In'}</span>
                </button>

                <div className="flex items-center justify-between pt-1 text-xs text-stone-500">
                  <span>Didn't receive email?</span>
                  <button
                    type="button"
                    disabled={resendCountdown > 0 || isSubmitting}
                    onClick={handleSendCode}
                    className="text-emerald-800 font-semibold hover:underline disabled:text-stone-400 disabled:no-underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${resendCountdown > 0 ? '' : 'hover:rotate-45 transition-transform'}`} />
                    <span>{resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Guest Login */}
        {activeTab === 'guest' && (
          <form onSubmit={handleGuestLogin} className="space-y-3.5">
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
              <p className="text-[11px] text-stone-500 mt-1">
                You can browse and comment immediately as a guest.
              </p>
            </div>

            <button
              id="guest-signin-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Continue as Guest</span>
            </button>
          </form>
        )}

        <div className="mt-5 pt-3.5 border-t border-stone-100 text-center">
          <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Islamic discourse ethics: respectful, authentic, and scholarly.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
