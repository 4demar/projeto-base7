import { AuthService } from '@/auth/AuthService';

export async function loginWithEmail(email: string, password: string): Promise<void> {
  await AuthService.signInEmail(email, password);
}
