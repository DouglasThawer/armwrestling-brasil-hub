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
  Chrome,
  Crown
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

        // Redirecionar para a página de redirecionamento automático
        setTimeout(() => {
          navigate('/redirect');
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
          <p className="text-muted-foreground">Faça login para acessar sua conta</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Entrar na Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulário de Login */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Botão de Login */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90"
                disabled={loading || authLoading}
              >
                {loading || authLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Entrar</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            {/* Botão Google */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>

            {/* Links de Ajuda */}
            <div className="text-center space-y-2">
              <Link
                to="/esqueci-senha"
                className="text-sm text-primary hover:underline block"
              >
                Esqueceu sua senha?
              </Link>
              <div className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/registro" className="text-primary hover:underline">
                  Registre-se
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Teste */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">🔑 Credenciais Padrão</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Admin:</strong> admin@armwrestling.com.br / admin123</p>
            <p><strong>Teste:</strong> teste@armwrestling.com.br / 123456</p>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Use estas credenciais para testar o sistema
          </p>
        </div>

        {/* Botões de Teste */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFormData({
              email: 'admin@armwrestling.com.br',
              password: 'admin123'
            })}
            className="text-xs"
          >
            <Crown className="mr-1 h-3 w-3" />
            Admin
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFormData({
              email: 'teste@armwrestling.com.br',
              password: '123456'
            })}
            className="text-xs"
          >
            <User className="mr-1 h-3 w-3" />
            Teste
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;