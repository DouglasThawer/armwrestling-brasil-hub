import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Crown, BarChart3, Target, Settings, TrendingUp, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DashboardPatrocinador = () => {
  const [sponsorData, setSponsorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSponsorData();
  }, []);

  const fetchSponsorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: sponsor, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setSponsorData(sponsor);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'ouro': return 'champion';
      case 'prata': return 'muted-foreground';
      case 'bronze': return 'orange-600';
      default: return 'primary';
    }
  };

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case 'ouro': return 'R$ 5.000/mês';
      case 'prata': return 'R$ 2.500/mês';
      case 'bronze': return 'R$ 1.000/mês';
      default: return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel do Patrocinador</h1>
        <p className="text-muted-foreground">Acompanhe o desempenho do seu patrocínio</p>
      </div>

      {!sponsorData ? (
        <Card>
          <CardHeader>
            <CardTitle>Dados do patrocinador não encontrados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Você ainda não completou o cadastro como patrocinador ou está aguardando aprovação.
            </p>
            <Button>Completar Cadastro</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Status do Patrocínio */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={sponsorData.is_approved ? "default" : "secondary"}>
                  {sponsorData.is_approved ? "Ativo" : "Pendente"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plano</CardTitle>
                <Crown className={`h-4 w-4 text-${getPlanColor(sponsorData.plan_type)}`} />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold capitalize">{sponsorData.plan_type}</div>
                <p className="text-xs text-muted-foreground">{getPlanPrice(sponsorData.plan_type)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alcance</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">usuários únicos</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="analytics">Relatórios</TabsTrigger>
              <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Empresa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">Nome da Empresa</h4>
                      <p className="text-muted-foreground">{sponsorData.company_name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Pessoa de Contato</h4>
                      <p className="text-muted-foreground">{sponsorData.contact_person}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Website</h4>
                      <p className="text-muted-foreground">{sponsorData.website || 'Não informado'}</p>
                    </div>
                    {sponsorData.description && (
                      <div>
                        <h4 className="font-semibold mb-1">Descrição</h4>
                        <p className="text-muted-foreground">{sponsorData.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Benefícios do Plano {sponsorData.plan_type.charAt(0).toUpperCase() + sponsorData.plan_type.slice(1)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sponsorData.plan_type === 'bronze' && (
                        <>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                            <span className="text-sm">Logo na página de patrocinadores</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                            <span className="text-sm">Menções mensais</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                            <span className="text-sm">Link no site</span>
                          </div>
                        </>
                      )}
                      {sponsorData.plan_type === 'prata' && (
                        <>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                            <span className="text-sm">Logo no site principal</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                            <span className="text-sm">Patrocínio de eventos regionais</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                            <span className="text-sm">Menções quinzenais</span>
                          </div>
                        </>
                      )}
                      {sponsorData.plan_type === 'ouro' && (
                        <>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-sm">Logo em destaque no site</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-sm">Patrocínio de eventos principais</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-sm">Menções em redes sociais</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Relatórios em desenvolvimento</p>
                    <p className="text-sm text-muted-foreground">
                      Em breve você terá acesso a métricas detalhadas do seu patrocínio
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campanhas Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma campanha ativa</p>
                    <p className="text-sm text-muted-foreground">
                      Entre em contato conosco para criar campanhas personalizadas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Patrocínio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Editar Informações da Empresa
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Crown className="h-4 w-4 mr-2" />
                    Alterar Plano de Patrocínio
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Histórico de Pagamentos
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default DashboardPatrocinador;