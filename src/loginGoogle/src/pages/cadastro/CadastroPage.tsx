import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DebugPanel } from '@/components/DebugPanel';
import { useAuth } from '@/hooks/useAuth';
import { RegisterForm } from './components/RegisterForm';

export function CadastroPage() {
  const { user, loading, signInGoogle, signUpEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/principal', { replace: true });
  }, [user, navigate]);

  return (
    <AuthLayout>
      <Card>
        <CardTitle>Criar sua conta</CardTitle>
        <CardSubtitle>Leva menos de um minuto</CardSubtitle>
        <RegisterForm
          loading={loading}
          onSubmit={signUpEmail}
          onGoogle={signInGoogle}
          onGoToLogin={() => navigate('/login')}
        />
      </Card>
      <DebugPanel />
    </AuthLayout>
  );
}
