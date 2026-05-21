import styled from 'styled-components';
import type { ReactNode } from 'react';

const Wrapper = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 100px;
  gap: 16px;
`;

export function AppLayout({ children }: { children: ReactNode }) {
  return <Wrapper>{children}</Wrapper>;
}
