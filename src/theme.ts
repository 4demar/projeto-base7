import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#6C63FF' },
        secondary: { main: '#00BFA6' },
        background: { default: '#0D1117', paper: '#161B22' },
        text: { primary: '#E6EDF3', secondary: '#8B949E' },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiCard: {
            styleOverrides: {
                root: { backgroundImage: 'none', border: '1px solid #30363D' },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: { backgroundColor: '#0D1117', borderRight: '1px solid #30363D' },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 500 },
            },
        },
    },
});
