import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MapPin, 
  Trophy, 
  Star, 
  Search, 
  Filter,
  Calendar,
  Award,
  ChevronRight
} from "lucide-react";

const Equipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Mock data das equipes
  const teams = [
    {
      id: 1,
      name: "Titans SP",
      city: "São Paulo",
      state: "SP",
      coach: "João Silva",
      members: 15,
      victories: 23,
      founded: "2018",
      description: "Equipe focada no desenvolvimento técnico e na formação de novos atletas.",
      image: "/api/placeholder/300/200",
      rating: 4.8,
      lastEvent: "Campeonato Paulista 2024"
    },
    {
      id: 2,
      name: "Force Rio",
      city: "Rio de Janeiro",
      state: "RJ", 
      coach: "Maria Santos",
      members: 12,
      victories: 18,
      founded: "2019",
      description: "Tradição carioca no armwrestling com foco em competições nacionais.",
      image: "/api/placeholder/300/200",
      rating: 4.6,
      lastEvent: "Copa Rio de Força 2024"
    },
    {
      id: 3,
      name: "Power MG",
      city: "Belo Horizonte",
      state: "MG",
      coach: "Carlos Oliveira", 
      members: 10,
      victories: 15,
      founded: "2020",
      description: "Equipe mineira conhecida pela dedicação e espírito de equipe.",
      image: "/api/placeholder/300/200",
      rating: 4.5,
      lastEvent: "Torneio Mineiro 2024"
    },
    {
      id: 4,
      name: "Warriors RS",
      city: "Porto Alegre",
      state: "RS",
      coach: "Ana Lima",
      members: 8,
      victories: 12, 
      founded: "2021",
      description: "Jovem equipe gaúcha com grande potencial competitivo.",
      image: "/api/placeholder/300/200",
      rating: 4.3,
      lastEvent: "Sul-Brasileiro 2024"
    },
    {
      id: 5,
      name: "Thunder BA",
      city: "Salvador",
      state: "BA",
      coach: "Pedro Costa",
      members: 14,
      victories: 20,
      founded: "2017",
      description: "Representantes baianos com tradição em competições nordestinas.",
      image: "/api/placeholder/300/200", 
      rating: 4.7,
      lastEvent: "Nordestino de Armwrestling 2024"
    },
    {
      id: 6,
      name: "Steel PR",
      city: "Curitiba", 
      state: "PR",
      coach: "Lucas Ferreira",
      members: 11,
      victories: 16,
      founded: "2019",
      description: "Equipe paranaense conhecida pela técnica apurada.",
      image: "/api/placeholder/300/200",
      rating: 4.4,
      lastEvent: "Paranaense 2024"
    }
  ];

  const states = ["SP", "RJ", "MG", "RS", "BA", "PR"];

  const filteredTeams = teams
    .filter(team => 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(team => selectedState === "all" || team.state === selectedState)
    .sort((a, b) => {
      switch (sortBy) {
        case "victories":
          return b.victories - a.victories;
        case "members":
          return b.members - a.members;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Equipes de Armwrestling
            </h1>
            <p className="text-xl opacity-90">
              Conheça as equipes que estão fortalecendo o armwrestling brasileiro
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar equipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os Estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Estados</SelectItem>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="victories">Mais Vitórias</SelectItem>
                  <SelectItem value="members">Mais Membros</SelectItem>
                  <SelectItem value="rating">Melhor Avaliação</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filtros Avançados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="power-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{teams.length}</div>
              <div className="text-sm text-muted-foreground">Equipes Ativas</div>
            </CardContent>
          </Card>
          <Card className="power-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-victory mb-1">
                {teams.reduce((acc, team) => acc + team.members, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Atletas Total</div>
            </CardContent>
          </Card>
          <Card className="power-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-champion mb-1">
                {teams.reduce((acc, team) => acc + team.victories, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Vitórias Somadas</div>
            </CardContent>
          </Card>
          <Card className="power-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {new Set(teams.map(team => team.state)).size}
              </div>
              <div className="text-sm text-muted-foreground">Estados</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Equipes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="power-card group hover:shadow-xl transition-all duration-300">
              {/* Header da Equipe */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="strength-badge">
                    <Star className="h-3 w-3 mr-1" />
                    {team.rating}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="font-bold text-xl mb-1">{team.name}</h3>
                  <div className="flex items-center text-sm opacity-90">
                    <MapPin className="h-4 w-4 mr-1" />
                    {team.city}, {team.state}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Info da Equipe */}
                <div className="mb-4">
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {team.description}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <strong>Técnico:</strong> {team.coach}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Fundada em:</strong> {team.founded}
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{team.members}</div>
                    <div className="text-xs text-muted-foreground">Membros</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-victory">{team.victories}</div>
                    <div className="text-xs text-muted-foreground">Vitórias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-champion">
                      {new Date().getFullYear() - parseInt(team.founded)}
                    </div>
                    <div className="text-xs text-muted-foreground">Anos</div>
                  </div>
                </div>

                {/* Último Evento */}
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium">Último evento:</span>
                  </div>
                  <div className="text-sm mt-1">{team.lastEvent}</div>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 btn-hero" asChild>
                    <Link to={`/equipes/${team.id}`}>
                      Ver Perfil
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Sua Equipe Não Está Aqui?</h3>
              <p className="text-muted-foreground mb-6">
                Cadastre sua equipe e faça parte da maior comunidade de armwrestling do Brasil.
              </p>
              <Button size="lg" className="btn-hero" asChild>
                <Link to="/registro">
                  <Users className="h-5 w-5 mr-2" />
                  Cadastrar Equipe
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Equipes;