import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { getTheme } from '../styles/theme';

const STORAGE_KEY = 'devportal_color_mode';

interface ColorModeContextValue {
    mode: PaletteMode;
    toggleColorMode: () => void;
    setColorMode: (mode: PaletteMode) => void;
}

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

function loadInitialMode(): PaletteMode {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') return stored;
    } catch {
        /* ignora indisponibilidade do localStorage */
    }
    return 'dark';
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<PaletteMode>(loadInitialMode);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', mode);
    }, [mode]);

    const persist = useCallback((next: PaletteMode) => {
        setMode(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* ignora indisponibilidade do localStorage */
        }
    }, []);

    const value = useMemo<ColorModeContextValue>(
        () => ({
            mode,
            toggleColorMode: () => persist(mode === 'dark' ? 'light' : 'dark'),
            setColorMode: persist,
        }),
        [mode, persist],
    );

    const theme = useMemo(() => getTheme(mode), [mode]);

    return (
        <ColorModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export function useColorMode(): ColorModeContextValue {
    const ctx = useContext(ColorModeContext);
    if (!ctx) {
        throw new Error('useColorMode deve ser usado dentro de ColorModeProvider');
    }
    return ctx;
}
