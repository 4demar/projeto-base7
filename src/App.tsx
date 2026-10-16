import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorModeProvider, useColorMode } from "./contexts/ColorModeContext";
import Layout from "./components/Layout";
import RemindersPage from "./pages/LembreteTodo";
import Ferramentas from "./pages/Ferramentas";
import BannerEditor from "./pages/BannerEditor";
import CadastroTipoOcorrencia from "./pages/CadastroTipoOcorrencia";
import CadastroOcorrencia from "./pages/CadastroOcorrencia";
import OcorrenciasPage from "./pages/Ocorrencias";
import CadastroUsuario from "./pages/CadastroUsuario";
import {
  Build,
  NotificationsActive,
  ViewQuilt,
  Assignment,
  List as ListIcon,
  People,
} from "@mui/icons-material";
import { RegrasFormularioProvider } from "./contexts/RegrasFormularioContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { FormBoletimCadastroProvider } from "./contexts/FormCadastroContext";
import { ControleBoletimProvider } from "./contexts/ControleBoletimContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const menuItems = [
  { text: "Ocorrências", icon: <ListIcon />, path: "/ocorrencias" },
  { text: "Nova Ocorrência", icon: <Assignment />, path: "/cadastro-ocorrencia" },
  { text: "Configuração de Ocorrências", icon: <Build />, path: "/cadastro-tipo" },
  { text: "Usuários", icon: <People />, path: "/usuarios" },
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
                    <Route path="/ocorrencias" element={<OcorrenciasPage />} />
                    <Route path="/cadastro-ocorrencia" element={<CadastroOcorrencia />} />
                    <Route path="/cadastro-tipo" element={<CadastroTipoOcorrencia />} />
                    <Route path="/usuarios" element={<CadastroUsuario />} />
                    <Route path="/ferramentas" element={<Ferramentas />} />
                    <Route path="/lembretes" element={<RemindersPage />} />
                    <Route path="/banner-editor" element={<BannerEditor />} />
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
