import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div<{ size?: number }>`
  width: ${({ size = 18 }) => size}px;
  height: ${({ size = 18 }) => size}px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: white;
  animation: ${spin} 0.7s linear infinite;
`;

export const FullScreenLoader = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  gap: 12px;
`;
