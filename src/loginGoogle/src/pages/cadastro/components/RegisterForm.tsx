import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { GoogleIcon } from '@/components/GoogleIcon';

interface Props {
  loading: boolean;
  onSubmit: (name: string, email: string, password: string) => Promise<void> | void;
  onGoogle: () => Promise<void> | void;
  onGoToLogin: () => void;
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

export function RegisterForm({ loading, onSubmit, onGoogle, onGoToLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    try {
      await onSubmit(name, email, password);
    } catch {
      /* erros tratados no provider */
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        Nome
        <Input
          autoComplete="name"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Field>
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
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Field>

      <Button type="submit" $block disabled={loading}>
        {loading ? <Spinner /> : 'Criar conta'}
      </Button>

      <Divider>ou</Divider>

      <Button type="button" $variant="google" $block disabled={loading} onClick={onGoogle}>
        <GoogleIcon /> Continuar com Google
      </Button>

      <Button type="button" $variant="ghost" $block onClick={onGoToLogin}>
        Já tenho uma conta
      </Button>
    </Form>
  );
}
