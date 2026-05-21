import { firebaseAuth } from '@/database/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { AuthLogger } from './AuthLogger';
import { safeStorage } from '@/utils/storage';

const REDIRECT_PENDING_KEY = 'auth:redirect-pending';
const SESSION_RESTORED_KEY = 'auth:session-restored';

export const SessionService = {
  observe(callback: (user: User | null) => void): () => void {
    AuthLogger.info('SessionService', 'subscribing to onAuthStateChanged');
    return onAuthStateChanged(
      firebaseAuth,
      (user) => {
        AuthLogger.info('SessionService', 'onAuthStateChanged', {
          uid: user?.uid ?? null,
          email: user?.email ?? null
        });
        if (user) safeStorage.set(SESSION_RESTORED_KEY, true);
        callback(user);
      },
      (err) => AuthLogger.error('SessionService', 'onAuthStateChanged error', err)
    );
  },

  current(): User | null {
    return firebaseAuth.currentUser;
  },

  async logout(): Promise<void> {
    AuthLogger.info('SessionService', 'logout requested');
    await signOut(firebaseAuth);
    safeStorage.remove(SESSION_RESTORED_KEY);
  },

  markRedirectPending(value: boolean): void {
    if (value) safeStorage.set(REDIRECT_PENDING_KEY, true);
    else safeStorage.remove(REDIRECT_PENDING_KEY);
  },

  isRedirectPending(): boolean {
    return Boolean(safeStorage.get<boolean>(REDIRECT_PENDING_KEY));
  },

  isSessionRestored(): boolean {
    return Boolean(safeStorage.get<boolean>(SESSION_RESTORED_KEY));
  }
};
