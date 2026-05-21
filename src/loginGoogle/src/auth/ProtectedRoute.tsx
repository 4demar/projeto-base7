import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FullScreenLoader, Spinner } from '@/components/ui/Spinner';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <FullScreenLoader>
        <Spinner size={28} />
        <span>Restaurando sessão…</span>
      </FullScreenLoader>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
