export type UserRole = 'teacher' | 'admin';
export type SubscriptionStatus = 'none' | 'trial' | 'active' | 'expired';

export interface User {
  id: string; // This will be the Firebase Auth UID
  email: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: number | null; // Timestamp
  subscriptionEndsAt: number | null; // Timestamp
}

export interface Video {
  id: string;
  title: string;
  description: string;
  gcsUrl: string; // The "secure" URL
  thumbnailUrl: string;
}