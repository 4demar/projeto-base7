import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemIcon,
    ListItemText, Toolbar, Typography, InputBase, alpha, styled,
} from '@mui/material';
import {
    Menu as MenuIcon, Build, NotificationsActive, ViewQuilt,
    Search as SearchIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

const SearchBox = styled('div')(({ theme }) => ({
    position: 'relative', borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.08),
    '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.12) },
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

const menuItems = [
    // { text: 'Painel', icon: <Dashboard />, path: '/' },
    { text: 'Ferramentas', icon: <Build />, path: '/ferramentas' },
    { text: 'Lembretes', icon: <NotificationsActive />, path: '/lembretes' },
    { text: 'Editor de Banner', icon: <ViewQuilt />, path: '/banner-editor' },
];

export default function Layout() {
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'background.paper', borderBottom: '1px solid #30363D', boxShadow: 'none' }}>
                <Toolbar>
                    <IconButton color="inherit" onClick={() => setDrawerOpen(!drawerOpen)} edge="start" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ background: 'linear-gradient(90deg, #6C63FF, #00BFA6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        PortalDev
                    </Typography>
                    <SearchBox>
                        <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                        <StyledInputBase placeholder="Buscar aplicações, ferramentas..." value={search} onChange={(e) => setSearch(e.target.value)}
                            inputProps={{ 'aria-label': 'buscar' }} />
                    </SearchBox>
                    <Box sx={{ flexGrow: 1 }} />
                </Toolbar>
            </AppBar>
            <Drawer variant="temporary" open={drawerOpen} onClose={() => setDrawerOpen(false)}
                sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', mt: '64px' } }}
                ModalProps={{ keepMounted: true }}>
                <List sx={{ pt: 2 }}>
                    {menuItems.map((item) => (
                        <ListItemButton key={item.path} selected={location.pathname === item.path}
                            onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                            sx={{ mx: 1, borderRadius: 2, mb: 0.5, '&.Mui-selected': { bgcolor: 'rgba(108,99,255,0.15)', '&:hover': { bgcolor: 'rgba(108,99,255,0.25)' } } }}>
                            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
                <Outlet context={{ search }} />
            </Box>
        </Box>
    );
}
