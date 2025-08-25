import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Trophy,
  Users,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Globe,
  Eye,
  EyeOff,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserService } from "@/services/userService";
import { TeamService } from "@/services/teamService";

const Registro = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Dados da equipe
    teamName: "",
    teamDescription: "",
    teamCategory: "",
    teamLevel: "",
    teamAddress: "",
    teamCity: "",
    teamState: "",
    teamPhone: "",
    teamEmail: "",
    teamWebsite: "",
    teamInstagram: "",
    teamFacebook: "",
    
    // Dados do responsável
    responsibleName: "",
    responsibleEmail: "",
    responsiblePhone: "",
    responsiblePassword: "",
    responsibleConfirmPassword: "",
    
    // Dados de treino
    trainingSchedule: "",
    trainingAddress: "",
    maxMembers: "",
    
    // Termos
    acceptTerms: false,
    acceptPrivacy: false,
    acceptNewsletter: false
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return formData.teamName && formData.teamDescription && formData.teamCategory && formData.teamLevel;
      case 2:
        return formData.teamAddress && formData.teamCity && formData.teamState && formData.teamPhone;
      case 3:
        return formData.responsibleName && formData.responsibleEmail && formData.responsiblePassword && 
               formData.responsibleConfirmPassword && formData.responsiblePassword === formData.responsibleConfirmPassword;
      case 4:
        return formData.acceptTerms && formData.acceptPrivacy;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios para continuar.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      toast({
        title: "Validação falhou",
        description: "Verifique se todos os campos obrigatórios estão preenchidos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Criar usuário responsável
      const userData = {
        email: formData.responsibleEmail,
        password: formData.responsiblePassword,
        first_name: formData.responsibleName.split(' ')[0] || formData.responsibleName,
        last_name: formData.responsibleName.split(' ').slice(1).join(' ') || formData.responsibleName,
        user_type: 'team_leader' as const,
        phone: formData.responsiblePhone,
      };

      const userResult = await UserService.createUser(userData);
      console.log('Usuário responsável criado:', userResult);

      if (!userResult.user) {
        throw new Error('Usuário responsável não foi criado');
      }

      // 2. Criar perfil da equipe
      const teamData = {
        name: formData.teamName,
        description: formData.teamDescription,
        category: formData.teamCategory as any,
        level: formData.teamLevel as any,
        address: formData.teamAddress,
        city: formData.teamCity,
        state: formData.teamState,
        phone: formData.teamPhone,
        email: formData.teamEmail,
        website: formData.teamWebsite || undefined,
        instagram: formData.teamInstagram || undefined,
        facebook: formData.teamFacebook || undefined,
        training_schedule: formData.trainingSchedule,
        training_address: formData.trainingAddress,
        max_members: parseInt(formData.maxMembers) || 20,
        responsible_user_id: userResult.user.id,
      };

      const teamResult = await TeamService.createTeam(teamData);
      console.log('Equipe criada:', teamResult);

      // Salvar dados no localStorage para referência
      localStorage.setItem('teamProfile', JSON.stringify(teamResult));
      localStorage.setItem('pendingTeam', JSON.stringify({
        ...teamResult,
        user: userResult.user
      }));

      toast({
        title: "Equipe registrada com sucesso!",
        description: "Aguarde a aprovação da administração para ativar sua conta.",
      });

      // Redirecionar para página de sucesso
      setTimeout(() => {
        navigate('/registro-sucesso');
      }, 2000);

    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      let errorMessage = "Não foi possível registrar a equipe.";
      
      if (error.message) {
        if (error.message.includes('already registered')) {
          errorMessage = "Este e-mail já está cadastrado. Use outro e-mail ou faça login.";
        } else if (error.message.includes('password')) {
          errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres.";
        } else if (error.message.includes('email')) {
          errorMessage = "Formato de e-mail inválido.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erro no registro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="teamName">Nome da Equipe *</Label>
          <Input
            id="teamName"
            placeholder="Ex: Força Total SP"
            value={formData.teamName}
            onChange={(e) => handleInputChange('teamName', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamDescription">Descrição da Equipe *</Label>
          <Textarea
            id="teamDescription"
            placeholder="Conte um pouco sobre sua equipe, história, objetivos..."
            value={formData.teamDescription}
            onChange={(e) => handleInputChange('teamDescription', e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teamCategory">Categoria *</Label>
            <Select value={formData.teamCategory} onValueChange={(value) => handleInputChange('teamCategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amador">Amador</SelectItem>
                <SelectItem value="profissional">Profissional</SelectItem>
                <SelectItem value="misto">Misto</SelectItem>
                <SelectItem value="juvenil">Juvenil</SelectItem>
                <SelectItem value="master">Master</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamLevel">Nível *</Label>
            <Select value={formData.teamLevel} onValueChange={(value) => handleInputChange('teamLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iniciante">Iniciante</SelectItem>
                <SelectItem value="intermediario">Intermediário</SelectItem>
                <SelectItem value="avancado">Avançado</SelectItem>
                <SelectItem value="elite">Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={nextStep} disabled={!validateStep(1)}>
          Próximo
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="teamAddress">Endereço da Equipe *</Label>
          <Input
            id="teamAddress"
            placeholder="Rua, número, bairro"
            value={formData.teamAddress}
            onChange={(e) => handleInputChange('teamAddress', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teamCity">Cidade *</Label>
            <Input
              id="teamCity"
              placeholder="Nome da cidade"
              value={formData.teamCity}
              onChange={(e) => handleInputChange('teamCity', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamState">Estado *</Label>
            <Select value={formData.teamState} onValueChange={(value) => handleInputChange('teamState', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {[
                  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
                  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
                  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
                ].map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamPhone">Telefone da Equipe *</Label>
          <Input
            id="teamPhone"
            placeholder="(11) 99999-9999"
            value={formData.teamPhone}
            onChange={(e) => handleInputChange('teamPhone', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamEmail">E-mail da Equipe</Label>
          <Input
            id="teamEmail"
            type="email"
            placeholder="equipe@exemplo.com"
            value={formData.teamEmail}
            onChange={(e) => handleInputChange('teamEmail', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teamWebsite">Website</Label>
            <Input
              id="teamWebsite"
              placeholder="https://exemplo.com"
              value={formData.teamWebsite}
              onChange={(e) => handleInputChange('teamWebsite', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamInstagram">Instagram</Label>
            <Input
              id="teamInstagram"
              placeholder="@equipe"
              value={formData.teamInstagram}
              onChange={(e) => handleInputChange('teamInstagram', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamFacebook">Facebook</Label>
            <Input
              id="teamFacebook"
              placeholder="Nome da página"
              value={formData.teamFacebook}
              onChange={(e) => handleInputChange('teamFacebook', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Anterior
        </Button>
        <Button onClick={nextStep} disabled={!validateStep(2)}>
          Próximo
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="responsibleName">Nome Completo do Responsável *</Label>
          <Input
            id="responsibleName"
            placeholder="Seu nome completo"
            value={formData.responsibleName}
            onChange={(e) => handleInputChange('responsibleName', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="responsibleEmail">E-mail *</Label>
            <Input
              id="responsibleEmail"
              type="email"
              placeholder="seu@email.com"
              value={formData.responsibleEmail}
              onChange={(e) => handleInputChange('responsibleEmail', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsiblePhone">Telefone *</Label>
            <Input
              id="responsiblePhone"
              placeholder="(11) 99999-9999"
              value={formData.responsiblePhone}
              onChange={(e) => handleInputChange('responsiblePhone', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="responsiblePassword">Senha *</Label>
            <div className="relative">
              <Input
                id="responsiblePassword"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={formData.responsiblePassword}
                onChange={(e) => handleInputChange('responsiblePassword', e.target.value)}
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibleConfirmPassword">Confirmar Senha *</Label>
            <div className="relative">
              <Input
                id="responsibleConfirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                value={formData.responsibleConfirmPassword}
                onChange={(e) => handleInputChange('responsibleConfirmPassword', e.target.value)}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trainingSchedule">Horário de Treino</Label>
            <Input
              id="trainingSchedule"
              placeholder="Ex: Segunda e Quarta, 19h às 21h"
              value={formData.trainingSchedule}
              onChange={(e) => handleInputChange('trainingSchedule', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxMembers">Máximo de Membros</Label>
            <Input
              id="maxMembers"
              type="number"
              placeholder="20"
              value={formData.maxMembers}
              onChange={(e) => handleInputChange('maxMembers', e.target.value)}
              min="1"
              max="100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Anterior
        </Button>
        <Button onClick={nextStep} disabled={!validateStep(3)}>
          Próximo
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">📋 Resumo do Cadastro</h4>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>Equipe:</strong> {formData.teamName}</p>
            <p><strong>Categoria:</strong> {formData.teamCategory}</p>
            <p><strong>Nível:</strong> {formData.teamLevel}</p>
            <p><strong>Local:</strong> {formData.teamCity} - {formData.teamState}</p>
            <p><strong>Responsável:</strong> {formData.responsibleName}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
              className="mt-1"
              required
            />
            <label htmlFor="acceptTerms" className="text-sm">
              Li e aceito os <Link to="/termos" className="text-primary hover:underline">Termos de Uso</Link> *
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="acceptPrivacy"
              checked={formData.acceptPrivacy}
              onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
              className="mt-1"
              required
            />
            <label htmlFor="acceptPrivacy" className="text-sm">
              Li e aceito a <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link> *
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="acceptNewsletter"
              checked={formData.acceptNewsletter}
              onChange={(e) => handleInputChange('acceptNewsletter', e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="acceptNewsletter" className="text-sm">
              Desejo receber notícias e atualizações sobre eventos e competições
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Anterior
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!validateStep(4) || loading}
          className="btn-hero"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Registrando...
            </div>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Finalizar Cadastro
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: "Informações da Equipe", icon: Trophy },
    { number: 2, title: "Localização e Contato", icon: MapPin },
    { number: 3, title: "Dados do Responsável", icon: Users },
    { number: 4, title: "Confirmação", icon: CheckCircle }
  ];

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
                <h1 className="text-3xl font-bold text-foreground">Cadastrar Equipe</h1>
                <p className="text-muted-foreground -mt-1">Junte-se à comunidade</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Cadastre sua equipe e participe da maior comunidade de armwrestling do Brasil
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => (
                <div key={stepItem.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step >= stepItem.number 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    {step > stepItem.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <stepItem.icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      step > stepItem.number ? 'bg-primary' : 'bg-muted-foreground'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              {steps.map((stepItem) => (
                <span
                  key={stepItem.number}
                  className={`text-sm ${
                    step >= stepItem.number ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {stepItem.title}
                </span>
              ))}
            </div>
          </div>

          {/* Form */}
          <Card className="power-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {steps[step - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Já tem uma conta? <Link to="/login" className="text-primary hover:underline">Faça login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
