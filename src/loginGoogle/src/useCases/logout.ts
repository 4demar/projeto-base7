import { SessionService } from '@/auth/SessionService';

export async function logout(): Promise<void> {
  await SessionService.logout();
}
