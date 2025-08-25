import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireTeamLeader?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireTeamLeader = false 
}: ProtectedRouteProps) => {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  // Debug: Mostrar informações do ProtectedRoute
  console.log('ProtectedRoute:', { 
    user, 
    loading, 
    error, 
    requireAdmin, 
    requireTeamLeader,
    currentPath: location.pathname 
  });

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    console.log('ProtectedRoute: Mostrando loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se houver erro de autenticação, redirecionar para login
  if (error) {
    console.error('ProtectedRoute: Erro de autenticação:', error);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se não há usuário logado, redirecionar para login
  if (!user) {
    console.log('ProtectedRoute: Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar permissões específicas
  if (requireAdmin && user.user_type !== 'admin') {
    console.log('ProtectedRoute: Usuário não é admin, redirecionando para login');
    console.log('ProtectedRoute: Tipo do usuário:', user.user_type);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireTeamLeader && !['admin', 'team_leader'].includes(user.user_type)) {
    console.log('ProtectedRoute: Usuário não tem permissão de líder de equipe, redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Usuário autenticado e com permissões adequadas
  console.log('ProtectedRoute: Usuário autenticado e com permissões, renderizando conteúdo');
  return <>{children}</>;
};
