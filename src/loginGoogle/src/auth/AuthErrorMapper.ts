import type { AuthError } from '@/types/auth';

const MESSAGES: Record<string, string> = {
  'auth/popup-blocked': 'O navegador bloqueou a janela popup. Tente novamente ou usaremos redirect.',
  'auth/popup-closed-by-user': 'A janela de login foi fechada antes de concluir.',
  'auth/cancelled-popup-request': 'Outra janela de login já estava aberta.',
  'auth/operation-not-supported-in-this-environment':
    'Este ambiente não suporta popup. Tentando via redirect.',
  'auth/network-request-failed': 'Falha de rede. Verifique sua conexão.',
  'auth/invalid-credential': 'E-mail ou senha inválidos.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/email-already-in-use': 'Este e-mail já está em uso.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/unauthorized-domain':
    'Domínio não autorizado no Firebase. Verifique Authorized Domains.',
  'auth/invalid-api-key': 'Chave de API do Firebase inválida.',
  'auth/account-exists-with-different-credential':
    'Já existe uma conta com este e-mail usando outro provedor.'
};

export function mapAuthError(err: unknown): AuthError {
  const e = err as { code?: string; message?: string };
  const code = e?.code ?? 'auth/unknown';
  const message = MESSAGES[code] ?? e?.message ?? 'Erro desconhecido na autenticação.';
  return { code, message, raw: err };
}
