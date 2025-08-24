import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Users, 
  Clock, 
  Phone, 
  Instagram, 
  Facebook,
  Search,
  Filter,
  Star
} from "lucide-react";

const MapaInterativo = () => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data das equipes
  const teams = [
    {
      id: 1,
      name: "Titans SP",
      city: "São Paulo",
      state: "SP",
      coach: "João Silva",
      address: "Rua das Flores, 123 - Vila Madalena",
      phone: "(11) 99999-9999",
      instagram: "@titans_sp",
      facebook: "TitansSP",
      schedule: "Segunda, Quarta e Sexta - 19h às 21h",
      members: 15,
      victories: 23,
      founded: "2018",
      position: { lat: -23.5505, lng: -46.6333 },
      description: "Equipe focada no desenvolvimento técnico e na formação de novos atletas.",
      specialties: ["Técnica", "Força", "Competição"]
    },
    {
      id: 2,
      name: "Force Rio",
      city: "Rio de Janeiro", 
      state: "RJ",
      coach: "Maria Santos",
      address: "Av. Copacabana, 456 - Copacabana",
      phone: "(21) 88888-8888",
      instagram: "@force_rio",
      facebook: "ForceRio",
      schedule: "Terça e Quinta - 18h às 20h, Sábado - 14h às 16h",
      members: 12,
      victories: 18,
      founded: "2019",
      position: { lat: -22.9068, lng: -43.1729 },
      description: "Tradição carioca no armwrestling com foco em competições nacionais.",
      specialties: ["Potência", "Resistência", "Estratégia"]
    },
    {
      id: 3,
      name: "Power MG",
      city: "Belo Horizonte",
      state: "MG", 
      coach: "Carlos Oliveira",
      address: "Rua dos Mineiros, 789 - Centro",
      phone: "(31) 77777-7777",
      instagram: "@power_mg",
      facebook: "PowerMG",
      schedule: "Segunda à Sexta - 17h às 19h",
      members: 10,
      victories: 15,
      founded: "2020",
      position: { lat: -19.9167, lng: -43.9345 },
      description: "Equipe mineira conhecida pela dedicação e espírito de equipe.",
      specialties: ["Disciplina", "Técnica", "Tradição"]
    },
    {
      id: 4,
      name: "Warriors RS",
      city: "Porto Alegre",
      state: "RS",
      coach: "Ana Lima", 
      address: "Rua Gaúcha, 321 - Moinhos de Vento",
      phone: "(51) 66666-6666",
      instagram: "@warriors_rs",
      facebook: "WarriorsRS",
      schedule: "Quarta e Sexta - 19h às 21h, Domingo - 9h às 11h",
      members: 8,
      victories: 12,
      founded: "2021",
      position: { lat: -30.0346, lng: -51.2177 },
      description: "Jovem equipe gaúcha com grande potencial competitivo.",
      specialties: ["Juventude", "Inovação", "Garra"]
    }
  ];

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Mapa Interativo das Equipes
            </h1>
            <p className="text-xl opacity-90">
              Descubra equipes de armwrestling próximas à você em todo o Brasil
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filtros e Lista de Equipes */}
          <div className="lg:col-span-1 space-y-6">
            {/* Busca */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Buscar Equipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nome, cidade ou estado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lista de Equipes */}
            <div className="space-y-4">
              {filteredTeams.map((team) => (
                <Card 
                  key={team.id} 
                  className={`power-card cursor-pointer transition-all ${
                    selectedTeam === team.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{team.name}</h3>
                        <p className="text-muted-foreground flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {team.city}, {team.state}
                        </p>
                      </div>
                      <Badge variant="secondary" className="strength-badge">
                        {team.members} membros
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Técnico: {team.coach}</span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-champion" />
                        {team.victories} vitórias
                      </span>
                    </div>

                    {selectedTeam === team.id && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div>
                          <h4 className="font-semibold mb-2">Informações de Treino</h4>
                          <p className="text-sm text-muted-foreground flex items-start">
                            <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            {team.schedule}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Endereço</h4>
                          <p className="text-sm text-muted-foreground">
                            {team.address}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Contato</h4>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {team.phone}
                            </p>
                            <div className="flex space-x-3">
                              <a href="#" className="text-primary hover:text-primary-glow flex items-center text-sm">
                                <Instagram className="h-4 w-4 mr-1" />
                                {team.instagram}
                              </a>
                              <a href="#" className="text-primary hover:text-primary-glow flex items-center text-sm">
                                <Facebook className="h-4 w-4 mr-1" />
                                {team.facebook}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Especialidades</h4>
                          <div className="flex flex-wrap gap-2">
                            {team.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button size="sm" className="w-full btn-hero">
                            Ver Perfil Completo
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] lg:h-[800px]">
              <CardContent className="p-0 h-full">
                <div className="relative w-full h-full bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Mapa Interativo</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Para visualizar o mapa interativo com a localização exata das equipes, 
                      conecte-se com a integração do Mapbox.
                    </p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {teams.map((team) => (
                          <div 
                            key={team.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedTeam === team.id 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'bg-card hover:bg-muted border-border'
                            }`}
                            onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
                          >
                            <div className="team-pin w-8 h-8 mx-auto mb-2">
                              <Users className="h-4 w-4" />
                            </div>
                            <div className="text-sm font-medium text-center">{team.name}</div>
                            <div className="text-xs opacity-75 text-center">{team.city}</div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="mt-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        Ativar Mapa Interativo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas das Equipes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {teams.length}
                  </div>
                  <div className="text-muted-foreground">Equipes Cadastradas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-victory mb-2">
                    {teams.reduce((acc, team) => acc + team.members, 0)}
                  </div>
                  <div className="text-muted-foreground">Atletas Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-champion mb-2">
                    {teams.reduce((acc, team) => acc + team.victories, 0)}
                  </div>
                  <div className="text-muted-foreground">Vitórias Totais</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {new Set(teams.map(team => team.state)).size}
                  </div>
                  <div className="text-muted-foreground">Estados Representados</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapaInterativo;