import { createTheme, type Theme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

const BORDER_DARK = '#30363D';
const BORDER_LIGHT = '#D0D7DE';

// Tokens de cor por modo. Mantidos em sincronia com as CSS variables de global.css.
const tokens = {
    dark: {
        primary: '#6C63FF',
        secondary: '#00BFA6',
        bgDefault: '#0D1117',
        bgPaper: '#161B22',
        textPrimary: '#E6EDF3',
        textSecondary: '#8B949E',
        border: BORDER_DARK,
    },
    light: {
        primary: '#6C63FF',
        secondary: '#00BFA6',
        bgDefault: '#F5F7FA',
        bgPaper: '#FFFFFF',
        textPrimary: '#1F2328',
        textSecondary: '#57606A',
        border: BORDER_LIGHT,
    },
} as const;

export function getTheme(mode: PaletteMode): Theme {
    const isDark = mode === 'dark';
    const t = isDark ? tokens.dark : tokens.light;

    return createTheme({
        palette: {
            mode,
            primary: { main: t.primary },
            secondary: { main: t.secondary },
            background: { default: t.bgDefault, paper: t.bgPaper },
            text: { primary: t.textPrimary, secondary: t.textSecondary },
            divider: t.border,
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
        },
        shape: { borderRadius: 12 },
        components: {
            // Garante que o fundo da página acompanhe o tema.
            MuiCssBaseline: {
                styleOverrides: {
                    body: { backgroundColor: t.bgDefault, color: t.textPrimary },
                },
            },
            // AppBar usa o papel do tema; texto e ícones herdam a cor de texto
            // correta (evita ícones claros / texto branco sobre fundo claro).
            MuiAppBar: {
                defaultProps: { color: 'default' },
                styleOverrides: {
                    root: {
                        backgroundColor: t.bgPaper,
                        color: t.textPrimary,
                        borderBottom: `1px solid ${t.border}`,
                        boxShadow: 'none',
                        backgroundImage: 'none',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: { backgroundImage: 'none', border: `1px solid ${t.border}` },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: t.bgPaper,
                        backgroundImage: 'none',
                        borderRight: `1px solid ${t.border}`,
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { fontWeight: 500 },
                },
            },
        },
    });
}

// Tema padrão (dark) mantido para compatibilidade com imports existentes.
export const theme = getTheme('dark');
