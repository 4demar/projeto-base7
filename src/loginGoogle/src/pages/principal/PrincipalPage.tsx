import styled from 'styled-components';
import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DebugPanel } from '@/components/DebugPanel';
import { useAuth } from '@/hooks/useAuth';
import { AuthLogger } from '@/auth/AuthLogger';

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  span:first-child {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  span:last-child { font-size: 15px; }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
`;

export function PrincipalPage() {
  const { user, signOut } = useAuth();

  return (
    <AppLayout>
      <Card>
        <CardTitle>Tela Principal</CardTitle>
        <CardSubtitle>Você está autenticado</CardSubtitle>

        <Row>
          <span>Nome</span>
          <span>{user?.name ?? '—'}</span>
        </Row>
        <Row>
          <span>E-mail</span>
          <span>{user?.email ?? '—'}</span>
        </Row>
        <Row>
          <span>Provider</span>
          <span>{user?.provider ?? '—'}</span>
        </Row>

        <Actions>
          <Button $variant="danger" $block onClick={signOut}>Sair</Button>
          <Button $variant="ghost" $block onClick={() => AuthLogger.clear()}>
            Limpar logs de debug
          </Button>
        </Actions>
      </Card>

      <DebugPanel />
    </AppLayout>
  );
}
