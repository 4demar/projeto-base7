import styled, { css } from 'styled-components';

type Variant = 'primary' | 'ghost' | 'google' | 'danger';

interface Props {
  $variant?: Variant;
  $block?: boolean;
}

export const Button = styled.button<Props>`
  appearance: none;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.12s ease, background 0.2s ease, opacity 0.2s ease;
  width: ${({ $block }) => ($block ? '100%' : 'auto')};

  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.55; cursor: not-allowed; }

  ${({ $variant = 'primary', theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) { background: ${theme.colors.primaryHover}; }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.text};
          border-color: ${theme.colors.border};
          &:hover:not(:disabled) { background: ${theme.colors.surfaceAlt}; }
        `;
      case 'google':
        return css`
          background: white;
          color: #1f2937;
          &:hover:not(:disabled) { background: #f3f4f6; }
        `;
      case 'danger':
        return css`
          background: ${theme.colors.danger};
          color: white;
        `;
    }
  }}
`;
