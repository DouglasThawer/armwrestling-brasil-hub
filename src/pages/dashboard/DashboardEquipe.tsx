import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Settings, Plus, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DashboardEquipe = () => {
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: team, error } = await supabase
        .from('teams')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setTeamData(team);
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
        <h1 className="text-3xl font-bold mb-2">Painel da Equipe</h1>
        <p className="text-muted-foreground">Gerencie sua equipe e atletas</p>
      </div>

      {!teamData ? (
        <Card>
          <CardHeader>
            <CardTitle>Equipe não encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Você ainda não completou o cadastro da sua equipe ou está aguardando aprovação.
            </p>
            <Button>Completar Cadastro</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Status da Equipe */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status da Equipe</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={teamData.is_approved ? "default" : "secondary"}>
                  {teamData.is_approved ? "Aprovada" : "Aguardando Aprovação"}
                </Badge>
                {!teamData.is_approved && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Sua equipe está sendo analisada pela administração
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atletas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">atletas cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">eventos participados</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="athletes">Atletas</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Equipe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-1">Nome</h4>
                      <p className="text-muted-foreground">{teamData.name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Localização</h4>
                      <p className="text-muted-foreground">{teamData.city}, {teamData.state}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Técnico</h4>
                      <p className="text-muted-foreground">{teamData.coach_name || 'Não informado'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Horários de Treino</h4>
                      <p className="text-muted-foreground">{teamData.training_hours || 'Não informado'}</p>
                    </div>
                  </div>
                  
                  {teamData.description && (
                    <div>
                      <h4 className="font-semibold mb-1">Descrição</h4>
                      <p className="text-muted-foreground">{teamData.description}</p>
                    </div>
                  )}
                  
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Informações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="athletes" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Atletas da Equipe</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Atleta
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum atleta cadastrado ainda</p>
                    <p className="text-sm text-muted-foreground">
                      Comece adicionando os atletas da sua equipe
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Eventos e Competições</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Evento
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum evento encontrado</p>
                    <p className="text-sm text-muted-foreground">
                      Participe ou organize eventos da sua região
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Equipe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Editar Informações Básicas
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Membros
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Trophy className="h-4 w-4 mr-2" />
                    Configurações de Privacidade
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

export default DashboardEquipe;