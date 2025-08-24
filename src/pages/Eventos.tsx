import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  MapPin, 
  Clock,
  Trophy,
  Users,
  Star,
  Search,
  Filter,
  ChevronRight,
  CalendarDays,
  Ticket
} from "lucide-react";

const Eventos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [eventType, setEventType] = useState("all");

  // Mock data dos eventos
  const events = [
    {
      id: 1,
      title: "Campeonato Paulista de Armwrestling 2024",
      date: "2024-01-15",
      time: "08:00",
      location: "São Paulo, SP",
      address: "Ginásio do Ibirapuera - Av. Pedro Álvares Cabral, s/n",
      type: "Estadual",
      category: "Profissional",
      organizer: "Federação Paulista de Armwrestling",
      participants: 120,
      maxParticipants: 150,
      price: "R$ 50,00",
      description: "O maior campeonato estadual de armwrestling do país, reunindo os melhores atletas paulistas.",
      image: "/api/placeholder/400/250",
      status: "Inscrições Abertas",
      prizes: ["1º lugar: R$ 2.000", "2º lugar: R$ 1.000", "3º lugar: R$ 500"],
      categories: ["Masculino -70kg", "Masculino -80kg", "Masculino +80kg", "Feminino -60kg", "Feminino +60kg"]
    },
    {
      id: 2,
      title: "Copa Rio de Força",
      date: "2024-01-28",
      time: "14:00", 
      location: "Rio de Janeiro, RJ",
      address: "Arena Carioca - Barra da Tijuca",
      type: "Regional",
      category: "Amador",
      organizer: "Liga Carioca de Armwrestling",
      participants: 80,
      maxParticipants: 100,
      price: "R$ 30,00",
      description: "Tradicional competição carioca que reúne atletas de todo o estado do Rio de Janeiro.",
      image: "/api/placeholder/400/250",
      status: "Inscrições Abertas",
      prizes: ["1º lugar: R$ 1.500", "2º lugar: R$ 800", "3º lugar: R$ 400"],
      categories: ["Masculino -75kg", "Masculino +75kg", "Feminino Aberto"]
    },
    {
      id: 3,
      title: "Torneio Sul-Brasileiro de Armwrestling",
      date: "2024-02-10",
      time: "09:00",
      location: "Porto Alegre, RS", 
      address: "Centro de Eventos - Av. Assis Brasil, 2000",
      type: "Regional",
      category: "Profissional",
      organizer: "Confederação Sul de Armwrestling",
      participants: 95,
      maxParticipants: 120,
      price: "R$ 60,00",
      description: "Evento que reúne os melhores atletas dos estados da região Sul do Brasil.",
      image: "/api/placeholder/400/250",
      status: "Inscrições Abertas",
      prizes: ["1º lugar: R$ 3.000", "2º lugar: R$ 1.500", "3º lugar: R$ 800"],
      categories: ["Diversas categorias por peso e idade"]
    },
    {
      id: 4,
      title: "Nacional Brasileiro de Armwrestling 2024",
      date: "2024-03-15",
      time: "08:00",
      location: "Brasília, DF",
      address: "Ginásio Nilson Nelson - Asa Norte",
      type: "Nacional", 
      category: "Profissional",
      organizer: "Confederação Brasileira de Armwrestling",
      participants: 200,
      maxParticipants: 250,
      price: "R$ 100,00",
      description: "O maior evento de armwrestling do Brasil, definindo os campeões nacionais.",
      image: "/api/placeholder/400/250",
      status: "Em Breve",
      prizes: ["1º lugar: R$ 5.000", "2º lugar: R$ 3.000", "3º lugar: R$ 1.500"],
      categories: ["Todas as categorias oficiais"]
    },
    {
      id: 5,
      title: "Copa Nordeste de Armwrestling",
      date: "2024-02-25",
      time: "13:00",
      location: "Fortaleza, CE",
      address: "Centro de Convenções - Av. Washington Soares",
      type: "Regional",
      category: "Misto",
      organizer: "Liga Nordestina",
      participants: 60,
      maxParticipants: 80,
      price: "R$ 40,00",
      description: "Primeira edição da copa que visa fortalecer o armwrestling no Nordeste.",
      image: "/api/placeholder/400/250",
      status: "Inscrições Abertas",
      prizes: ["1º lugar: R$ 2.000", "2º lugar: R$ 1.000", "3º lugar: R$ 500"],
      categories: ["Masculino e Feminino por categorias de peso"]
    }
  ];

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
  const pastEvents = events.filter(event => new Date(event.date) < new Date());

  const filteredEvents = (eventList: typeof events) => {
    return eventList
      .filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(event => selectedState === "all" || event.location.includes(selectedState))
      .filter(event => eventType === "all" || event.type === eventType);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Inscrições Abertas":
        return "bg-victory text-white";
      case "Em Breve":
        return "bg-champion text-white";
      case "Encerrado":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Eventos de Armwrestling
            </h1>
            <p className="text-xl opacity-90">
              Descubra e participe dos melhores eventos de luta de braço do Brasil
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
                  placeholder="Buscar eventos..."
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
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Nacional">Nacional</SelectItem>
                  <SelectItem value="Regional">Regional</SelectItem>
                  <SelectItem value="Estadual">Estadual</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filtros Avançados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs para Eventos */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Próximos Eventos ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Eventos Anteriores ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents(upcomingEvents).map((event) => (
                <Card key={event.id} className="event-card group">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 z-20">
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 z-20 text-white">
                      <h3 className="font-bold text-xl mb-2">{event.title}</h3>
                      <div className="flex items-center text-sm opacity-90 mb-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm opacity-90 mb-1">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm opacity-90">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Participantes:</span>
                        <span className="font-medium">{event.participants}/{event.maxParticipants}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Inscrição:</span>
                        <span className="font-medium text-primary">{event.price}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">Organizador:</div>
                      <div className="font-medium">{event.organizer}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 btn-hero" asChild>
                        <Link to={`/eventos/${event.id}`}>
                          Ver Detalhes
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                      {event.status === "Inscrições Abertas" && (
                        <Button variant="outline" size="sm">
                          <Ticket className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents(pastEvents).map((event) => (
                <Card key={event.id} className="event-card opacity-75">
                  <div className="relative h-32 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-muted text-muted-foreground">
                        Encerrado
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 z-20">
                      <h3 className="font-bold text-lg text-white">{event.title}</h3>
                      <div className="flex items-center text-sm text-white/80">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(event.date)}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      {event.description}
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/eventos/${event.id}`}>
                        Ver Resultados
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Organize Seu Próprio Evento</h3>
              <p className="text-muted-foreground mb-6">
                Quer organizar um evento de armwrestling? Nossa plataforma oferece todas as ferramentas necessárias.
              </p>
              <Button size="lg" className="btn-hero">
                <Trophy className="h-5 w-5 mr-2" />
                Criar Evento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Eventos;