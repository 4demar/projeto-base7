import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '@/pages/login/LoginPage';
import { CadastroPage } from '@/pages/cadastro/CadastroPage';
import { PrincipalPage } from '@/pages/principal/PrincipalPage';
import { ProtectedRoute } from '@/auth/ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/principal" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route
        path="/principal"
        element={
          <ProtectedRoute>
            <PrincipalPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/principal" replace />} />
    </Routes>
  );
}
