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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/mapa" element={<Layout><MapaInterativo /></Layout>} />
          <Route path="/equipes" element={<Layout><Equipes /></Layout>} />
          <Route path="/eventos" element={<Layout><Eventos /></Layout>} />
          <Route path="/patrocinios" element={<Layout><Patrocinios /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
