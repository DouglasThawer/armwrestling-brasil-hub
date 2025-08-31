// Configuração do domínio personalizado
export const DOMAIN_CONFIG = {
  // Domínio principal
  primary: "manzapkong.com.br",
  
  // URLs completas
  urls: {
    production: "https://manzapkong.com.br",
    development: "http://localhost:5173",
    staging: "https://staging.manzapkong.com.br"
  },
  
  // Configurações de SEO
  seo: {
    title: "Armwrestling Brasil Hub",
    description: "Plataforma completa para o esporte de braço de ferro no Brasil",
    keywords: ["armwrestling", "braço de ferro", "esporte", "brasil", "competições"],
    author: "ManzapKong",
    ogImage: "/og-image.jpg"
  },
  
  // Configurações de analytics
  analytics: {
    googleAnalyticsId: process.env.VITE_GA_ID || "",
    googleTagManagerId: process.env.VITE_GTM_ID || ""
  },
  
  // Configurações de email
  email: {
    from: "noreply@manzapkong.com.br",
    support: "suporte@manzapkong.com.br",
    noreply: "noreply@manzapkong.com.br"
  },
  
  // Configurações de API
  api: {
    baseUrl: process.env.NODE_ENV === "production" 
      ? "https://manzapkong.com.br/api" 
      : "http://localhost:3000/api"
  }
};

// Função para obter a URL base baseada no ambiente
export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  
  return process.env.NODE_ENV === "production" 
    ? DOMAIN_CONFIG.urls.production 
    : DOMAIN_CONFIG.urls.development;
};

// Função para verificar se está em produção
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

// Função para obter o domínio atual
export const getCurrentDomain = (): string => {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
  
  return DOMAIN_CONFIG.primary;
};
