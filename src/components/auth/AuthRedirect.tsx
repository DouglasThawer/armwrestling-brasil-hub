import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  user_type: 'admin' | 'team_leader' | 'sponsor' | 'user';
  first_name: string;
  last_name: string;
}

const AuthRedirect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkUserAndRedirect();
  }, []);

  const checkUserAndRedirect = async () => {
    try {
      // Buscar usuário do localStorage
      const storedUser = localStorage.getItem('armwrestling_auth_user');
      
      if (!storedUser) {
        console.log('Nenhum usuário encontrado, redirecionando para login');
        navigate('/login');
        return;
      }

      const user: User = JSON.parse(storedUser);
      console.log('Usuário encontrado:', user);

      // Redirecionar baseado no tipo de usuário
      switch (user.user_type) {
        case 'admin':
          console.log('Redirecionando admin para /admin');
          navigate('/admin');
          break;
        case 'team_leader':
          console.log('Redirecionando líder de equipe para /dashboard-equipe');
          navigate('/dashboard-equipe');
          break;
        case 'sponsor':
          console.log('Redirecionando patrocinador para /dashboard-patrocinador');
          navigate('/dashboard-patrocinador');
          break;
        case 'user':
          console.log('Redirecionando usuário para /dashboard-usuario');
          navigate('/dashboard-usuario');
          break;
        default:
          console.log('Tipo de usuário desconhecido, redirecionando para /');
          navigate('/');
          break;
      }
    } catch (error: any) {
      console.error('Erro na verificação de autenticação:', error);
      toast({
        title: "Erro de autenticação",
        description: "Ocorreu um erro ao verificar suas credenciais.",
        variant: "destructive",
      });
      navigate('/login');
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthRedirect;