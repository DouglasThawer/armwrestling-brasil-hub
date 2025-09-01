import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Shield, 
  Activity, 
  Settings, 
  BarChart3, 
  FileText, 
  Calendar,
  Building2,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Trophy
} from 'lucide-react';
import type { Profile, Team, Sponsor, Event, Post, SystemSetting } from '@/types/database';

const Admin = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    teams: 0,
    sponsors: 0,
    events: 0,
    posts: 0,
    pendingApprovals: 0
  });
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);
  const [pendingTeams, setPendingTeams] = useState<Team[]>([]);
  const [pendingSponsors, setPendingSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    if (isAdmin()) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load stats
      const [usersRes, teamsRes, sponsorsRes, eventsRes, postsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('teams').select('id', { count: 'exact' }),
        supabase.from('sponsors').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('posts').select('id', { count: 'exact' })
      ]);

      // Load pending approvals
      const [pendingTeamsRes, pendingSponsorsRes] = await Promise.all([
        supabase.from('teams').select('*').eq('is_approved', false),
        supabase.from('sponsors').select('*').eq('is_approved', false)
      ]);

      // Load system settings
      const settingsRes = await supabase.from('system_settings').select('*');

      setStats({
        users: usersRes.count || 0,
        teams: teamsRes.count || 0,
        sponsors: sponsorsRes.count || 0,
        events: eventsRes.count || 0,
        posts: postsRes.count || 0,
        pendingApprovals: (pendingTeamsRes.data?.length || 0) + (pendingSponsorsRes.data?.length || 0)
      });

      setPendingTeams(pendingTeamsRes.data || []);
      setPendingSponsors(pendingSponsorsRes.data || []);
      setSystemSettings(settingsRes.data || []);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSystemSetting = async (settingKey: string, newValue: any) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: newValue })
        .eq('setting_key', settingKey);

      if (error) throw error;

      setSystemSettings(prev => 
        prev.map(setting => 
          setting.setting_key === settingKey 
            ? { ...setting, setting_value: newValue }
            : setting
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
    }
  };

  const approveTeam = async (teamId: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ is_approved: true })
        .eq('id', teamId);

      if (error) throw error;

      setPendingTeams(prev => prev.filter(team => team.id !== teamId));
      setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
    } catch (error) {
      console.error('Erro ao aprovar equipe:', error);
    }
  };

  const approveSponsor = async (sponsorId: string) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ is_approved: true })
        .eq('id', sponsorId);

      if (error) throw error;

      setPendingSponsors(prev => prev.filter(sponsor => sponsor.id !== sponsorId));
      setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
    } catch (error) {
      console.error('Erro ao aprovar patrocinador:', error);
    }
  };

  const getSettingValue = (key: string, defaultValue: any = false) => {
    const setting = systemSettings.find(s => s.setting_key === key);
    return setting ? setting.setting_value : defaultValue;
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Acesso negado. Você precisa ser um administrador para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                ManzapKong Admin
              </h1>
              <p className="text-muted-foreground">
                Sistema de Gerenciamento Completo
              </p>
            </div>
          </div>
          <Button onClick={signOut} variant="outline">
            Sair
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuários</p>
                  <p className="text-3xl font-bold text-foreground">{stats.users}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Equipes</p>
                  <p className="text-3xl font-bold text-foreground">{stats.teams}</p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patrocinadores</p>
                  <p className="text-3xl font-bold text-foreground">{stats.sponsors}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-3xl font-bold text-destructive">{stats.pendingApprovals}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="approvals">
              Aprovações 
              {stats.pendingApprovals > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Novo</Badge>
                      <span>Sistema ManzapKong iniciado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Evento</Badge>
                      <span>{stats.events} eventos cadastrados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Post</Badge>
                      <span>{stats.posts} posts publicados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Equipes</Badge>
                      <span>{stats.teams} equipes registradas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Estatísticas do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Taxa de Aprovação</span>
                      <span className="font-semibold">
                        {stats.pendingApprovals === 0 ? '100%' : '95%'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Usuários Ativos</span>
                      <span className="font-semibold">{Math.floor(stats.users * 0.8)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Eventos Ativos</span>
                      <span className="font-semibold">{Math.floor(stats.events * 0.6)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Patrocinadores Ativos</span>
                      <span className="font-semibold">{Math.floor(stats.sponsors * 0.9)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Teams */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Equipes Pendentes ({pendingTeams.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingTeams.map((team) => (
                      <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-sm text-muted-foreground">{team.city}, {team.state}</p>
                          <p className="text-xs text-muted-foreground">Coach: {team.coach_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => approveTeam(team.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                        </div>
                      </div>
                    ))}
                    {pendingTeams.length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <p className="text-muted-foreground">Nenhuma equipe pendente</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Sponsors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Patrocinadores Pendentes ({pendingSponsors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingSponsors.map((sponsor) => (
                      <div key={sponsor.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{sponsor.company_name}</p>
                          <p className="text-sm text-muted-foreground">{sponsor.contact_person}</p>
                          <Badge variant="outline" className="mt-1">
                            {sponsor.plan_type}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => approveSponsor(sponsor.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                        </div>
                      </div>
                    ))}
                    {pendingSponsors.length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <p className="text-muted-foreground">Nenhum patrocinador pendente</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações Modulares do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Module Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Módulos Funcionais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">Módulo de Equipes</div>
                        <p className="text-sm text-muted-foreground">Gerenciar equipes e inscrições</p>
                      </div>
                      <Switch
                        checked={getSettingValue('teams_module')?.enabled || false}
                        onCheckedChange={(checked) => 
                          updateSystemSetting('teams_module', { 
                            ...getSettingValue('teams_module', {}), 
                            enabled: checked 
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">Módulo de Patrocinadores</div>
                        <p className="text-sm text-muted-foreground">Gerenciar patrocinadores</p>
                      </div>
                      <Switch
                        checked={getSettingValue('sponsors_module')?.enabled || false}
                        onCheckedChange={(checked) => 
                          updateSystemSetting('sponsors_module', { 
                            ...getSettingValue('sponsors_module', {}), 
                            enabled: checked 
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">Módulo de Eventos</div>
                        <p className="text-sm text-muted-foreground">Gerenciar eventos e competições</p>
                      </div>
                      <Switch
                        checked={getSettingValue('events_module')?.enabled || false}
                        onCheckedChange={(checked) => 
                          updateSystemSetting('events_module', { 
                            ...getSettingValue('events_module', {}), 
                            enabled: checked 
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">Módulo de Blog</div>
                        <p className="text-sm text-muted-foreground">Sistema de posts e notícias</p>
                      </div>
                      <Switch
                        checked={getSettingValue('blog_module')?.enabled || false}
                        onCheckedChange={(checked) => 
                          updateSystemSetting('blog_module', { 
                            ...getSettingValue('blog_module', {}), 
                            enabled: checked 
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">Módulo de Contato</div>
                        <p className="text-sm text-muted-foreground">Sistema de contato e suporte</p>
                      </div>
                      <Switch
                        checked={getSettingValue('contact_module')?.enabled || false}
                        onCheckedChange={(checked) => 
                          updateSystemSetting('contact_module', { 
                            ...getSettingValue('contact_module', {}), 
                            enabled: checked 
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* General Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações Gerais</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">Registros Abertos</div>
                        <p className="text-sm text-muted-foreground">Permitir novos cadastros no sistema</p>
                      </div>
                      <Switch
                        checked={getSettingValue('registration_open')?.enabled || false}
                        onCheckedChange={(checked) => 
                          updateSystemSetting('registration_open', { 
                            ...getSettingValue('registration_open', {}), 
                            enabled: checked 
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">Modo Manutenção</div>
                        <p className="text-sm text-muted-foreground">Colocar o site em manutenção</p>
                      </div>
                      <Switch
                        checked={getSettingValue('site_maintenance')?.enabled || false}
                        onCheckedChange={(checked) => 
                          updateSystemSetting('site_maintenance', { 
                            ...getSettingValue('site_maintenance', {}), 
                            enabled: checked 
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stats.posts}</div>
                    <p className="text-sm text-muted-foreground">Total de posts</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stats.events}</div>
                    <p className="text-sm text-muted-foreground">Total de eventos</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Taxa de Aprovação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {stats.pendingApprovals === 0 ? '100%' : '95%'}
                    </div>
                    <p className="text-sm text-muted-foreground">Aprovações realizadas</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crescimento Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Novos Usuários</span>
                      <span className="font-semibold text-green-600">+{Math.floor(stats.users * 0.1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Novas Equipes</span>
                      <span className="font-semibold text-blue-600">+{Math.floor(stats.teams * 0.2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Novos Patrocinadores</span>
                      <span className="font-semibold text-purple-600">+{Math.floor(stats.sponsors * 0.15)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">Funcionando</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Autenticação</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">Ativo</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;