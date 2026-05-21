import { AuthService } from '@/auth/AuthService';

export async function registerWithEmail(
  name: string,
  email: string,
  password: string
): Promise<void> {
  await AuthService.signUpEmail(name, email, password);
}
