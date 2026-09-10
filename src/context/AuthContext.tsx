import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInAnonymously,
  updateProfile,
  User 
} from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  rawUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalNotice?: string;
  openAuthModalWithNotice: (notice: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawUser, setRawUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalNotice, setAuthModalNotice] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setRawUser(currentUser);
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName || (currentUser.isAnonymous ? 'Guest Muslim' : 'Community Member'),
          email: currentUser.email,
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
  };

  const openAuthModalWithNotice = (notice: string) => {
    setAuthModalNotice(notice);
    setAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        rawUser,
        loading,
        loginWithGoogle,
        loginAsGuest,
        logout,
        authModalOpen,
        setAuthModalOpen,
        authModalNotice,
        openAuthModalWithNotice
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
