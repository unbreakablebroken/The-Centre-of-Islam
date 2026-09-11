import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInAnonymously,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  User 
} from '../lib/firebase';
import { UserProfile } from '../types';

export const ADMIN_EMAILS = [
  'homamfazal@gmail.com',
  'homam3@insight.edu.in'
];

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

interface AuthContextType {
  user: UserProfile | null;
  rawUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string, displayName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  loginAsGuest: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  closeAuthModal: () => void;
  authModalNotice?: string;
  authNoticeMessage?: string;
  openAuthModalWithNotice: (notice?: string) => void;
  isAdmin: boolean;
  isAuthorizedAdminEmail: boolean;
  adminSessionVerified: boolean;
  verifyAdminSessionLogin: (email: string) => boolean;
  lockAdminSession: () => void;
  // Backward compatibility signatures
  sendVerificationCodeToEmail?: (email: string, displayName?: string) => Promise<{ success: boolean; code?: string; message?: string }>;
  verifyEmailCodeAndLogin?: (email: string, code: string, displayName?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawUser, setRawUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalNotice, setAuthModalNotice] = useState<string | undefined>(undefined);
  // Admin session is intentionally in-memory only (defaults to false)
  // User explicitly instructed: "require it to log in every time i try to enter"
  const [adminSessionVerified, setAdminSessionVerified] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setRawUser(currentUser);
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName || (currentUser.isAnonymous ? 'Guest Muslim' : 'Community Member'),
          email: currentUser.email || undefined,
          photoURL: currentUser.photoURL,
          isAnonymous: currentUser.isAnonymous
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        if (isAdminEmail(result.user.email)) {
          setAdminSessionVerified(true);
        }
        setAuthModalOpen(false);
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('auth/unauthorized-domain')) {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'run.app';
        throw new Error(
          `Firebase Domain Authorization Required: The domain '${currentHost}' has not yet been authorized in Firebase Auth. ` +
          `Please add '${currentHost}' and 'centre-of-islam.vercel.app' under Firebase Console > Authentication > Settings > Authorized domains. ` +
          `In the meantime, you can sign in directly with Email & Password below!`
        );
      }
      throw err;
    }
  };

  const loginWithEmailPassword = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
      if (res.user && isAdminEmail(res.user.email)) {
        setAdminSessionVerified(true);
      }
      setAuthModalOpen(false);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        throw new Error('Incorrect email or password. If you are new or forgot your password, please click "Create Account" or "Forgot Password".');
      }
      if (err.code === 'auth/too-many-requests') {
        throw new Error('Access temporarily blocked due to multiple failed attempts. Please reset your password or try again in a few minutes.');
      }
      throw new Error(err.message || 'Email authentication failed.');
    }
  };

  const signUpWithEmailPassword = async (email: string, password: string, displayName?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const name = displayName?.trim() || cleanEmail.split('@')[0];
      try {
        await updateProfile(res.user, { displayName: name });
      } catch {}

      try {
        // Send actual verification email via Firebase / Google
        await sendEmailVerification(res.user);
      } catch (err) {
        console.warn('sendEmailVerification notice:', err);
      }

      if (res.user && isAdminEmail(res.user.email)) {
        setAdminSessionVerified(true);
      }
      setAuthModalOpen(false);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please switch to "Sign In" with your password, or click "Forgot Password".');
      }
      if (err.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters with a mixture of letters and numbers.');
      }
      throw new Error(err.message || 'Account registration failed.');
    }
  };

  const sendPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: `A password reset link has been dispatched by Firebase to ${cleanEmail}. Please check your Gmail or email inbox.`
      };
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        throw new Error(`No account found registered under ${cleanEmail}. Please create an account first.`);
      }
      throw new Error(err.message || 'Failed to dispatch password reset email.');
    }
  };

  const loginAsGuest = async (name: string) => {
    try {
      const result = await signInAnonymously(auth);
      if (result.user) {
        if (name.trim()) {
          await updateProfile(result.user, { displayName: name.trim() });
        }
        setAuthModalOpen(false);
      }
    } catch (err: any) {
      console.error('Guest Sign-in failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAdminSessionVerified(false);
    setUser(null);
  };

  const openAuthModalWithNotice = (notice?: string) => {
    setAuthModalNotice(notice);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthModalNotice(undefined);
  };

  // Determine admin privileges: strictly restricted to homamfazal@gmail.com and homam3@insight.edu.in
  const isAuthorizedAdminEmail = Boolean(user?.email && isAdminEmail(user.email));
  // User explicitly instructed: "require it to log in every time i try to enter"
  const isAdmin = Boolean(isAuthorizedAdminEmail && adminSessionVerified);

  const verifyAdminSessionLogin = (email: string): boolean => {
    if (isAdminEmail(email)) {
      setAdminSessionVerified(true);
      return true;
    }
    return false;
  };

  const lockAdminSession = () => {
    setAdminSessionVerified(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        rawUser,
        loading,
        loginWithGoogle,
        loginWithEmailPassword,
        signUpWithEmailPassword,
        sendPasswordReset,
        loginAsGuest,
        logout,
        authModalOpen,
        setAuthModalOpen,
        isAuthModalOpen: authModalOpen,
        closeAuthModal,
        authModalNotice,
        authNoticeMessage: authModalNotice,
        openAuthModalWithNotice,
        isAdmin,
        isAuthorizedAdminEmail,
        adminSessionVerified,
        verifyAdminSessionLogin,
        lockAdminSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
