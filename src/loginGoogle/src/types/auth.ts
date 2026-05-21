export type AuthStrategy = 'popup' | 'redirect';

export type AuthProvider = 'google' | 'password' | 'unknown';

export interface AppUser {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  provider: AuthProvider;
}

export interface AuthError {
  code: string;
  message: string;
  raw?: unknown;
}

export interface DebugSnapshot {
  strategy: AuthStrategy;
  platform: string;
  browser: string;
  isStandalone: boolean;
  user: AppUser | null;
  lastError: AuthError | null;
  url: string;
  redirectPending: boolean;
  sessionRestored: boolean;
}
