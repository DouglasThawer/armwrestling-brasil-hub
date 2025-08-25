import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trophy,
  CheckCircle,
  Clock,
  Mail,
  Users,
  MapPin
} from "lucide-react";

const RegistroSucesso = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-foreground">Armwrestling</h1>
              <p className="text-sm text-muted-foreground -mt-1">Brasil</p>
            </div>
          </div>
        </div>

        <Card className="power-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-6">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <CardTitle className="text-3xl text-green-600 mb-2">
              Equipe Registrada com Sucesso!
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Bem-vindo à comunidade Armwrestling Brasil
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Mensagem de Sucesso */}
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Sua equipe foi registrada e está aguardando aprovação da administração.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-green-800">
                  ✅ <strong>Próximos passos:</strong> Verifique seu e-mail para confirmar a conta e aguarde a aprovação.
                </p>
              </div>
            </div>

            {/* Informações Importantes */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">O que acontece agora?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800">Confirmação por E-mail</h4>
                    <p className="text-sm text-blue-700">Verifique sua caixa de entrada e confirme sua conta</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Aprovação Administrativa</h4>
                    <p className="text-sm text-yellow-700">Nossa equipe revisará seu cadastro em até 48h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <Users className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-800">Acesso ao Sistema</h4>
                    <p className="text-sm text-green-700">Após aprovação, você terá acesso completo</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-800">Aparecer no Mapa</h4>
                    <p className="text-sm text-purple-700">Sua equipe será exibida no mapa interativo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">💡 Dicas para acelerar a aprovação:</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Complete todos os campos obrigatórios</li>
                <li>• Forneça informações verdadeiras e atualizadas</li>
                <li>• Adicione fotos da equipe quando solicitado</li>
                <li>• Responda rapidamente a qualquer solicitação da administração</li>
                <li>• Mantenha suas informações de contato atualizadas</li>
              </ul>
            </div>

            {/* Ações */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-hero text-lg py-3" asChild>
                  <Link to="/login">
                    Fazer Login
                  </Link>
                </Button>
                
                <Button variant="outline" className="text-lg py-3" asChild>
                  <Link to="/">
                    <Trophy className="h-4 w-4 mr-2" />
                    Ir para Página Inicial
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <Button variant="ghost" asChild>
                  <Link to="/mapa">
                    <MapPin className="h-4 w-4 mr-2" />
                    Explorar Mapa das Equipes
                  </Link>
                </Button>
              </div>
            </div>

            {/* Suporte */}
            <div className="text-center pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Precisa de ajuda? Entre em contato conosco
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/contato">
                    <Mail className="h-4 w-4 mr-2" />
                    Contato
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="mailto:suporte@armwrestlingbrasil.com">
                    <Mail className="h-4 w-4 mr-2" />
                    E-mail Direto
                  </a>
                </Button>
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

export default RegistroSucesso;
