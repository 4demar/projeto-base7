export const theme = {
  colors: {
    bg: '#0f172a',
    surface: '#111c34',
    surfaceAlt: '#1a2746',
    border: '#243154',
    text: '#e2e8f0',
    textMuted: '#94a3b8',
    primary: '#6366f1',
    primaryHover: '#818cf8',
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b'
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '20px',
    pill: '999px'
  },
  shadows: {
    md: '0 10px 30px rgba(0,0,0,0.35)',
    soft: '0 4px 14px rgba(0,0,0,0.25)'
  },
  fonts: {
    sans: `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
  }
};
export type AppTheme = typeof theme;
