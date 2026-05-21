import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type UserCredential
} from 'firebase/auth';
import { firebaseAuth } from '@/database/firebase';
import { AuthLogger } from './AuthLogger';
import { mapAuthError } from './AuthErrorMapper';

export const AuthService = {
  async signInEmail(email: string, password: string): Promise<UserCredential> {
    AuthLogger.info('AuthService', 'signInEmail starting', { email });
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      AuthLogger.info('AuthService', 'signInEmail success', { uid: cred.user.uid });
      return cred;
    } catch (err) {
      const mapped = mapAuthError(err);
      AuthLogger.error('AuthService', 'signInEmail failed', mapped);
      throw mapped;
    }
  },

  async signUpEmail(
    name: string,
    email: string,
    password: string
  ): Promise<UserCredential> {
    AuthLogger.info('AuthService', 'signUpEmail starting', { email });
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
      AuthLogger.info('AuthService', 'signUpEmail success', { uid: cred.user.uid });
      return cred;
    } catch (err) {
      const mapped = mapAuthError(err);
      AuthLogger.error('AuthService', 'signUpEmail failed', mapped);
      throw mapped;
    }
  }
};
