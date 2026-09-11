import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  todayKey: string;
  lastVisitAt: string | null;
  loading: boolean;
}

interface VisitorContextType {
  stats: VisitorStats;
  refreshStats: () => Promise<void>;
}

const defaultStats: VisitorStats = {
  totalVisits: 1,
  uniqueVisitors: 1,
  todayVisits: 1,
  todayKey: new Date().toISOString().split('T')[0],
  lastVisitAt: new Date().toISOString(),
  loading: true
};

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<VisitorStats>(defaultStats);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const recordAndListenVisits = async () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const visitsDocRef = doc(db, 'analytics', 'visits');

      // 1. Check if this browser tab/session already counted this visit
      const sessionKey = 'coi_visit_session_recorded';
      const hasTrackedSession = sessionStorage.getItem(sessionKey);

      // Check if this browser has a persistent unique visitor ID
      const visitorIdKey = 'coi_unique_visitor_id';
      const existingVisitorId = localStorage.getItem(visitorIdKey);
      const isNewUniqueVisitor = !existingVisitorId;

      if (isNewUniqueVisitor) {
        try {
          const newId = 'vis_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
          localStorage.setItem(visitorIdKey, newId);
        } catch {}
      }

      // Record visit if not yet tracked in this session
      if (!hasTrackedSession) {
        try {
          sessionStorage.setItem(sessionKey, 'true');

          const snap = await getDoc(visitsDocRef);
          const nowIso = new Date().toISOString();

          if (!snap.exists()) {
            // First time initialization
            await setDoc(visitsDocRef, {
              totalVisits: 1,
              uniqueVisitors: isNewUniqueVisitor ? 1 : 1,
              todayVisits: 1,
              todayKey: todayStr,
              lastVisitAt: nowIso
            });
          } else {
            const data = snap.data();
            const storedTodayKey = data.todayKey;
            const isSameDay = storedTodayKey === todayStr;

            await updateDoc(visitsDocRef, {
              totalVisits: increment(1),
              uniqueVisitors: isNewUniqueVisitor ? increment(1) : increment(0),
              todayVisits: isSameDay ? increment(1) : 1,
              todayKey: todayStr,
              lastVisitAt: nowIso
            });
          }
        } catch (err) {
          console.warn('Visitor counter tracking note (using cached/offline state):', err);
          // Graceful local tracking fallback
          try {
            const localVisits = parseInt(localStorage.getItem('coi_local_total_visits') || '1', 10) + 1;
            localStorage.setItem('coi_local_total_visits', localVisits.toString());
            setStats(prev => ({
              ...prev,
              totalVisits: localVisits,
              loading: false
            }));
          } catch {}
        }
      }

      // 2. Real-time subscription to visits document
      try {
        unsubscribe = onSnapshot(
          visitsDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const d = docSnap.data();
              setStats({
                totalVisits: typeof d.totalVisits === 'number' ? d.totalVisits : 1,
                uniqueVisitors: typeof d.uniqueVisitors === 'number' ? d.uniqueVisitors : 1,
                todayVisits: typeof d.todayVisits === 'number' ? d.todayVisits : 1,
                todayKey: d.todayKey || todayStr,
                lastVisitAt: d.lastVisitAt || null,
                loading: false
              });
            } else {
              setStats(prev => ({ ...prev, loading: false }));
            }
          },
          (error) => {
            console.warn('Visits onSnapshot warning:', error);
            setStats(prev => ({ ...prev, loading: false }));
          }
        );
      } catch (err) {
        console.warn('Failed to listen to visitor stats:', err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    recordAndListenVisits();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const refreshStats = async () => {
    try {
      const snap = await getDoc(doc(db, 'analytics', 'visits'));
      if (snap.exists()) {
        const d = snap.data();
        setStats({
          totalVisits: typeof d.totalVisits === 'number' ? d.totalVisits : 1,
          uniqueVisitors: typeof d.uniqueVisitors === 'number' ? d.uniqueVisitors : 1,
          todayVisits: typeof d.todayVisits === 'number' ? d.todayVisits : 1,
          todayKey: d.todayKey || new Date().toISOString().split('T')[0],
          lastVisitAt: d.lastVisitAt || null,
          loading: false
        });
      }
    } catch (e) {
      console.warn('Refresh stats error:', e);
    }
  };

  return (
    <VisitorContext.Provider value={{ stats, refreshStats }}>
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitor must be used within a VisitorProvider');
  }
  return context;
};
