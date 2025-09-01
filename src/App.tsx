import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Home from '@/pages/Home';
import Blog from '@/pages/Blog';
import Contato from '@/pages/Contato';
import Equipes from '@/pages/Equipes';
import Eventos from '@/pages/Eventos';
import Login from '@/pages/Login';
import Registro from '@/pages/Registro';
import Patrocinios from '@/pages/Patrocinios';
import MapaInterativo from '@/pages/MapaInterativo';
import Privacidade from '@/pages/Privacidade';
import Termos from '@/pages/Termos';
import NotFound from '@/pages/NotFound';
import EsqueciSenha from '@/pages/EsqueciSenha';
import NovaSenha from '@/pages/NovaSenha';
import RegistroSucesso from '@/pages/RegistroSucesso';
import Admin from '@/pages/Admin';
import RegistroEquipe from '@/pages/RegistroEquipe';
import RegistroPatrocinador from '@/pages/RegistroPatrocinador';
import RegistroUsuario from '@/pages/RegistroUsuario';
import DashboardEquipe from '@/pages/dashboard/DashboardEquipe';
import DashboardPatrocinador from '@/pages/dashboard/DashboardPatrocinador';
import DashboardUsuario from '@/pages/dashboard/DashboardUsuario';
import AuthRedirect from '@/components/auth/AuthRedirect';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/equipes" element={<Equipes />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/patrocinios" element={<Patrocinios />} />
          <Route path="/mapa" element={<MapaInterativo />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/termos" element={<Termos />} />
          
          {/* Rotas de autenticação */}
          <Route path="/auth" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/registro/equipe" element={<RegistroEquipe />} />
          <Route path="/registro/patrocinador" element={<RegistroPatrocinador />} />
          <Route path="/registro/usuario" element={<RegistroUsuario />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/nova-senha" element={<NovaSenha />} />
          <Route path="/registro-sucesso" element={<RegistroSucesso />} />
          
          {/* Rotas protegidas */}
          <Route path="/auth-redirect" element={<AuthRedirect />} />
          
          {/* Dashboard do usuário */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardUsuario />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard de equipe */}
          <Route 
            path="/dashboard/equipe" 
            element={
              <ProtectedRoute requireTeamLeader>
                <DashboardEquipe />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard de patrocinador */}
          <Route 
            path="/dashboard/patrocinador" 
            element={
              <ProtectedRoute>
                <DashboardPatrocinador />
              </ProtectedRoute>
            } 
          />
          
          {/* Painel administrativo */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            } 
          />
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
