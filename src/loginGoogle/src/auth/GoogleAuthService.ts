import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  type UserCredential
} from 'firebase/auth';
import { firebaseAuth, googleProvider } from '@/database/firebase';
import { isMobile } from '@/utils/platform';
import { AuthLogger } from './AuthLogger';
import { mapAuthError } from './AuthErrorMapper';
import { SessionService } from './SessionService';
import type { AuthStrategy } from '@/types/auth';

export const GoogleAuthService = {
  pickStrategy(): AuthStrategy {
    const strategy: AuthStrategy = isMobile() ? 'redirect' : 'popup';
    AuthLogger.info('GoogleAuthService', `strategy chosen: ${strategy}`, {
      isMobile: isMobile()
    });
    return strategy;
  },

  async signIn(): Promise<UserCredential | null> {
    const strategy = this.pickStrategy();

    if (strategy === 'redirect') {
      AuthLogger.info('GoogleAuthService', 'signInWithRedirect: starting');
      SessionService.markRedirectPending(true);
      try {
        await signInWithRedirect(firebaseAuth, googleProvider);
        // Página será recarregada; nada a retornar
        return null;
      } catch (err) {
        SessionService.markRedirectPending(false);
        const mapped = mapAuthError(err);
        AuthLogger.error('GoogleAuthService', 'signInWithRedirect failed', mapped);
        throw mapped;
      }
    }

    AuthLogger.info('GoogleAuthService', 'signInWithPopup: starting');
    try {
      const cred = await signInWithPopup(firebaseAuth, googleProvider);
      AuthLogger.info('GoogleAuthService', 'signInWithPopup: success', {
        uid: cred.user.uid
      });
      return cred;
    } catch (err) {
      const mapped = mapAuthError(err);
      AuthLogger.error('GoogleAuthService', 'signInWithPopup failed', mapped);

      // Fallback: alguns navegadores bloqueiam popup -> tenta redirect
      if (
        mapped.code === 'auth/popup-blocked' ||
        mapped.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        AuthLogger.warn('GoogleAuthService', 'fallback to redirect');
        SessionService.markRedirectPending(true);
        await signInWithRedirect(firebaseAuth, googleProvider);
        return null;
      }
      throw mapped;
    }
  },

  async resolveRedirect(): Promise<UserCredential | null> {
    AuthLogger.info('GoogleAuthService', 'getRedirectResult: checking');
    try {
      const result = await getRedirectResult(firebaseAuth);
      if (result) {
        AuthLogger.info('GoogleAuthService', 'getRedirectResult: success', {
          uid: result.user.uid,
          email: result.user.email
        });
      } else {
        AuthLogger.info('GoogleAuthService', 'getRedirectResult: no pending redirect');
      }
      SessionService.markRedirectPending(false);
      return result;
    } catch (err) {
      SessionService.markRedirectPending(false);
      const mapped = mapAuthError(err);
      AuthLogger.error('GoogleAuthService', 'getRedirectResult failed', mapped);
      throw mapped;
    }
  }
};
