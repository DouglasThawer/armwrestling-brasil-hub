import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
}

interface Profile {
  user_type: 'admin' | 'team' | 'sponsor' | 'user';
  is_approved: boolean;
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Buscar perfil do usuário
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type, is_approved')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        toast({
          title: "Erro de autenticação",
          description: "Não foi possível verificar seu perfil. Redirecionando para login.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // Verificar se usuário precisa de aprovação
      if (!profile.is_approved && profile.user_type !== 'user') {
        toast({
          title: "Conta pendente de aprovação",
          description: "Sua conta está aguardando aprovação da administração.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // Redirecionar baseado no tipo de usuário
      switch (profile.user_type) {
        case 'admin':
          navigate('/admin');
          break;
        case 'team':
          navigate('/dashboard-equipe');
          break;
        case 'sponsor':
          navigate('/dashboard-patrocinador');
          break;
        case 'user':
          navigate('/dashboard-usuario');
          break;
        default:
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