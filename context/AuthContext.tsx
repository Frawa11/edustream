import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import type { User, Video } from '../types';
import { auth, db } from '../firebase/config';

interface AuthContextType {
  currentUser: User | null;
  realUser: User | null;
  impersonatingUser: User | null;
  users: User[];
  videos: Video[];
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateSubscription: (userId: string, startDate: Date, durationDays: number) => Promise<void>;
  deactivateSubscription: (userId: string) => Promise<void>;
  addVideo: (video: Omit<Video, 'id'>) => Promise<void>;
  editVideo: (videoId: string, updatedVideoData: Partial<Omit<Video, 'id'>>) => Promise<void>;
  deleteVideo: (videoId: string) => Promise<void>;
  checkUserAccess: () => boolean;
  impersonateUser: (userId: string) => void;
  stopImpersonating: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [realUser, setRealUser] = useState<User | null>(null);
    const [impersonatingUser, setImpersonatingUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    const currentUser = useMemo(() => impersonatingUser || realUser, [impersonatingUser, realUser]);
    
    useEffect(() => {
        // Fix: Use v8 namespaced API for auth state changes
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // Fix: Use v8 namespaced API for Firestore document operations
                const userDocRef = db.collection('users').doc(firebaseUser.uid);
                const userDocSnap = await userDocRef.get();
                if (userDocSnap.exists) {
                    const userData = { id: userDocSnap.id, ...userDocSnap.data() } as User;
                    setRealUser(userData);
                } else {
                    // Fix: Use v8 namespaced API for sign out
                    await auth.signOut();
                }
            } else {
                setRealUser(null);
                setImpersonatingUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
      if (realUser?.role === 'admin') {
        // Fix: Use v8 namespaced API for Firestore collection and snapshot
        const usersCollectionRef = db.collection('users');
        const unsubscribe = usersCollectionRef.onSnapshot(snapshot => {
          const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
          setUsers(usersData);
        });
        return () => unsubscribe();
      }
    }, [realUser]);

    useEffect(() => {
      // Fix: Use v8 namespaced API for Firestore query and snapshot
      const videosQuery = db.collection('videos').orderBy('title');
      const unsubscribe = videosQuery.onSnapshot(snapshot => {
          const videosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
          setVideos(videosData);
      });
      return () => unsubscribe();
    }, []);

    const login = async (email: string, pass: string) => {
        // Fix: Use v8 namespaced API for sign in
        await auth.signInWithEmailAndPassword(email, pass);
    };

    const logout = async () => {
        // Fix: Use v8 namespaced API for sign out
        await auth.signOut();
    };

    const register = async (email: string, pass: string) => {
        // Fix: Use v8 namespaced API for user creation
        const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
        if (userCredential.user) {
            const trialEnds = Date.now() + 24 * 60 * 60 * 1000;
            const newUser: Omit<User, 'id'> = {
                email,
                role: 'teacher',
                subscriptionStatus: 'trial',
                trialEndsAt: trialEnds,
                subscriptionEndsAt: null,
            };
            // Fix: Use v8 namespaced API to set document data
            await db.collection('users').doc(userCredential.user.uid).set(newUser);
        }
    };
    
    const sendPasswordReset = async (email: string) => {
        // Fix: Use v8 namespaced API for sending password reset email
        await auth.sendPasswordResetEmail(email);
    };

    const impersonateUser = (userId: string) => {
        const userToImpersonate = users.find(u => u.id === userId);
        if(userToImpersonate) {
            setImpersonatingUser(userToImpersonate);
        }
    };
    
    const stopImpersonating = () => {
        setImpersonatingUser(null);
    };

    const updateSubscription = async (userId: string, startDate: Date, durationDays: number) => {
        const endsAt = startDate.getTime() + durationDays * 24 * 60 * 60 * 1000;
        // Fix: Use v8 namespaced API to update document
        await db.collection('users').doc(userId).update({
            subscriptionStatus: 'active',
            subscriptionEndsAt: endsAt,
            trialEndsAt: null,
        });
    };

    const deactivateSubscription = async (userId: string) => {
        // Fix: Use v8 namespaced API to update document
        await db.collection('users').doc(userId).update({
            subscriptionStatus: 'expired',
            subscriptionEndsAt: null,
        });
    };

    const addVideo = async (video: Omit<Video, 'id'>) => {
        // Fix: Use v8 namespaced API to add a document
        await db.collection('videos').add(video);
    };
    
    const editVideo = async (videoId: string, updatedVideoData: Partial<Omit<Video, 'id'>>) => {
        // Fix: Use v8 namespaced API to update document
        await db.collection('videos').doc(videoId).update(updatedVideoData);
    };

    const deleteVideo = async (videoId: string) => {
        // Fix: Use v8 namespaced API to delete a document
        await db.collection('videos').doc(videoId).delete();
    };

    const checkUserAccess = (): boolean => {
        if (!currentUser) return false;
        if (currentUser.role === 'admin') return true;
        
        const now = Date.now();
        
        if (currentUser.subscriptionStatus === 'active') {
            return currentUser.subscriptionEndsAt ? now <= currentUser.subscriptionEndsAt : false;
        }
        if (currentUser.subscriptionStatus === 'trial') {
            return currentUser.trialEndsAt ? now <= currentUser.trialEndsAt : false;
        }
        return false;
    };

    const value = useMemo(() => ({
        currentUser, realUser, impersonatingUser, users, videos, loading,
        login, logout, register, sendPasswordReset, updateSubscription, deactivateSubscription,
        addVideo, editVideo, deleteVideo, checkUserAccess, impersonateUser, stopImpersonating
    }), [currentUser, realUser, impersonatingUser, users, videos, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
