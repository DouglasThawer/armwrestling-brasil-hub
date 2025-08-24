import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen,
  Calendar,
  User,
  ChevronRight,
  Search,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Share2
} from "lucide-react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data dos artigos
  const articles = [
    {
      id: 1,
      title: "Brasil conquista medalha de ouro no Mundial de Armwrestling 2024",
      excerpt: "Em uma disputa emocionante, o atleta brasileiro João Silva superou adversários de 15 países e conquistou o título mundial na categoria -80kg, marcando um momento histórico para o armwrestling nacional.",
      content: "Leia a história completa desta conquista inédita...",
      author: "Carlos Mendes",
      publishedAt: "2024-01-10",
      readTime: 5,
      views: 1250,
      likes: 89,
      category: "Competições",
      image: "/api/placeholder/600/300",
      featured: true,
      tags: ["Mundial", "Medalha", "Brasil", "Conquista"]
    },
    {
      id: 2,
      title: "Técnicas Fundamentais do Armwrestling: Guia para Iniciantes",
      excerpt: "Descubra as principais técnicas utilizadas no armwrestling e como desenvolver a força e estratégia necessárias para competir no mais alto nível.",
      content: "Um guia completo para quem está começando no esporte...",
      author: "Ana Silva",
      publishedAt: "2024-01-08",
      readTime: 8,
      views: 950,
      likes: 67,
      category: "Técnicas",
      image: "/api/placeholder/600/300",
      featured: false,
      tags: ["Técnicas", "Iniciantes", "Treinamento", "Guia"]
    },
    {
      id: 3,
      title: "Nova categoria feminina será incluída nos próximos campeonatos",
      excerpt: "A Confederação Brasileira de Armwrestling anuncia a expansão das categorias competitivas para incluir mais divisões femininas, promovendo maior participação das mulheres no esporte.",
      content: "Entenda as mudanças que estão chegando...",
      author: "Maria Santos",
      publishedAt: "2024-01-05",
      readTime: 4,
      views: 720,
      likes: 45,
      category: "Notícias",
      image: "/api/placeholder/600/300",
      featured: false,
      tags: ["Feminino", "Categorias", "Inclusão", "Mudanças"]
    },
    {
      id: 4,
      title: "Preparação Física no Armwrestling: Treinamento de Força Específica",
      excerpt: "Conheça os exercícios e métodos de treinamento que os atletas profissionais utilizam para desenvolver a força específica necessária no armwrestling.",
      content: "Programa de treinamento detalhado...",
      author: "Pedro Costa",
      publishedAt: "2024-01-03",
      readTime: 10,
      views: 890,
      likes: 78,
      category: "Treinamento",
      image: "/api/placeholder/600/300",
      featured: false,
      tags: ["Força", "Exercícios", "Preparação", "Atletas"]
    },
    {
      id: 5,
      title: "História do Armwrestling no Brasil: Das Origens aos Dias Atuais",
      excerpt: "Uma jornada através da evolução do armwrestling brasileiro, desde os primeiros torneios até o reconhecimento internacional que o esporte possui hoje.",
      content: "A rica história do armwrestling nacional...",
      author: "Roberto Lima",
      publishedAt: "2024-01-01",
      readTime: 12,
      views: 650,
      likes: 52,
      category: "História",
      image: "/api/placeholder/600/300",
      featured: false,
      tags: ["História", "Brasil", "Evolução", "Tradição"]
    },
    {
      id: 6,
      title: "Nutrição e Suplementação para Atletas de Armwrestling",
      excerpt: "Descubra como uma alimentação adequada e suplementação estratégica podem potencializar o desempenho e a recuperação dos atletas de armwrestling.",
      content: "Guia nutricional completo para atletas...",
      author: "Dr. Lucas Ferreira",
      publishedAt: "2023-12-28",
      readTime: 7,
      views: 1100,
      likes: 95,
      category: "Saúde",
      image: "/api/placeholder/600/300",
      featured: false,
      tags: ["Nutrição", "Suplementação", "Performance", "Saúde"]
    }
  ];

  const categories = ["Todas", "Competições", "Técnicas", "Treinamento", "Notícias", "História", "Saúde"];
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const filteredArticles = articles
    .filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(article => selectedCategory === "Todas" || article.category === selectedCategory);

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Competições": "bg-primary text-primary-foreground",
      "Técnicas": "bg-victory text-white",
      "Treinamento": "bg-champion text-secondary",
      "Notícias": "bg-secondary text-secondary-foreground",
      "História": "bg-muted text-muted-foreground",
      "Saúde": "bg-power text-white"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Blog Armwrestling Brasil
            </h1>
            <p className="text-xl opacity-90">
              Notícias, técnicas, histórias e tudo sobre o mundo do armwrestling brasileiro
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Busca e Filtros */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artigos, tags ou temas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "btn-hero" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Artigo em Destaque */}
        {featuredArticle && selectedCategory === "Todas" && (
          <Card className="mb-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-full bg-gradient-to-br from-primary/20 to-primary-glow/20">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <Badge className="absolute top-4 left-4 z-20 bg-champion text-secondary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Em Destaque
                </Badge>
              </div>
              <CardContent className="p-8">
                <Badge className={`mb-4 ${getCategoryColor(featuredArticle.category)}`}>
                  {featuredArticle.category}
                </Badge>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                  {featuredArticle.title}
                </h2>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                
                <div className="flex items-center text-sm text-muted-foreground mb-6">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{featuredArticle.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{formatDate(featuredArticle.publishedAt)}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{featuredArticle.readTime} min de leitura</span>
                </div>

                <div className="flex items-center justify-between">
                  <Button size="lg" className="btn-hero" asChild>
                    <Link to={`/blog/${featuredArticle.id}`}>
                      Ler Artigo
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {featuredArticle.views}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {featuredArticle.likes}
                    </span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Grid de Artigos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article) => (
            <Card key={article.id} className="news-article group">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                <Badge className={`absolute top-4 left-4 z-20 ${getCategoryColor(article.category)}`}>
                  {article.category}
                </Badge>
              </div>

              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-3 leading-tight group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-3">{article.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>

                <div className="flex items-center text-xs text-muted-foreground mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="mr-4">{article.readTime} min</span>
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="mr-4">{article.views}</span>
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{article.likes}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary-glow" asChild>
                    <Link to={`/blog/${article.id}`}>
                      Ler mais
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="p-2">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Fique por Dentro das Novidades</h3>
              <p className="text-muted-foreground mb-6">
                Receba as últimas notícias, técnicas e artigos sobre armwrestling diretamente no seu email.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Seu melhor email" className="flex-1" />
                <Button className="btn-hero">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Inscrever-se
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blog;