import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DebugPanel } from '@/components/DebugPanel';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from './components/LoginForm';

export function LoginPage() {
  const { user, loading, signInGoogle, signInEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/principal', { replace: true });
  }, [user, navigate]);

  return (
    <AuthLayout>
      <Card>
        <CardTitle>Bem-vindo</CardTitle>
        <CardSubtitle>Acesse sua conta para continuar</CardSubtitle>
        <LoginForm
          loading={loading}
          onSubmit={signInEmail}
          onGoogle={signInGoogle}
          onGoToRegister={() => navigate('/cadastro')}
        />
      </Card>
      <DebugPanel />
    </AuthLayout>
  );
}
