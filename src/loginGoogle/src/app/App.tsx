import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { theme } from '@/styles/theme';
import { GlobalStyle } from '@/styles/global';
import { AuthProvider } from '@/providers/AuthProvider';
import { AppRoutes } from '@/routes/AppRoutes';
import { InstallPrompt } from '@/components/InstallPrompt';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <InstallPrompt />
          <ToastContainer
            position="top-center"
            autoClose={3500}
            theme="dark"
            newestOnTop
          />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
