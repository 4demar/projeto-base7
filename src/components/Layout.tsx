import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemIcon,
    ListItemText, Toolbar, Typography, InputBase, alpha, styled,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useColorMode } from '../contexts/ColorModeContext';

const DRAWER_WIDTH = 300;

const SearchBox = styled('div')(({ theme }) => ({
    position: 'relative', borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.08 : 0.06),
    '&:hover': { backgroundColor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.12 : 0.1) },
    marginLeft: theme.spacing(2), width: 300,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2), height: '100%', position: 'absolute',
    pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit', width: '100%',
    '& .MuiInputBase-input': { padding: theme.spacing(1, 1, 1, 0), paddingLeft: `calc(1em + ${theme.spacing(4)})` },
}));

type ItemMenu = {
    text: string;
    icon: React.ReactNode;
    path: string;
}

type props = {
    menuItems: ItemMenu[]
}

export default function Layout({menuItems}:props) {
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { mode, toggleColorMode } = useColorMode();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton color="inherit" onClick={() => setDrawerOpen(!drawerOpen)} edge="start" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" noWrap sx={{ background: 'linear-gradient(90deg, #6C63FF, #00BFA6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        PortalDev
                    </Typography>
                    <SearchBox>
                        <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                        <StyledInputBase placeholder="Buscar aplicações, ferramentas..." value={search} onChange={(e) => setSearch(e.target.value)}
                            inputProps={{ 'aria-label': 'buscar' }} />
                    </SearchBox>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                        color="inherit"
                        onClick={toggleColorMode}
                        aria-label={mode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                        title={mode === 'dark' ? 'Tema claro' : 'Tema escuro'}
                    >
                        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="temporary" open={drawerOpen} onClose={() => setDrawerOpen(false)}
                sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', mt: '55px' } }}
                ModalProps={{ keepMounted: true }}>
                <List sx={{ pt: 2 }}>
                    {menuItems.map((item) => (
                        <ListItemButton key={item.path} selected={location.pathname === item.path}
                            onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                            sx={{ padding: 1.2, mx: 1, borderRadius: 1, mb: 0.5, '&.Mui-selected': { bgcolor: 'rgba(108,99,255,0.15)', '&:hover': { bgcolor: 'rgba(108,99,255,0.25)' } } }}>
                            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'text.secondary', minWidth: 35 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '65px' }}>
                <Outlet context={{ search }} />
            </Box>
        </Box>
    );
}
