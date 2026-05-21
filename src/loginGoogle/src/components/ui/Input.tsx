import styled from 'styled-components';

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(99,102,241,0.25);
  }
  &::placeholder { color: #5b6680; }
`;
