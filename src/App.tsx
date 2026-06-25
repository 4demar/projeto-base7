import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorModeProvider, useColorMode } from "./contexts/ColorModeContext";
import Layout from "./components/Layout";
import RemindersPage from "./pages/LembreteTodo";
import Ferramentas from "./pages/Ferramentas";
import BannerEditor from "./pages/BannerEditor";
import CadastroTipoOcorrencia from "./pages/CadastroTipoOcorrencia";
import CadastroOcorrencia from "./pages/CadastroOcorrencia";
import {
  Build,
  NotificationsActive,
  ViewQuilt,
  Assignment,
} from "@mui/icons-material";
import { RegrasFormularioProvider } from "./contexts/RegrasFormularioContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { FormBoletimCadastroProvider } from "./contexts/FormCadastroContext";
import { ControleBoletimProvider } from "./contexts/ControleBoletimContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const menuItems = [
  // { text: 'Painel', icon: <Dashboard />, path: '/' },
  { text: "Nova Ocorrência", icon: <Assignment />, path: "/cadastro-ocorrencia"},
  { text: "Configuração de Ocorrências", icon: <Build />, path: "/cadastro-tipo" },
  { text: "Ferramentas", icon: <Build />, path: "/ferramentas" },
  { text: "Lembretes", icon: <NotificationsActive />, path: "/lembretes" },
  { text: "Editor de Banner", icon: <ViewQuilt />, path: "/banner-editor" },
];

export default function App() {
  return (
    <ColorModeProvider>
      <AppContent />
    </ColorModeProvider>
  );
}

function AppContent() {
  const { mode } = useColorMode();
  return (
    <>
      <LoadingProvider>
        <RegrasFormularioProvider>
          <ControleBoletimProvider>
            <FormBoletimCadastroProvider>
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
            </FormBoletimCadastroProvider>
          </ControleBoletimProvider>
        </RegrasFormularioProvider>
        <ToastContainer position="top-right" autoClose={3000} theme={mode} />
      </LoadingProvider>
    </>
  );
}
