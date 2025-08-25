import { Link } from "react-router-dom";
import { Trophy, MapPin, Users, Calendar, Star, BookOpen, Instagram, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Armwrestling Brasil</h3>
                <p className="text-sm text-muted-foreground">Comunidade Nacional</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              A maior plataforma brasileira de armwrestling. Conectando atletas, equipes e organizadores 
              para fortalecer a comunidade nacional da luta de braço.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/armwrestlingbrasil" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                <Instagram className="h-5 w-5 text-primary" />
              </a>
              <a href="https://facebook.com/armwrestlingbrasil" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a href="https://youtube.com/@armwrestlingbrasil" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                <Youtube className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/mapa" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Mapa Interativo
                </Link>
              </li>
              <li>
                <Link to="/equipes" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Equipes
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Comunidade */}
          <div>
            <h4 className="font-semibold mb-4">Comunidade</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/registro" className="text-muted-foreground hover:text-primary transition-colors">
                  Cadastrar Equipe
                </Link>
              </li>
              <li>
                <Link to="/patrocinios" className="text-muted-foreground hover:text-primary transition-colors">
                  Seja Patrocinador
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-muted-foreground hover:text-primary transition-colors">
                  Regulamento
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Armwrestling Brasil. Todos os direitos reservados. 
            Fortalecendo a comunidade brasileira de luta de braço.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;