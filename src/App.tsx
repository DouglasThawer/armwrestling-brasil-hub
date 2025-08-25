import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
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

const queryClient = new QueryClient();

// Componente de teste para debug
const TestRoute = ({ path, children }: { path: string; children: React.ReactNode }) => {
  console.log(`App: Renderizando rota ${path}`);
  return <>{children}</>;
};

const App = () => {
  console.log('App: Componente App renderizado');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas de Autenticação */}
            <Route path="/login" element={<TestRoute path="/login"><Login /></TestRoute>} />
            <Route path="/esqueci-senha" element={<TestRoute path="/esqueci-senha"><EsqueciSenha /></TestRoute>} />
            <Route path="/nova-senha" element={<TestRoute path="/nova-senha"><NovaSenha /></TestRoute>} />
            
            {/* Rotas de Registro */}
            <Route path="/registro" element={<TestRoute path="/registro"><Registro /></TestRoute>} />
            <Route path="/registro-sucesso" element={<TestRoute path="/registro-sucesso"><RegistroSucesso /></TestRoute>} />
            
            {/* Rotas Legais */}
            <Route path="/termos" element={<TestRoute path="/termos"><Termos /></TestRoute>} />
            <Route path="/privacidade" element={<TestRoute path="/privacidade"><Privacidade /></TestRoute>} />
            <Route path="/contato" element={<TestRoute path="/contato"><Contato /></TestRoute>} />
            
            {/* Rotas Principais com Layout */}
            <Route path="/" element={<TestRoute path="/"><Layout><Home /></Layout></TestRoute>} />
            <Route path="/mapa" element={<TestRoute path="/mapa"><Layout><MapaInterativo /></Layout></TestRoute>} />
            <Route path="/equipes" element={<TestRoute path="/equipes"><Layout><Equipes /></Layout></TestRoute>} />
            <Route path="/eventos" element={<TestRoute path="/eventos"><Layout><Eventos /></Layout></TestRoute>} />
            <Route path="/patrocinios" element={<TestRoute path="/patrocinios"><Layout><Patrocinios /></Layout></TestRoute>} />
            <Route path="/blog" element={<TestRoute path="/blog"><Layout><Blog /></Layout></TestRoute>} />
            
            {/* Rota Admin Protegida */}
            <Route 
              path="/admin" 
              element={
                <TestRoute path="/admin">
                  <ProtectedRoute requireAdmin>
                    <Layout><Admin /></Layout>
                  </ProtectedRoute>
                </TestRoute>
              } 
            />
            
            {/* Rota Catch-all */}
            <Route path="*" element={<TestRoute path="*"><Layout><NotFound /></Layout></TestRoute>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
