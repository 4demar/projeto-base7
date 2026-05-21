import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import { AuthContext, type AuthContextValue } from '@/contexts/AuthContext';
import { SessionService } from '@/auth/SessionService';
import { GoogleAuthService } from '@/auth/GoogleAuthService';
import { AuthLogger } from '@/auth/AuthLogger';
import { mapFirebaseUser } from '@/mappers/userMapper';
import { loginWithGoogle } from '@/useCases/loginWithGoogle';
import { loginWithEmail } from '@/useCases/loginWithEmail';
import { registerWithEmail } from '@/useCases/registerWithEmail';
import { logout as logoutUseCase } from '@/useCases/logout';
import type { AppUser, AuthError, AuthStrategy } from '@/types/auth';
import { isMobile, isStandalone } from '@/utils/platform';
import { mapAuthError } from '@/auth/AuthErrorMapper';

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<AuthError | null>(null);
  const [redirectPending, setRedirectPending] = useState<boolean>(
    SessionService.isRedirectPending()
  );
  const [sessionRestored, setSessionRestored] = useState<boolean>(false);

  const strategy: AuthStrategy = useMemo<AuthStrategy>(
    () => (isMobile() ? 'redirect' : 'popup'),
    []
  );

  const bootedRef = useRef(false);

  // Boot: log + getRedirectResult + onAuthStateChanged
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    AuthLogger.info('AuthProvider', 'app boot', {
      url: window.location.href,
      standalone: isStandalone(),
      strategy
    });

    let unsub = () => {};

    (async () => {
      try {
        const result = await GoogleAuthService.resolveRedirect();
        if (result?.user) {
          AuthLogger.info('AuthProvider', 'redirect result restored user', {
            uid: result.user.uid
          });
        }
      } catch (err) {
        const mapped = mapAuthError(err);
        setLastError(mapped);
        toast.error(mapped.message);
      } finally {
        setRedirectPending(SessionService.isRedirectPending());
      }

      unsub = SessionService.observe((fbUser) => {
        const mapped = mapFirebaseUser(fbUser);
        setUser(mapped);
        if (mapped) {
          setSessionRestored(true);
          AuthLogger.info('AuthProvider', 'session restored', { uid: mapped.uid });
        }
        setInitializing(false);
      });
    })();

    return () => unsub();
  }, [strategy]);

  const signInGoogle = useCallback(async () => {
    setLoading(true);
    setLastError(null);
    try {
      await loginWithGoogle();
      // Em mobile (redirect) o navegador sai daqui; em desktop, onAuthStateChanged cuida do resto
    } catch (err) {
      const mapped = err as AuthError;
      setLastError(mapped);
      toast.error(mapped.message ?? 'Falha ao autenticar com Google');
    } finally {
      setLoading(false);
    }
  }, []);

  const signInEmailFn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setLastError(null);
    try {
      await loginWithEmail(email, password);
      toast.success('Login realizado!');
    } catch (err) {
      const mapped = err as AuthError;
      setLastError(mapped);
      toast.error(mapped.message ?? 'Falha no login');
      throw mapped;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUpEmailFn = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      setLastError(null);
      try {
        await registerWithEmail(name, email, password);
        toast.success('Conta criada!');
      } catch (err) {
        const mapped = err as AuthError;
        setLastError(mapped);
        toast.error(mapped.message ?? 'Falha no cadastro');
        throw mapped;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signOutFn = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUseCase();
      toast.info('Sessão encerrada');
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    initializing,
    strategy,
    redirectPending,
    sessionRestored,
    lastError,
    signInGoogle,
    signInEmail: signInEmailFn,
    signUpEmail: signUpEmailFn,
    signOut: signOutFn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
