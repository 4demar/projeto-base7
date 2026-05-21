import type { User } from 'firebase/auth';
import type { AppUser, AuthProvider } from '@/types/auth';

function detectProvider(user: User): AuthProvider {
  const ids = user.providerData.map((p) => p.providerId);
  if (ids.includes('google.com')) return 'google';
  if (ids.includes('password')) return 'password';
  return 'unknown';
}

export function mapFirebaseUser(user: User | null): AppUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    provider: detectProvider(user)
  };
}
