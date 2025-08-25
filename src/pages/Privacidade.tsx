import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trophy,
  Shield,
  Eye,
  Lock,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const Privacidade = () => {
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
                <h1 className="text-3xl font-bold text-foreground">Política de Privacidade</h1>
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
                <Shield className="h-6 w-6 mr-2" />
                Proteção de Dados e Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Introdução */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">1. Introdução</h2>
                <p className="text-muted-foreground">
                  A Armwrestling Brasil está comprometida em proteger sua privacidade e dados pessoais. 
                  Esta política descreve como coletamos, usamos, armazenamos e protegemos suas informações 
                  quando você usa nossa plataforma.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    🔒 <strong>Compromisso:</strong> Sua privacidade é fundamental para nós. 
                    Trabalhamos continuamente para garantir a segurança e confidencialidade de seus dados.
                  </p>
                </div>
              </div>

              {/* Informações Coletadas */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">2. Informações que Coletamos</h2>
                
                <h3 className="text-lg font-medium">2.1 Informações Fornecidas por Você</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Dados de Conta:</strong> Nome, e-mail, senha, telefone</li>
                  <li><strong>Dados da Equipe:</strong> Nome da equipe, descrição, categoria, nível</li>
                  <li><strong>Informações de Localização:</strong> Endereço, cidade, estado</li>
                  <li><strong>Dados de Contato:</strong> Telefone, e-mail, redes sociais</li>
                  <li><strong>Conteúdo:</strong> Posts, comentários, fotos, vídeos</li>
                </ul>

                <h3 className="text-lg font-medium">2.2 Informações Coletadas Automaticamente</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Dados de Uso:</strong> Páginas visitadas, tempo de permanência, cliques</li>
                  <li><strong>Informações Técnicas:</strong> IP, navegador, dispositivo, sistema operacional</li>
                  <li><strong>Cookies:</strong> Para melhorar sua experiência e funcionalidade</li>
                  <li><strong>Logs:</strong> Para segurança e análise de performance</li>
                </ul>
              </div>

              {/* Como Usamos */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">3. Como Usamos Suas Informações</h2>
                <p className="text-muted-foreground">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Fornecer e manter nossos serviços</li>
                  <li>Processar seu cadastro e gerenciar sua conta</li>
                  <li>Comunicar-se com você sobre eventos e atualizações</li>
                  <li>Melhorar nossa plataforma e experiência do usuário</li>
                  <li>Garantir a segurança e prevenir fraudes</li>
                  <li>Cumprir obrigações legais</li>
                  <li>Enviar newsletters e marketing (com seu consentimento)</li>
                </ul>
              </div>

              {/* Compartilhamento */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">4. Compartilhamento de Informações</h2>
                <p className="text-muted-foreground">
                  <strong>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros</strong>, 
                  exceto nas seguintes situações:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Com seu consentimento explícito</strong></li>
                  <li><strong>Para prestadores de serviços</strong> que nos ajudam a operar a plataforma</li>
                  <li><strong>Para cumprir obrigações legais</strong> ou responder a processos judiciais</li>
                  <li><strong>Para proteger nossos direitos</strong> e segurança da comunidade</li>
                  <li><strong>Em caso de fusão ou aquisição</strong> da empresa</li>
                </ul>
              </div>

              {/* Segurança */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">5. Segurança dos Dados</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                      <Lock className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-800">Criptografia</h4>
                        <p className="text-sm text-green-700">Dados transmitidos e armazenados com criptografia SSL/TLS</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-800">Controle de Acesso</h4>
                        <p className="text-sm text-blue-700">Acesso restrito apenas a funcionários autorizados</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                      <Eye className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-purple-800">Monitoramento</h4>
                        <p className="text-sm text-purple-700">Sistemas de detecção de intrusão e monitoramento</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Backups</h4>
                        <p className="text-sm text-yellow-700">Backups regulares e seguros dos dados</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">6. Cookies e Tecnologias Similares</h2>
                <p className="text-muted-foreground">
                  Utilizamos cookies e tecnologias similares para:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Manter você logado em sua conta</li>
                  <li>Lembrar suas preferências e configurações</li>
                  <li>Analisar o uso da plataforma</li>
                  <li>Personalizar conteúdo e anúncios</li>
                  <li>Melhorar a funcionalidade e performance</li>
                </ul>
                <p className="text-muted-foreground">
                  Você pode controlar o uso de cookies através das configurações do seu navegador.
                </p>
              </div>

              {/* Seus Direitos */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">7. Seus Direitos</h2>
                <p className="text-muted-foreground">
                  Você tem os seguintes direitos relacionados aos seus dados pessoais:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Acesso:</strong> Solicitar uma cópia dos dados que temos sobre você</li>
                  <li><strong>Correção:</strong> Solicitar correção de dados incorretos ou incompletos</li>
                  <li><strong>Exclusão:</strong> Solicitar a remoção de seus dados pessoais</li>
                  <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                  <li><strong>Restrição:</strong> Limitar como usamos seus dados</li>
                  <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados</li>
                  <li><strong>Retirada de Consentimento:</strong> Revogar consentimentos dados</li>
                </ul>
              </div>

              {/* Retenção */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">8. Retenção de Dados</h2>
                <p className="text-muted-foreground">
                  Mantemos suas informações pessoais apenas pelo tempo necessário para:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Fornecer nossos serviços</li>
                  <li>Cumprir obrigações legais</li>
                  <li>Resolver disputas</li>
                  <li>Fazer cumprir nossos acordos</li>
                </ul>
                <p className="text-muted-foreground">
                  Quando não precisarmos mais de suas informações, as excluímos de forma segura.
                </p>
              </div>

              {/* Transferências */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">9. Transferências Internacionais</h2>
                <p className="text-muted-foreground">
                  Suas informações podem ser transferidas e processadas em países diferentes do seu. 
                  Quando isso acontecer, garantimos que:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>As transferências são feitas de acordo com a lei</li>
                  <li>Implementamos medidas de segurança adequadas</li>
                  <li>Os dados são protegidos com o mesmo nível de segurança</li>
                </ul>
              </div>

              {/* Menores de Idade */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">10. Menores de Idade</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Importante:</p>
                      <p>
                        Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente 
                        informações pessoais de menores. Se você é menor de idade, não use nossos serviços.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alterações */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">11. Alterações nesta Política</h2>
                <p className="text-muted-foreground">
                  Podemos atualizar esta política periodicamente. Quando fizermos alterações significativas:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Notificaremos você por e-mail</li>
                  <li>Publicaremos um aviso na plataforma</li>
                  <li>Atualizaremos a data de "última atualização"</li>
                </ul>
                <p className="text-muted-foreground">
                  Seu uso continuado da plataforma após as mudanças constitui aceitação da nova política.
                </p>
              </div>

              {/* Contato */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">12. Entre em Contato</h2>
                <p className="text-muted-foreground">
                  Se você tiver dúvidas sobre esta política ou sobre como tratamos seus dados, entre em contato:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>E-mail:</strong> privacidade@armwrestlingbrasil.com</p>
                    <p><strong>Telefone:</strong> (11) 99999-9999</p>
                    <p><strong>Endereço:</strong> São Paulo, SP - Brasil</p>
                    <p><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</p>
                  </div>
                </div>
              </div>

              {/* Aviso Final */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-3">✅ Compromisso com a Privacidade</h3>
                <p className="text-sm text-green-700">
                  Na Armwrestling Brasil, sua privacidade é nossa prioridade. Trabalhamos continuamente 
                  para garantir que suas informações pessoais sejam tratadas com o máximo de segurança e respeito. 
                  Se você tiver qualquer preocupação, não hesite em nos contatar.
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
                <Link to="/termos">
                  <FileText className="h-4 w-4 mr-2" />
                  Termos de Uso
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

export default Privacidade;
