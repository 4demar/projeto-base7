/**
 * Logger central da camada de autenticação.
 * - Imprime no console com prefixo [auth]
 * - Mantém buffer em memória para o painel de debug
 */
export type AuthLogLevel = 'info' | 'warn' | 'error';

export interface AuthLogEntry {
  ts: number;
  level: AuthLogLevel;
  scope: string;
  message: string;
  data?: unknown;
}

type Listener = (entries: AuthLogEntry[]) => void;

class AuthLoggerImpl {
  private buffer: AuthLogEntry[] = [];
  private listeners = new Set<Listener>();
  private maxEntries = 200;

  private push(entry: AuthLogEntry) {
    this.buffer = [...this.buffer, entry].slice(-this.maxEntries);
    this.listeners.forEach((l) => l(this.buffer));
  }

  info(scope: string, message: string, data?: unknown) {
    const e: AuthLogEntry = { ts: Date.now(), level: 'info', scope, message, data };
    console.log(`[auth][${scope}] ${message}`, data ?? '');
    this.push(e);
  }

  warn(scope: string, message: string, data?: unknown) {
    const e: AuthLogEntry = { ts: Date.now(), level: 'warn', scope, message, data };
    console.warn(`[auth][${scope}] ${message}`, data ?? '');
    this.push(e);
  }

  error(scope: string, message: string, data?: unknown) {
    const e: AuthLogEntry = { ts: Date.now(), level: 'error', scope, message, data };
    console.error(`[auth][${scope}] ${message}`, data ?? '');
    this.push(e);
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.buffer);
    return () => this.listeners.delete(listener);
  }

  getAll(): AuthLogEntry[] {
    return [...this.buffer];
  }

  clear(): void {
    this.buffer = [];
    this.listeners.forEach((l) => l(this.buffer));
  }
}

export const AuthLogger = new AuthLoggerImpl();
