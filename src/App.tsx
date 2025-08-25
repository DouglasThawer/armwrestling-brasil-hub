import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import MapaInterativo from "./pages/MapaInterativo";
import Equipes from "./pages/Equipes";
import Eventos from "./pages/Eventos";
import Patrocinios from "./pages/Patrocinios";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import EsqueciSenha from "./pages/EsqueciSenha";
import NovaSenha from "./pages/NovaSenha";
import Registro from "./pages/Registro";
import RegistroSucesso from "./pages/RegistroSucesso";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AuthRedirect from "./components/auth/AuthRedirect";
import DashboardEquipe from "./pages/dashboard/DashboardEquipe";
import DashboardPatrocinador from "./pages/dashboard/DashboardPatrocinador";
import DashboardUsuario from "./pages/dashboard/DashboardUsuario";
import RegistroEquipe from "./pages/RegistroEquipe";
import RegistroPatrocinador from "./pages/RegistroPatrocinador";
import RegistroUsuario from "./pages/RegistroUsuario";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rota de redirecionamento automático */}
          <Route path="/redirect" element={<AuthRedirect />} />
          
          {/* Rotas de Autenticação */}
          <Route path="/login" element={<Login />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/nova-senha" element={<NovaSenha />} />
          
          {/* Rotas de Registro */}
          <Route path="/registro" element={<Registro />} />
          <Route path="/registro-equipe" element={<RegistroEquipe />} />
          <Route path="/registro-patrocinador" element={<RegistroPatrocinador />} />
          <Route path="/registro-usuario" element={<RegistroUsuario />} />
          <Route path="/registro-sucesso" element={<RegistroSucesso />} />
          
          {/* Rotas Legais */}
          <Route path="/termos" element={<Termos />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/contato" element={<Contato />} />
          
          {/* Dashboards */}
          <Route path="/admin" element={<Layout><Admin /></Layout>} />
          <Route path="/dashboard-equipe" element={<Layout><DashboardEquipe /></Layout>} />
          <Route path="/dashboard-patrocinador" element={<Layout><DashboardPatrocinador /></Layout>} />
          <Route path="/dashboard-usuario" element={<Layout><DashboardUsuario /></Layout>} />
          
          {/* Rotas Principais com Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/mapa" element={<Layout><MapaInterativo /></Layout>} />
          <Route path="/equipes" element={<Layout><Equipes /></Layout>} />
          <Route path="/eventos" element={<Layout><Eventos /></Layout>} />
          <Route path="/patrocinios" element={<Layout><Patrocinios /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          
          {/* Rota Catch-all */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
