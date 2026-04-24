import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Layout from './components/Layout';
import RemindersPage from './pages/LembreteTodo';
import Ferramentas from './pages/Ferramentas';
import BannerEditor from './pages/BannerEditor';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/ferramentas" element={<Ferramentas />} />
            <Route path="/lembretes" element={<RemindersPage />} />
            <Route path="/banner-editor" element={<BannerEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
