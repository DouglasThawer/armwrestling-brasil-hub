import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Trophy,
  User,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Facebook,
  Chrome
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, loading: authLoading, error: authError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Tentando fazer login com:', formData.email);
      console.log('Formulário preenchido:', formData);
      
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        console.log('Login realizado com sucesso:', result.user);
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel...",
        });

        // Redirecionar para o painel admin
        setTimeout(() => {
          console.log('Executando redirecionamento para /admin');
          navigate('/admin');
        }, 1500);
      } else {
        console.error('Erro no login:', result.error);
        toast({
          title: "Erro no login",
          description: result.error || "Credenciais inválidas. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Erro inesperado no login:', error);
      toast({
        title: "Erro no login",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    toast({
      title: "Login com Google",
      description: "Funcionalidade em desenvolvimento. Use o login com email e senha.",
    });
  };

  const runSupabaseTests = async () => {
    toast({
      title: "🧪 Testes",
      description: "Sistema configurado para usar banco local. Testes do Supabase desabilitados.",
    });
  };

  const createAdminUser = async () => {
    toast({
      title: "👤 Usuário Admin",
      description: "Use admin@armwrestling.com.br / admin123 para fazer login",
    });
  };

  const createTestUser = async () => {
    toast({
      title: "👤 Usuário Teste",
      description: "Use teste@armwrestling.com.br / 123456 para fazer login",
    });
  };

  const testNavigation = () => {
    console.log('Testando navegação...');
    try {
      navigate('/admin');
      console.log('Navegação executada com sucesso');
    } catch (error) {
      console.error('Erro na navegação:', error);
    }
  };

  const checkExistingUsers = async () => {
    toast({
      title: "👥 Usuários",
      description: "Sistema configurado para usar banco local. Verifique o console para detalhes.",
    });
  };

  const testClick = () => {
    console.log('Botão clicado!');
    alert('Botão funcionando!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground">Armwrestling</h1>
              <p className="text-sm text-muted-foreground -mt-1">Brasil</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Faça login para acessar sua conta
          </p>
        </div>

        <Card className="power-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar na Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login */}
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full" 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <Chrome className="h-4 w-4 mr-2" />
                Continuar com Google
              </Button>
              <Button variant="outline" className="w-full" type="button" disabled={loading}>
                <Facebook className="h-4 w-4 mr-2" />
                Continuar com Facebook
              </Button>
              
              {/* Botão para criar usuário administrativo */}
              <Button 
                variant="outline" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                type="button"
                onClick={createAdminUser}
                disabled={loading}
              >
                👑 Criar Usuário Admin
              </Button>
              
              {/* Botão para criar usuário de teste */}
              <Button 
                variant="outline" 
                className="w-full" 
                type="button"
                onClick={createTestUser}
                disabled={loading}
              >
                👤 Criar Usuário de Teste
              </Button>
              
                             {/* Botão de teste */}
               <Button 
                 variant="outline" 
                 className="w-full" 
                 type="button"
                 onClick={runSupabaseTests}
                 disabled={loading}
               >
                 🧪 Testar Conexão Supabase
               </Button>
               
               {/* Botão para verificar configuração */}
               <Button 
                 variant="outline" 
                 className="w-full" 
                 type="button"
                 onClick={() => {
                   const config = validateSupabaseConfig();
                   console.log('🔧 Configuração do Supabase:', config);
                   console.log('📋 Informações do Projeto:', PROJECT_INFO);
                   
                   if (config.isValid) {
                     toast({
                       title: "✅ Configuração OK",
                       description: "Todas as configurações estão corretas",
                     });
                   } else {
                     toast({
                       title: "⚠️ Problemas na Configuração",
                       description: config.issues.join(', '),
                       variant: "destructive",
                     });
                   }
                 }}
                 disabled={loading}
               >
                 🔧 Verificar Configuração
               </Button>
              
              {/* Botão para testar navegação */}
              <Button 
                variant="outline" 
                className="w-full" 
                type="button"
                onClick={testNavigation}
                disabled={loading}
              >
                🧭 Testar Navegação
              </Button>
              
              {/* Botão para verificar usuários existentes */}
              <Button 
                variant="outline" 
                className="w-full" 
                type="button"
                onClick={checkExistingUsers}
                disabled={loading}
              >
                🔍 Verificar Usuários
              </Button>
              
              {/* Botão para testar clique */}
              <Button 
                variant="outline" 
                className="w-full" 
                type="button"
                onClick={testClick}
                disabled={loading}
              >
                👆 Testar Clique
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Credenciais Padrão */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">🔑 Credenciais Padrão</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Admin:</strong> admin@armwrestling.com.br / admin123</p>
                <p><strong>Teste:</strong> teste@armwrestling.com.br / 123456</p>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                💡 Clique nos botões acima para criar os usuários automaticamente
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" disabled={loading} />
                  <span className="text-sm text-muted-foreground">Lembrar de mim</span>
                </label>
                <Link to="/esqueci-senha" className="text-sm text-primary hover:text-primary-glow">
                  Esqueci minha senha
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-hero text-lg py-3"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* Register Link */}
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Ainda não tem uma conta?
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/registro">
                    <Trophy className="h-4 w-4 mr-2" />
                    Cadastrar Equipe
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground px-4">
                  Cadastre sua equipe e participe da maior comunidade de armwrestling do Brasil
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2024 Armwrestling Brasil</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/termos" className="hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="hover:text-primary transition-colors">
              Privacidade
            </Link>
            <Link to="/contato" className="hover:text-primary transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;