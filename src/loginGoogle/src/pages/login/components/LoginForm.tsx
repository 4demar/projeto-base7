import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { GoogleIcon } from '@/components/GoogleIcon';

interface Props {
  loading: boolean;
  onSubmit: (email: string, password: string) => Promise<void> | void;
  onGoogle: () => Promise<void> | void;
  onGoToRegister: () => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  margin: 6px 0;
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

export function LoginForm({ loading, onSubmit, onGoogle, onGoToRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await onSubmit(email, password);
    } catch {
      /* erros tratados no provider */
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        E-mail
        <Input
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>
      <Field>
        Senha
        <Input
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Field>

      <Button type="submit" $block disabled={loading}>
        {loading ? <Spinner /> : 'Entrar'}
      </Button>

      <Divider>ou</Divider>

      <Button type="button" $variant="google" $block disabled={loading} onClick={onGoogle}>
        <GoogleIcon /> Continuar com Google
      </Button>

      <Button type="button" $variant="ghost" $block onClick={onGoToRegister}>
        Criar conta
      </Button>
    </Form>
  );
}
