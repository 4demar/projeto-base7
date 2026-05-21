/**
 * Wrapper seguro sobre localStorage (Safari iOS pode lançar em modo privado).
 */
export const safeStorage = {
  get<T = unknown>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* noop */
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  }
};
