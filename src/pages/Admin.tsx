import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Trophy, 
  Calendar, 
  FileText, 
  DollarSign, 
  TrendingUp,
  MapPin,
  Activity
} from "lucide-react";

interface DashboardData {
  overview: {
    total_users: number;
    total_teams: number;
    total_athletes: number;
    total_events: number;
    total_posts: number;
    total_sponsors: number;
    total_revenue: number;
  };
  users_by_type: Array<{ user_type: string; count: number }>;
  teams_by_status: Array<{ status: string; count: number }>;
  events_by_status: Array<{ status: string; count: number }>;
  payments_by_status: Array<{ status: string; count: number; total_amount: number }>;
}

const Admin = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token de autenticação não encontrado');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Acesso negado. Você não tem permissão de administrador.');
        } else {
          setError('Erro ao carregar dados do dashboard');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setDashboardData(data.data);
      setLoading(false);
    } catch (err) {
      setError('Erro de conexão com o servidor');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Erro de Acesso</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/login'} className="w-full">
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Nenhum Dado Disponível</CardTitle>
            <CardDescription>Não foi possível carregar os dados do dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
        <p className="text-gray-600">Gerencie sua plataforma Armwrestling Brasil</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.total_users}</div>
            <p className="text-xs text-muted-foreground">usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipes</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.total_teams}</div>
            <p className="text-xs text-muted-foreground">equipes registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.total_events}</div>
            <p className="text-xs text-muted-foreground">eventos criados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {dashboardData.overview.total_revenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">em pagamentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Abas de Detalhamento */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="teams">Equipes</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usuários por Tipo</CardTitle>
                <CardDescription>Distribuição de usuários na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.users_by_type.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="capitalize">{item.user_type}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Pagamentos</CardTitle>
                <CardDescription>Distribuição dos pagamentos por status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.payments_by_status.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="capitalize">{item.status}</span>
                      <div className="text-right">
                        <div className="font-medium">{item.count}</div>
                        <div className="text-sm text-muted-foreground">
                          R$ {item.total_amount?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Usuários</CardTitle>
              <CardDescription>Gerencie usuários da plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Total de Usuários</p>
                      <p className="text-sm text-muted-foreground">
                        {dashboardData.overview.total_users} usuários ativos
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Ver Todos</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.users_by_type.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{item.count}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {item.user_type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Equipes</CardTitle>
              <CardDescription>Gerencie equipes e seus status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Total de Equipes</p>
                      <p className="text-sm text-muted-foreground">
                        {dashboardData.overview.total_teams} equipes registradas
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Ver Todas</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.teams_by_status.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{item.count}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Eventos</CardTitle>
              <CardDescription>Gerencie eventos e competições</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Total de Eventos</p>
                      <p className="text-sm text-muted-foreground">
                        {dashboardData.overview.total_events} eventos criados
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Ver Todos</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.events_by_status.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{item.count}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ações Rápidas */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Funcionalidades administrativas principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 mb-2" />
              <span>Gerenciar Usuários</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Trophy className="h-6 w-6 mb-2" />
              <span>Aprovar Equipes</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Criar Evento</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <FileText className="h-6 w-6 mb-2" />
              <span>Publicar Post</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
