import { GoogleAuthService } from '@/auth/GoogleAuthService';

/**
 * Caso de uso: login com Google.
 * Decide automaticamente popup vs redirect com base na plataforma.
 */
export async function loginWithGoogle(): Promise<void> {
  await GoogleAuthService.signIn();
}
