import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Layout from './components/Layout';
import RemindersPage from './pages/LembreteTodo';
import Ferramentas from './pages/Ferramentas';
import BannerEditor from './pages/BannerEditor';
import CadastroTipoOcorrencia from './pages/CadastroTipoOcorrencia';
import CadastroOcorrencia from './pages/CadastroOcorrencia';
import { Build, NotificationsActive, ViewQuilt, Assignment } from '@mui/icons-material';

const menuItems = [
    // { text: 'Painel', icon: <Dashboard />, path: '/' },
    { text: 'Nova Ocorrência', icon: <Assignment />, path: '/cadastro-ocorrencia' },
    { text: 'Configuração de Ocorrências', icon: <Build />, path: '/cadastro-tipo' },
    { text: 'Ferramentas', icon: <Build />, path: '/ferramentas' },
    { text: 'Lembretes', icon: <NotificationsActive />, path: '/lembretes' },
    { text: 'Editor de Banner', icon: <ViewQuilt />, path: '/banner-editor' },
];

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout menuItems={menuItems} />}>
            <Route path="/ferramentas" element={<Ferramentas />} />
            <Route path="/lembretes" element={<RemindersPage />} />
            <Route path="/banner-editor" element={<BannerEditor />} />
            <Route path="/cadastro-tipo" element={<CadastroTipoOcorrencia />} />
            <Route path="/cadastro-ocorrencia" element={<CadastroOcorrencia />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
