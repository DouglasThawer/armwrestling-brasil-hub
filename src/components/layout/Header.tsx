import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, MapPin, Trophy, Calendar, Users, Star, BookOpen } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Início", icon: Trophy },
    { href: "/mapa", label: "Mapa", icon: MapPin },
    { href: "/equipes", label: "Equipes", icon: Users },
    { href: "/eventos", label: "Eventos", icon: Calendar },
    { href: "/patrocinios", label: "Patrocínios", icon: Star },
    { href: "/blog", label: "Blog", icon: BookOpen },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Armwrestling</h1>
              <p className="text-xs text-muted-foreground -mt-1">Brasil</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Login Button */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Entrar
              </Link>
            </Button>
            <Button size="sm" className="btn-hero" asChild>
              <Link to="/registro">Cadastrar Equipe</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                  <Button className="w-full btn-hero" asChild>
                    <Link to="/registro" onClick={() => setIsOpen(false)}>
                      Cadastrar Equipe
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;