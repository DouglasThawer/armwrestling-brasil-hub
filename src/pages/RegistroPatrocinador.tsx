import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Crown, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RegistroPatrocinador = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Dados básicos
    fullName: "",
    email: "",
    password: "",
    phone: "",
    
    // Dados da empresa
    companyName: "",
    contactPerson: "",
    description: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    planType: "bronze",
    
    // Termos
    acceptTerms: false,
    acceptPrivacy: false
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Criar usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: 'sponsor'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Criar registro do patrocinador
        const { error: sponsorError } = await supabase
          .from('sponsors')
          .insert({
            user_id: authData.user.id,
            company_name: formData.companyName,
            contact_person: formData.contactPerson,
            description: formData.description,
            website: formData.website,
            contact_email: formData.contactEmail,
            contact_phone: formData.contactPhone,
            plan_type: formData.planType,
            is_approved: false
          });

        if (sponsorError) throw sponsorError;

        toast({
          title: "Patrocinador cadastrado com sucesso!",
          description: "Aguarde a aprovação do administrador para ativar sua conta.",
        });

        navigate('/registro-sucesso?type=sponsor');
      }
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível cadastrar o patrocinador.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Login
          </Link>
        </div>

        <Card className="power-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-champion to-champion/80 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Cadastro de Patrocinador</CardTitle>
            <p className="text-muted-foreground">
              Torne-se um patrocinador e apoie o crescimento do armwrestling brasileiro
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados do Responsável */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados do Responsável</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados da Empresa */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados da Empresa</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Pessoa de Contato *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Empresa *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website da Empresa</Label>
                  <Input
                    id="website"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">E-mail de Contato *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Telefone de Contato *</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planType">Plano de Patrocínio *</Label>
                  <Select value={formData.planType} onValueChange={(value) => handleInputChange('planType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bronze">Bronze - R$ 1.000/mês</SelectItem>
                      <SelectItem value="prata">Prata - R$ 2.500/mês</SelectItem>
                      <SelectItem value="ouro">Ouro - R$ 5.000/mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Benefícios do Plano Selecionado */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Benefícios do Plano {formData.planType.charAt(0).toUpperCase() + formData.planType.slice(1)}</h4>
                {formData.planType === 'bronze' && (
                  <ul className="text-sm space-y-1">
                    <li>• Logo na página de patrocinadores</li>
                    <li>• Menções mensais</li>
                    <li>• Link no site</li>
                    <li>• Certificado de apoio</li>
                    <li>• Relatório trimestral</li>
                  </ul>
                )}
                {formData.planType === 'prata' && (
                  <ul className="text-sm space-y-1">
                    <li>• Logo no site principal</li>
                    <li>• Patrocínio de eventos regionais</li>
                    <li>• Menções quinzenais</li>
                    <li>• Espaço em eventos</li>
                    <li>• Newsletter mensal</li>
                    <li>• Acesso aos eventos</li>
                  </ul>
                )}
                {formData.planType === 'ouro' && (
                  <ul className="text-sm space-y-1">
                    <li>• Logo em destaque no site</li>
                    <li>• Patrocínio de eventos principais</li>
                    <li>• Menções em redes sociais</li>
                    <li>• Stand exclusivo em eventos</li>
                    <li>• Direito a naming rights</li>
                    <li>• Relatórios de performance</li>
                    <li>• Acesso VIP aos eventos</li>
                  </ul>
                )}
              </div>

              {/* Termos */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                    required
                  />
                  <Label htmlFor="acceptTerms" className="text-sm">
                    Aceito os <Link to="/termos" className="text-primary hover:underline">Termos de Uso</Link> *
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptPrivacy"
                    checked={formData.acceptPrivacy}
                    onCheckedChange={(checked) => handleInputChange('acceptPrivacy', checked)}
                    required
                  />
                  <Label htmlFor="acceptPrivacy" className="text-sm">
                    Aceito a <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link> *
                  </Label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-hero text-lg py-3"
                disabled={loading || !formData.acceptTerms || !formData.acceptPrivacy}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Cadastrar Patrocinador
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistroPatrocinador;