import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Trophy, 
  Users, 
  ChevronRight, 
  Play,
  Target,
  Award,
  TrendingUp
} from "lucide-react";

const Home = () => {
  // Mock data para demonstração
  const upcomingEvents = [
    {
      id: 1,
      title: "Campeonato Paulista de Armwrestling",
      date: "15 de Janeiro, 2024",
      location: "São Paulo, SP",
      image: "/api/placeholder/400/200",
      category: "Estadual"
    },
    {
      id: 2,
      title: "Copa Rio de Força",
      date: "28 de Janeiro, 2024", 
      location: "Rio de Janeiro, RJ",
      image: "/api/placeholder/400/200",
      category: "Regional"
    },
    {
      id: 3,
      title: "Torneio Sul-Brasileiro",
      date: "10 de Fevereiro, 2024",
      location: "Porto Alegre, RS", 
      image: "/api/placeholder/400/200",
      category: "Regional"
    }
  ];

  const featuredTeams = [
    { id: 1, name: "Titans SP", city: "São Paulo", members: 15, victories: 23 },
    { id: 2, name: "Force Rio", city: "Rio de Janeiro", members: 12, victories: 18 },
    { id: 3, name: "Power MG", city: "Belo Horizonte", members: 10, victories: 15 },
    { id: 4, name: "Warriors RS", city: "Porto Alegre", members: 8, victories: 12 }
  ];

  const recentNews = [
    {
      id: 1,
      title: "Brasil conquista medalha de ouro no Mundial de Armwrestling",
      excerpt: "Atleta brasileiro supera adversários internacionais e traz título inédito para o país...",
      date: "há 2 dias",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Nova categoria feminina será incluída nos próximos campeonatos",
      excerpt: "Federação anuncia expansão das categorias para incluir mais atletas femininas...",
      date: "há 5 dias",
      image: "/api/placeholder/300/200"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary to-primary/20 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 strength-badge text-lg px-4 py-2">
              🏆 Comunidade Nacional de Armwrestling
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              A Força do Brasil em 
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent block">
                Suas Mãos
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Conecte-se com atletas, equipes e eventos de armwrestling em todo o Brasil. 
              Descubra a comunidade que está revolutionando a luta de braço nacional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="btn-hero text-lg px-8 py-4" asChild>
                <Link to="/mapa">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explorar Mapa
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-secondary" asChild>
                <Link to="/eventos">
                  <Calendar className="mr-2 h-5 w-5" />
                  Ver Eventos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">150+</h3>
              <p className="text-muted-foreground">Equipes Cadastradas</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-victory to-victory/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-victory mb-2">50+</h3>
              <p className="text-muted-foreground">Eventos Realizados</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-champion to-champion/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-champion mb-2">500+</h3>
              <p className="text-muted-foreground">Atletas Ativos</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">25</h3>
              <p className="text-muted-foreground">Estados Participantes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Próximos Eventos</h2>
              <p className="text-muted-foreground text-lg">Não perca as competições que estão chegando</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/eventos">
                Ver Todos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="event-card group cursor-pointer">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <Badge className="absolute top-4 left-4 z-20 strength-badge">
                    {event.category}
                  </Badge>
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                    <div className="flex items-center text-sm opacity-90">
                      <Calendar className="h-4 w-4 mr-1" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm opacity-90">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Button className="w-full btn-hero" asChild>
                    <Link to={`/eventos/${event.id}`}>
                      Ver Detalhes
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Equipes em Destaque */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Equipes em Destaque</h2>
              <p className="text-muted-foreground text-lg">Conheça as equipes que estão dominando o cenário nacional</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/equipes">
                Ver Todas
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTeams.map((team) => (
              <Card key={team.id} className="power-card group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{team.name}</h3>
                  <p className="text-muted-foreground mb-4 flex items-center justify-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {team.city}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="victory-stat">
                      <div className="text-2xl font-bold text-victory">{team.members}</div>
                      <div className="text-xs text-muted-foreground">Membros</div>
                    </div>
                    <div className="victory-stat">
                      <div className="text-2xl font-bold text-champion">{team.victories}</div>
                      <div className="text-xs text-muted-foreground">Vitórias</div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/equipes/${team.id}`}>
                      Ver Perfil
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Últimas Notícias */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Últimas Notícias</h2>
              <p className="text-muted-foreground text-lg">Fique por dentro do que acontece no armwrestling brasileiro</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/blog">
                Ver Blog
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recentNews.map((article) => (
              <Card key={article.id} className="news-article group cursor-pointer">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  <div className="relative h-48 md:h-full bg-gradient-to-br from-primary/20 to-primary-glow/20">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <CardContent className="md:col-span-2 p-6">
                    <Badge variant="secondary" className="mb-3">
                      {article.date}
                    </Badge>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary-glow">
                      Ler mais
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-glow text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Pronto para Fazer Parte da Comunidade?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Cadastre sua equipe, participe de eventos e conecte-se com outros atletas apaixonados pelo armwrestling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
              <Link to="/registro">
                <Users className="mr-2 h-5 w-5" />
                Cadastrar Equipe
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary text-lg px-8 py-4" asChild>
              <Link to="/mapa">
                <MapPin className="mr-2 h-5 w-5" />
                Explorar Mapa
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;