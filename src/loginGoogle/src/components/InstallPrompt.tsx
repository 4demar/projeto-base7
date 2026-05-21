import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from './ui/Button';
import { usePlatform } from '@/hooks/usePlatform';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { safeStorage } from '@/utils/storage';

const DISMISS_KEY = 'pwa:install-dismissed';

const Banner = styled.div`
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: calc(12px + env(safe-area-inset-bottom));
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 50;

  strong { display: block; font-size: 14px; }
  small { color: ${({ theme }) => theme.colors.textMuted}; font-size: 12px; }
`;

const Actions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.7);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 60;
  padding: 16px;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 380px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 22px;
  text-align: center;

  h3 { margin: 0 0 6px; }
  p  { margin: 0 0 16px; color: ${({ theme }) => theme.colors.textMuted}; font-size: 14px; }
`;

const Steps = styled.ol`
  text-align: left;
  margin: 0 0 16px;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.text};
`;

const ShareIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16V4" />
    <polyline points="8 8 12 4 16 8" />
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);

export function InstallPrompt() {
  const { isIOS, isAndroid, isStandalone, isSafari } = usePlatform();
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState<boolean>(
    Boolean(safeStorage.get<boolean>(DISMISS_KEY))
  );
  const [iosOpen, setIosOpen] = useState(false);

  useEffect(() => {
    if (isStandalone) setDismissed(true);
  }, [isStandalone]);

  if (isStandalone || dismissed) return null;

  const dismiss = () => {
    safeStorage.set(DISMISS_KEY, true);
    setDismissed(true);
  };

  // ANDROID — beforeinstallprompt nativo
  if (isAndroid && canInstall) {
    return (
      <Banner role="dialog" aria-label="Instalar aplicativo">
        <div>
          <strong>Instalar aplicativo</strong>
          <small>Acesse com um toque pela sua tela de início.</small>
        </div>
        <Actions>
          <Button $variant="ghost" onClick={dismiss}>Agora não</Button>
          <Button onClick={() => promptInstall().then(dismiss)}>Instalar</Button>
        </Actions>
      </Banner>
    );
  }

  // iOS Safari — guia manual
  if (isIOS && isSafari) {
    return (
      <>
        <Banner role="dialog" aria-label="Adicionar à tela de início">
          <div>
            <strong>Adicionar à Tela de Início</strong>
            <small>Instale este app no iPhone em poucos toques.</small>
          </div>
          <Actions>
            <Button $variant="ghost" onClick={dismiss}>Depois</Button>
            <Button onClick={() => setIosOpen(true)}>
              <ShareIcon /> Como instalar
            </Button>
          </Actions>
        </Banner>

        {iosOpen && (
          <ModalBackdrop onClick={() => setIosOpen(false)}>
            <Modal onClick={(e) => e.stopPropagation()}>
              <h3>Instalar no iPhone</h3>
              <p>Use o Safari para adicionar este app à sua tela de início.</p>
              <Steps>
                <li>Toque no botão <strong>Compartilhar</strong> <ShareIcon /></li>
                <li>Selecione <strong>Adicionar à Tela de Início</strong></li>
                <li>Confirme em <strong>Adicionar</strong></li>
              </Steps>
              <Button $block onClick={() => setIosOpen(false)}>Entendi</Button>
            </Modal>
          </ModalBackdrop>
        )}
      </>
    );
  }

  return null;
}
