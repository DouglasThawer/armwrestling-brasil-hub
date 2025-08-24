import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star,
  Trophy,
  Crown,
  Medal,
  Heart,
  Target,
  Users,
  TrendingUp,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react";

const Patrocinios = () => {
  // Mock data dos patrocinadores
  const sponsors = {
    gold: [
      {
        id: 1,
        name: "PowerGym Academia",
        logo: "/api/placeholder/200/100",
        website: "https://powergym.com.br",
        description: "A maior rede de academias especializadas em força do Brasil",
        benefits: ["Equipamentos profissionais", "Treinamento especializado", "Suporte nutricional"],
        contact: "contato@powergym.com.br"
      },
      {
        id: 2,
        name: "ForceNutrition",
        logo: "/api/placeholder/200/100", 
        website: "https://forcenutrition.com.br",
        description: "Suplementos premium para atletas de alto rendimento",
        benefits: ["Produtos exclusivos", "Consultoria nutricional", "Desconto para atletas"],
        contact: "atletas@forcenutrition.com.br"
      }
    ],
    silver: [
      {
        id: 3,
        name: "StrongWear",
        logo: "/api/placeholder/150/75",
        website: "https://strongwear.com.br",
        description: "Vestuário esportivo de alta qualidade",
        benefits: ["Roupas técnicas", "Uniformes personalizados"],
        contact: "vendas@strongwear.com.br"
      },
      {
        id: 4,
        name: "MegaProtein",
        logo: "/api/placeholder/150/75",
        website: "https://megaprotein.com.br", 
        description: "Suplementação para força e performance",
        benefits: ["Whey protein premium", "BCAA importado"],
        contact: "info@megaprotein.com.br"
      },
      {
        id: 5,
        name: "IronEquipments",
        logo: "/api/placeholder/150/75",
        website: "https://ironequipments.com.br",
        description: "Equipamentos profissionais para treinamento",
        benefits: ["Mesa oficial de armwrestling", "Acessórios técnicos"],
        contact: "comercial@ironequipments.com.br"
      }
    ],
    bronze: [
      {
        id: 6,
        name: "FitStore",
        logo: "/api/placeholder/120/60",
        website: "https://fitstore.com.br",
        description: "Loja de suplementos e acessórios",
        contact: "atendimento@fitstore.com.br"
      },
      {
        id: 7,
        name: "AthleteCare",
        logo: "/api/placeholder/120/60",
        website: "https://athletecare.com.br", 
        description: "Fisioterapia e cuidados esportivos",
        contact: "clinica@athletecare.com.br"
      },
      {
        id: 8,
        name: "PowerFood",
        logo: "/api/placeholder/120/60",
        website: "https://powerfood.com.br",
        description: "Alimentação saudável para atletas",
        contact: "contato@powerfood.com.br"
      },
      {
        id: 9,
        name: "GripTech",
        logo: "/api/placeholder/120/60",
        website: "https://griptech.com.br",
        description: "Tecnologia em equipamentos de força",
        contact: "tech@griptech.com.br"
      }
    ]
  };

  const sponsorshipPlans = [
    {
      tier: "Ouro",
      price: "R$ 5.000/mês",
      icon: Crown,
      color: "champion",
      features: [
        "Logo em destaque no site",
        "Patrocínio de eventos principais",
        "Menções em redes sociais",
        "Stand exclusivo em eventos",
        "Direito a naming rights",
        "Relatórios de performance",
        "Acesso VIP aos eventos"
      ]
    },
    {
      tier: "Prata", 
      price: "R$ 2.500/mês",
      icon: Medal,
      color: "muted-foreground",
      features: [
        "Logo no site principal",
        "Patrocínio de eventos regionais", 
        "Menções quinzenais",
        "Espaço em eventos",
        "Newsletter mensal",
        "Acesso aos eventos"
      ]
    },
    {
      tier: "Bronze",
      price: "R$ 1.000/mês", 
      icon: Star,
      color: "primary",
      features: [
        "Logo na página de patrocinadores",
        "Menções mensais",
        "Link no site",
        "Certificado de apoio",
        "Relatório trimestral"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Nossos Patrocinadores
            </h1>
            <p className="text-xl opacity-90">
              Empresas e marcas que apoiam o crescimento do armwrestling brasileiro
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Patrocinadores Ouro */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-champion text-secondary text-lg px-4 py-2">
              <Crown className="h-5 w-5 mr-2" />
              Patrocinadores Ouro
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Nossos Parceiros Premium</h2>
            <p className="text-muted-foreground">
              Empresas que investem diretamente no desenvolvimento do esporte
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sponsors.gold.map((sponsor) => (
              <Card key={sponsor.id} className="sponsor-gold group hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-48 h-24 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="text-champion font-bold text-xl">{sponsor.name}</div>
                  </div>
                  <CardTitle className="text-xl">{sponsor.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-center">
                    {sponsor.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Benefícios oferecidos:</h4>
                    <ul className="space-y-1">
                      {sponsor.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Trophy className="h-4 w-4 mr-2 text-champion" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <a 
                      href={sponsor.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-champion hover:text-champion/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visitar Site
                    </a>
                    <a 
                      href={`mailto:${sponsor.contact}`}
                      className="flex items-center text-muted-foreground hover:text-champion transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Contato
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Patrocinadores Prata */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-muted text-muted-foreground text-lg px-4 py-2">
              <Medal className="h-5 w-5 mr-2" />
              Patrocinadores Prata
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Parceiros Estratégicos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sponsors.silver.map((sponsor) => (
              <Card key={sponsor.id} className="sponsor-silver group hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-32 h-16 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <div className="text-muted-foreground font-semibold">{sponsor.name}</div>
                  </div>
                  <CardTitle className="text-lg">{sponsor.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm text-center">
                    {sponsor.description}
                  </p>
                  
                  {sponsor.benefits && (
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Benefícios:</h4>
                      <ul className="space-y-1">
                        {sponsor.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center text-xs">
                            <Star className="h-3 w-3 mr-2 text-muted-foreground" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3">
                    <a 
                      href={sponsor.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:text-primary-glow transition-colors text-sm"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Site
                    </a>
                    <a 
                      href={`mailto:${sponsor.contact}`}
                      className="flex items-center text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Contato
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Patrocinadores Bronze */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-orange-200/20 text-orange-600 text-lg px-4 py-2 border border-orange-300/40">
              <Star className="h-5 w-5 mr-2" />
              Patrocinadores Bronze
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Apoiadores da Comunidade</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sponsors.bronze.map((sponsor) => (
              <Card key={sponsor.id} className="sponsor-bronze group hover:shadow-md transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="w-24 h-12 bg-white rounded mx-auto mb-3 flex items-center justify-center">
                    <div className="text-orange-600 font-medium text-sm">{sponsor.name}</div>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{sponsor.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {sponsor.description}
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <a 
                      href={sponsor.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a 
                      href={`mailto:${sponsor.contact}`}
                      className="text-muted-foreground hover:text-orange-600 transition-colors"
                    >
                      <Mail className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Planos de Patrocínio */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Torne-se um Patrocinador</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Faça parte do crescimento do armwrestling brasileiro e conecte sua marca com uma comunidade apaixonada e engajada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sponsorshipPlans.map((plan) => (
              <Card key={plan.tier} className={`relative power-card group hover:shadow-xl transition-all duration-300 ${
                plan.tier === "Ouro" ? "ring-2 ring-champion/20" : ""
              }`}>
                {plan.tier === "Ouro" && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-champion text-secondary px-4 py-1">
                      <Crown className="h-4 w-4 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    plan.tier === "Ouro" ? "bg-champion/20" : 
                    plan.tier === "Prata" ? "bg-muted" : "bg-primary/20"
                  }`}>
                    <plan.icon className={`h-8 w-8 ${
                      plan.tier === "Ouro" ? "text-champion" :
                      plan.tier === "Prata" ? "text-muted-foreground" : "text-primary"
                    }`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.tier}</CardTitle>
                  <div className="text-3xl font-bold text-primary mt-2">{plan.price}</div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Heart className={`h-4 w-4 mr-3 mt-0.5 flex-shrink-0 ${
                          plan.tier === "Ouro" ? "text-champion" :
                          plan.tier === "Prata" ? "text-muted-foreground" : "text-primary"
                        }`} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      plan.tier === "Ouro" ? "btn-hero" : "bg-primary hover:bg-primary-glow"
                    }`}
                    size="lg"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Escolher {plan.tier}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
            <CardContent className="p-12">
              <Trophy className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Pronto para Apoiar o Armwrestling?</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Junte-se aos patrocinadores que estão fortalecendo a maior comunidade de armwrestling do Brasil. 
                Entre em contato conosco e descubra como sua marca pode fazer parte dessa jornada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="btn-hero text-lg px-8 py-4">
                  <Phone className="h-5 w-5 mr-2" />
                  Falar com Consultor
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  <Mail className="h-5 w-5 mr-2" />
                  Enviar Proposta
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Patrocinios;