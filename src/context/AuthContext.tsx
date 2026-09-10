import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInAnonymously,
  updateProfile,
  User,
  db
} from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc 
} from 'firebase/firestore';
import { UserProfile } from '../types';

const ADMIN_EMAILS = ['homamfazal@gmail.com'];
const ADMIN_PASSCODE = 'centre2026';

interface AuthContextType {
  user: UserProfile | null;
  rawUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: (name: string) => Promise<void>;
  sendVerificationCodeToEmail: (email: string, displayName?: string) => Promise<{ success: boolean; code?: string; message?: string }>;
  verifyEmailCodeAndLogin: (email: string, code: string, displayName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  closeAuthModal: () => void;
  authModalNotice?: string;
  authNoticeMessage?: string;
  openAuthModalWithNotice: (notice?: string) => void;
  isAdmin: boolean;
  verifyAdminPasscode: (code: string) => boolean;
  grantAdminAccess: () => void;
  revokeAdminAccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawUser, setRawUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalNotice, setAuthModalNotice] = useState<string | undefined>(undefined);
  const [manualAdminUnlocked, setManualAdminUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('coi_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setRawUser(currentUser);
      if (currentUser) {
        // Check if there is a saved verified email session
        const savedEmail = localStorage.getItem('coi_verified_email');
        const savedName = localStorage.getItem('coi_verified_name');
        
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName || savedName || (currentUser.isAnonymous ? 'Guest Muslim' : 'Community Member'),
          email: currentUser.email || savedEmail || undefined,
          photoURL: currentUser.photoURL,
          isAnonymous: currentUser.isAnonymous && !savedEmail
        });
      } else {
        // Even if Firebase auth is null, check if we have an active verified session
        const savedEmail = localStorage.getItem('coi_verified_email');
        const savedName = localStorage.getItem('coi_verified_name');
        if (savedEmail) {
          setUser({
            uid: `verified_${savedEmail}`,
            displayName: savedName || savedEmail.split('@')[0],
            email: savedEmail,
            isAnonymous: false
          });
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sendVerificationCodeToEmail = async (
    email: string, 
    displayName?: string
  ): Promise<{ success: boolean; code?: string; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    // Generate a secure 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    // 1. Store in Firestore database
    try {
      await addDoc(collection(db, 'email_verifications'), {
        email: cleanEmail,
        code,
        displayName: displayName || '',
        expiresAt,
        used: false,
        createdAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.warn('Firestore verification code logging warning:', err);
    }

    // 2. Store in local state/storage for reliable verification fallback
    try {
      localStorage.setItem(`coi_pending_otp_${cleanEmail}`, JSON.stringify({
        code,
        expiresAt,
        displayName: displayName || ''
      }));
    } catch {}

    return {
      success: true,
      code,
      message: `A 6-digit verification code has been generated for ${cleanEmail}.`
    };
  };

  const verifyEmailCodeAndLogin = async (
    email: string, 
    enteredCode: string, 
    displayName?: string
  ): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = enteredCode.trim();

    let isValid = false;

    // Check Firestore database
    try {
      const q = query(
        collection(db, 'email_verifications'),
        where('email', '==', cleanEmail),
        where('code', '==', cleanCode),
        where('used', '==', false)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docRef = snap.docs[0];
        const data = docRef.data();
        if (data.expiresAt > Date.now()) {
          isValid = true;
          try {
            await updateDoc(doc(db, 'email_verifications', docRef.id), { used: true });
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Firestore code check warning:', err);
    }

    // Check fallback storage
    if (!isValid) {
      try {
        const stored = localStorage.getItem(`coi_pending_otp_${cleanEmail}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.code === cleanCode && parsed.expiresAt > Date.now()) {
            isValid = true;
            localStorage.removeItem(`coi_pending_otp_${cleanEmail}`);
          }
        }
      } catch {}
    }

    if (!isValid) {
      return false;
    }

    // Ensure Firebase auth session exists
    let currentUser = auth.currentUser;
    if (!currentUser) {
      try {
        const res = await signInAnonymously(auth);
        currentUser = res.user;
      } catch {}
    }

    const finalDisplayName = displayName?.trim() || cleanEmail.split('@')[0];
    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName: finalDisplayName });
      } catch {}
    }

    const profile: UserProfile = {
      uid: currentUser?.uid || `verified_${Date.now()}`,
      displayName: finalDisplayName,
      email: cleanEmail,
      isAnonymous: false
    };

    setUser(profile);

    try {
      localStorage.setItem('coi_verified_email', cleanEmail);
      localStorage.setItem('coi_verified_name', finalDisplayName);
    } catch {}

    // If admin email, grant admin privileges
    if (ADMIN_EMAILS.includes(cleanEmail)) {
      setManualAdminUnlocked(true);
      try {
        localStorage.setItem('coi_admin_unlocked', 'true');
      } catch {}
    }

    setAuthModalOpen(false);
    return true;
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setAuthModalOpen(false);
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      throw err;
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
    setManualAdminUnlocked(false);
    try {
      localStorage.removeItem('coi_admin_unlocked');
      localStorage.removeItem('coi_verified_email');
      localStorage.removeItem('coi_verified_name');
    } catch {}
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

  // Determine admin privileges
  const isOwnerEmail = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
  const isAdmin = Boolean(isOwnerEmail || manualAdminUnlocked);

  const verifyAdminPasscode = (code: string): boolean => {
    if (code.trim() === ADMIN_PASSCODE) {
      setManualAdminUnlocked(true);
      try {
        localStorage.setItem('coi_admin_unlocked', 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const grantAdminAccess = () => {
    setManualAdminUnlocked(true);
    try {
      localStorage.setItem('coi_admin_unlocked', 'true');
    } catch {}
  };

  const revokeAdminAccess = () => {
    setManualAdminUnlocked(false);
    try {
      localStorage.removeItem('coi_admin_unlocked');
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        rawUser,
        loading,
        loginWithGoogle,
        loginAsGuest,
        sendVerificationCodeToEmail,
        verifyEmailCodeAndLogin,
        logout,
        authModalOpen,
        setAuthModalOpen,
        isAuthModalOpen: authModalOpen,
        closeAuthModal,
        authModalNotice,
        authNoticeMessage: authModalNotice,
        openAuthModalWithNotice,
        isAdmin,
        verifyAdminPasscode,
        grantAdminAccess,
        revokeAdminAccess
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
