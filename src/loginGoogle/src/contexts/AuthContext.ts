import { createContext } from 'react';
import type { AppUser, AuthError, AuthStrategy } from '@/types/auth';

export interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  initializing: boolean;
  strategy: AuthStrategy;
  redirectPending: boolean;
  sessionRestored: boolean;
  lastError: AuthError | null;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
