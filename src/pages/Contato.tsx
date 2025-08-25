import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trophy,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contato = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    contactMethod: "email"
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular envio de formulário
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Formulário enviado:', formData);
      
      // Salvar no localStorage para demonstração
      const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
      contacts.push({
        ...formData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('contacts', JSON.stringify(contacts));

      setFormSubmitted(true);
      
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });

    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente ou entre em contato por telefone.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">Mensagem Enviada!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Obrigado por entrar em contato conosco, <strong>{formData.name}</strong>!
                </p>
                <p className="text-sm text-muted-foreground">
                  Recebemos sua mensagem e responderemos em breve através do método de contato escolhido.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Dica:</strong> Verifique também sua caixa de spam se escolheu contato por e-mail.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full btn-hero text-lg py-3" asChild>
                  <Link to="/">
                    <Trophy className="h-4 w-4 mr-2" />
                    Voltar ao Início
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contato" onClick={() => setFormSubmitted(false)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Enviar Nova Mensagem
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-foreground">Contato</h1>
                <p className="text-sm text-muted-foreground -mt-1">Armwrestling Brasil</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Entre em contato conosco. Estamos aqui para ajudar!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informações de Contato */}
            <div className="space-y-6">
              <Card className="power-card">
                <CardHeader>
                  <CardTitle className="text-xl">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">E-mail</h4>
                        <p className="text-muted-foreground">contato@armwrestlingbrasil.com</p>
                        <p className="text-sm text-muted-foreground">Suporte: suporte@armwrestlingbrasil.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Telefone</h4>
                        <p className="text-muted-foreground">(11) 99999-9999</p>
                        <p className="text-sm text-muted-foreground">WhatsApp: (11) 99999-9999</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Endereço</h4>
                        <p className="text-muted-foreground">São Paulo, SP - Brasil</p>
                        <p className="text-sm text-muted-foreground">Centro de Treinamento Armwrestling Brasil</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Horário de Atendimento</h4>
                        <p className="text-muted-foreground">Segunda a Sexta: 9h às 18h</p>
                        <p className="text-sm text-muted-foreground">Sábado: 9h às 14h</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">💡 Dicas para um contato mais eficiente:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Descreva detalhadamente sua dúvida ou solicitação</li>
                      <li>• Inclua informações relevantes sobre sua equipe</li>
                      <li>• Especifique o método de contato preferido</li>
                      <li>• Para urgências, use o telefone ou WhatsApp</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Redes Sociais */}
              <Card className="power-card">
                <CardHeader>
                  <CardTitle className="text-xl">Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">Instagram</span>
                      <a href="#" className="text-primary hover:underline">@armwrestlingbrasil</a>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">Facebook</span>
                      <a href="#" className="text-primary hover:underline">Armwrestling Brasil</a>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">YouTube</span>
                      <a href="#" className="text-primary hover:underline">Armwrestling Brasil TV</a>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">LinkedIn</span>
                      <a href="#" className="text-primary hover:underline">Armwrestling Brasil</a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Contato */}
            <Card className="power-card">
              <CardHeader>
                <CardTitle className="text-xl">Envie sua Mensagem</CardTitle>
                <p className="text-muted-foreground">
                  Preencha o formulário abaixo e entraremos em contato em breve.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactMethod">Método de Contato Preferido</Label>
                      <Select value={formData.contactMethod} onValueChange={(value) => handleInputChange('contactMethod', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="phone">Telefone</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto *</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cadastro">Cadastro de Equipe</SelectItem>
                        <SelectItem value="suporte">Suporte Técnico</SelectItem>
                        <SelectItem value="eventos">Eventos e Competições</SelectItem>
                        <SelectItem value="patrocinio">Patrocínios e Parcerias</SelectItem>
                        <SelectItem value="sugestao">Sugestões e Feedback</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva sua dúvida, solicitação ou mensagem..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-hero text-lg py-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </div>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Rápido */}
          <div className="mt-12">
            <Card className="power-card">
              <CardHeader>
                <CardTitle className="text-xl text-center">Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Como cadastrar minha equipe?</h4>
                      <p className="text-sm text-muted-foreground">
                        Acesse a página de <Link to="/registro" className="text-primary hover:underline">cadastro</Link> e siga os passos. 
                        O processo leva alguns minutos e sua equipe será aprovada em até 48h.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Como participar de eventos?</h4>
                      <p className="text-sm text-muted-foreground">
                        Verifique a página de <Link to="/eventos" className="text-primary hover:underline">eventos</Link> e inscreva-se 
                        nos que estiverem abertos para inscrições.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Como se tornar patrocinador?</h4>
                      <p className="text-sm text-muted-foreground">
                        Entre em contato conosco pelo e-mail patrocinios@armwrestlingbrasil.com ou 
                        use o formulário acima selecionando "Patrocínios e Parcerias".
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Problemas técnicos na plataforma?</h4>
                      <p className="text-sm text-muted-foreground">
                        Para suporte técnico, use o formulário acima ou envie um e-mail para 
                        suporte@armwrestlingbrasil.com.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

export default Contato;
