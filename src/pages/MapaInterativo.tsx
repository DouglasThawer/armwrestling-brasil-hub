import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Users, 
  Search,
  Map
} from "lucide-react";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para os ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para centralizar o mapa quando uma equipe é selecionada
function MapController({ selectedTeam, teams }: { selectedTeam: number | null, teams: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedTeam) {
      const team = teams.find(t => t.id === selectedTeam);
      if (team) {
        map.setView([team.position.lat, team.position.lng], 13);
      }
    } else {
      // Centraliza no Brasil
      map.setView([-15.7801, -47.9292], 5);
    }
  }, [selectedTeam, teams, map]);

  return null;
}

const MapaInterativo = () => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Dados das equipes
  const teams = [
    {
      id: 1,
      name: "Titans SP",
      city: "São Paulo",
      state: "SP",
      address: "Rua das Flores, 123 - Vila Madalena",
      position: { lat: -23.5505, lng: -46.6333 },
      members: 15
    },
    {
      id: 2,
      name: "Force Rio",
      city: "Rio de Janeiro", 
      state: "RJ",
      address: "Av. Copacabana, 456 - Copacabana",
      position: { lat: -22.9068, lng: -43.1729 },
      members: 12
    },
    {
      id: 3,
      name: "Power MG",
      city: "Belo Horizonte",
      state: "MG", 
      address: "Rua dos Mineiros, 789 - Centro",
      position: { lat: -19.9167, lng: -43.9345 },
      members: 10
    },
    {
      id: 4,
      name: "Warriors RS",
      city: "Porto Alegre",
      state: "RS",
      address: "Rua Gaúcha, 321 - Moinhos de Vento",
      position: { lat: -30.0346, lng: -51.2177 },
      members: 8
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
          {/* Lista de Equipes */}
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
                  className={`cursor-pointer transition-all ${
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
                      <Badge variant="secondary">
                        {team.members} membros
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {team.address}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mapa Interativo */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] lg:h-[800px]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Map className="h-5 w-5 mr-2" />
                  Mapa Interativo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <div className="w-full h-full">
                  <MapContainer
                    center={[-15.7801, -47.9292]}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-lg"
                  >
                    <MapController selectedTeam={selectedTeam} teams={teams} />
                    
                    {/* Tile Layer - Mapa base */}
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Marcadores das Equipes */}
                    {teams.map((team) => (
                      <Marker
                        key={`team-${team.id}`}
                        position={[team.position.lat, team.position.lng]}
                        eventHandlers={{
                          click: () => setSelectedTeam(team.id)
                        }}
                      >
                        <Popup>
                          <div className="text-center">
                            <h3 className="font-bold text-lg text-primary">{team.name}</h3>
                            <p className="text-sm text-muted-foreground">{team.city}, {team.state}</p>
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {team.members} membros
                              </Badge>
                            </div>
                            <p className="text-xs mt-2">{team.address}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaInterativo;