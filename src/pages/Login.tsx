import { useState } from "react";
import { Link } from "react-router-dom";
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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de login será implementada com Supabase
    console.log("Login:", formData);
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
              <Button variant="outline" className="w-full" type="button">
                <Chrome className="h-4 w-4 mr-2" />
                Continuar com Google
              </Button>
              <Button variant="outline" className="w-full" type="button">
                <Facebook className="h-4 w-4 mr-2" />
                Continuar com Facebook
              </Button>
            </div>

            <Separator className="my-6" />

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
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-sm text-muted-foreground">Lembrar de mim</span>
                </label>
                <Link to="/esqueci-senha" className="text-sm text-primary hover:text-primary-glow">
                  Esqueci minha senha
                </Link>
              </div>

              <Button type="submit" className="w-full btn-hero text-lg py-3">
                <User className="h-4 w-4 mr-2" />
                Entrar
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