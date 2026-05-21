import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import { usePlatform } from '@/hooks/usePlatform';
import { AuthLogger, type AuthLogEntry } from '@/auth/AuthLogger';
import { Button } from './ui/Button';

const Wrapper = styled.section`
  width: 100%;
  max-width: 720px;
  margin-top: 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 18px;
  font-size: 13px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  h3 { margin: 0; font-size: 15px; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px 16px;
  margin-bottom: 12px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  span:first-child {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  span:last-child {
    color: ${({ theme }) => theme.colors.text};
    word-break: break-all;
  }
`;

const LogList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow: auto;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
`;

const LogItem = styled.li<{ level: 'info' | 'warn' | 'error' }>`
  padding: 6px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ level, theme }) =>
    level === 'error'
      ? theme.colors.danger
      : level === 'warn'
        ? theme.colors.warning
        : theme.colors.text};
  &:last-child { border-bottom: none; }
`;

export function DebugPanel() {
  const { user, strategy, redirectPending, sessionRestored, lastError } = useAuth();
  const platform = usePlatform();
  const [logs, setLogs] = useState<AuthLogEntry[]>([]);

  useEffect(() => AuthLogger.subscribe(setLogs), []);

  return (
    <Wrapper>
      <Header>
        <h3>Debug de autenticação</h3>
        <Button $variant="ghost" onClick={() => AuthLogger.clear()}>
          Limpar logs
        </Button>
      </Header>

      <Grid>
        <Item><span>Estratégia</span><span>{strategy}</span></Item>
        <Item><span>Plataforma</span><span>{platform.platform}</span></Item>
        <Item><span>Navegador</span><span>{platform.browser}</span></Item>
        <Item><span>Standalone PWA</span><span>{String(platform.isStandalone)}</span></Item>
        <Item><span>Usuário</span><span>{user?.email ?? '—'}</span></Item>
        <Item><span>Provider</span><span>{user?.provider ?? '—'}</span></Item>
        <Item><span>Redirect pendente</span><span>{String(redirectPending)}</span></Item>
        <Item><span>Sessão restaurada</span><span>{String(sessionRestored)}</span></Item>
        <Item><span>URL atual</span><span>{window.location.href}</span></Item>
        <Item>
          <span>Último erro</span>
          <span>{lastError ? `${lastError.code}: ${lastError.message}` : '—'}</span>
        </Item>
      </Grid>

      <LogList>
        {logs.length === 0 && (
          <LogItem level="info">Sem logs ainda…</LogItem>
        )}
        {logs.slice().reverse().map((l, i) => (
          <LogItem key={i} level={l.level}>
            [{new Date(l.ts).toLocaleTimeString()}] [{l.scope}] {l.message}
          </LogItem>
        ))}
      </LogList>
    </Wrapper>
  );
}
