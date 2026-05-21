import styled from 'styled-components';
import type { ReactNode } from 'react';

const Wrapper = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 32px 16px 100px;
  gap: 16px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Logo = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #6366f1, #22c55e);
`;

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Wrapper>
      <Brand>
        <Logo /> Login Google PWA
      </Brand>
      {children}
    </Wrapper>
  );
}
