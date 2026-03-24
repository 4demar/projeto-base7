import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ToolsPage from './pages/ToolsPage';
import AnnotationsPage from './pages/AnnotationsPage';
import RemindersPage from './pages/RemindersPage';
import TarefasPage from './pages/TarefasPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/annotations" element={<AnnotationsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/Tarefas" element={<TarefasPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
