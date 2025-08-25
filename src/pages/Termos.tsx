import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trophy,
  FileText,
  Shield,
  Users,
  Calendar,
  AlertTriangle
} from "lucide-react";

const Termos = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-foreground">Termos de Uso</h1>
                <p className="text-sm text-muted-foreground -mt-1">Armwrestling Brasil</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Última atualização: 24 de Agosto de 2024
            </p>
          </div>

          <Card className="power-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center">
                <FileText className="h-6 w-6 mr-2" />
                Termos e Condições de Uso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Introdução */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">1. Aceitação dos Termos</h2>
                <p className="text-muted-foreground">
                  Ao acessar e usar a plataforma Armwrestling Brasil, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                  Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
                </p>
              </div>

              {/* Descrição do Serviço */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">2. Descrição do Serviço</h2>
                <p className="text-muted-foreground">
                  A plataforma Armwrestling Brasil é uma comunidade online dedicada ao esporte de luta de braço, oferecendo:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Cadastro e gerenciamento de equipes</li>
                  <li>Mapa interativo de localização de equipes</li>
                  <li>Informações sobre eventos e competições</li>
                  <li>Blog com notícias e artigos sobre armwrestling</li>
                  <li>Sistema de patrocínios e parcerias</li>
                  <li>Comunicação entre membros da comunidade</li>
                </ul>
              </div>

              {/* Elegibilidade */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">3. Elegibilidade</h2>
                <p className="text-muted-foreground">
                  Para usar nossos serviços, você deve:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Ter pelo menos 18 anos de idade</li>
                  <li>Ter capacidade legal para celebrar contratos</li>
                  <li>Fornecer informações verdadeiras e precisas</li>
                  <li>Respeitar as regras da comunidade</li>
                </ul>
              </div>

              {/* Conta do Usuário */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">4. Conta do Usuário</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>4.1 Criação de Conta:</strong> Para acessar certos recursos, você deve criar uma conta fornecendo informações precisas.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>4.2 Responsabilidade da Conta:</strong> Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>4.3 Segurança:</strong> Notifique-nos imediatamente sobre qualquer uso não autorizado de sua conta.
                  </p>
                </div>
              </div>

              {/* Conduta do Usuário */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">5. Conduta do Usuário</h2>
                <p className="text-muted-foreground">
                  Você concorda em não:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Usar o serviço para atividades ilegais ou fraudulentas</li>
                  <li>Publicar conteúdo ofensivo, difamatório ou inadequado</li>
                  <li>Violar direitos de propriedade intelectual</li>
                  <li>Interferir no funcionamento da plataforma</li>
                  <li>Coletar informações de outros usuários sem permissão</li>
                  <li>Usar bots ou scripts automatizados</li>
                </ul>
              </div>

              {/* Conteúdo do Usuário */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">6. Conteúdo do Usuário</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>6.1 Propriedade:</strong> Você mantém a propriedade do conteúdo que enviar, mas nos concede licença para usá-lo na plataforma.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>6.2 Responsabilidade:</strong> Você é responsável pelo conteúdo que publicar e suas consequências.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>6.3 Moderação:</strong> Reservamo-nos o direito de remover conteúdo que viole estes termos.
                  </p>
                </div>
              </div>

              {/* Privacidade */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">7. Privacidade</h2>
                <p className="text-muted-foreground">
                  Sua privacidade é importante para nós. Nossa coleta e uso de informações pessoais são regidos pela nossa 
                  <Link to="/privacidade" className="text-primary hover:underline ml-1">Política de Privacidade</Link>.
                </p>
              </div>

              {/* Propriedade Intelectual */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">8. Propriedade Intelectual</h2>
                <p className="text-muted-foreground">
                  A plataforma e seu conteúdo são protegidos por direitos autorais, marcas registradas e outras leis de propriedade intelectual. 
                  Você não pode copiar, modificar ou distribuir nosso conteúdo sem permissão.
                </p>
              </div>

              {/* Limitação de Responsabilidade */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">9. Limitação de Responsabilidade</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Importante:</p>
                      <p>
                        Em nenhuma circunstância a Armwrestling Brasil será responsável por danos indiretos, incidentais, 
                        especiais ou consequenciais decorrentes do uso de nossos serviços.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modificações */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">10. Modificações dos Termos</h2>
                <p className="text-muted-foreground">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. As mudanças entrarão em vigor 
                  imediatamente após a publicação. Seu uso continuado da plataforma constitui aceitação dos novos termos.
                </p>
              </div>

              {/* Rescisão */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">11. Rescisão</h2>
                <p className="text-muted-foreground">
                  Podemos encerrar ou suspender sua conta a qualquer momento, por qualquer motivo, incluindo violação 
                  destes termos. Você também pode encerrar sua conta a qualquer momento.
                </p>
              </div>

              {/* Lei Aplicável */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">12. Lei Aplicável</h2>
                <p className="text-muted-foreground">
                  Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais brasileiros.
                </p>
              </div>

              {/* Contato */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">13. Contato</h2>
                <p className="text-muted-foreground">
                  Se você tiver dúvidas sobre estes termos, entre em contato conosco através da nossa 
                  <Link to="/contato" className="text-primary hover:underline ml-1">página de contato</Link>.
                </p>
              </div>

              {/* Aviso Legal */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3">⚠️ Aviso Legal</h3>
                <p className="text-sm text-blue-700">
                  Estes termos constituem um acordo legal entre você e a Armwrestling Brasil. 
                  Ao usar nossos serviços, você reconhece que leu, entendeu e concorda com estes termos. 
                  Se você não concordar com qualquer parte, não deve usar nossos serviços.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="text-center mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/">
                  <Trophy className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/privacidade">
                  <Shield className="h-4 w-4 mr-2" />
                  Política de Privacidade
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/contato">
                  <Users className="h-4 w-4 mr-2" />
                  Contato
                </Link>
              </Button>
            </div>
          </div>

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
    </div>
  );
};

export default Termos;
