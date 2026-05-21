import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 28px 24px;
  animation: ${fadeIn} 0.25s ease both;
`;

export const CardTitle = styled.h1`
  margin: 0 0 6px;
  font-size: 22px;
`;

export const CardSubtitle = styled.p`
  margin: 0 0 20px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;
