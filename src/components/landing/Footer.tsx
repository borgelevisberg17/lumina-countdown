import { Link } from "react-router-dom";
import { Sparkles, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-border/50">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-display text-xl font-bold text-foreground">YearRecap AI</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transforme suas memórias em vídeos incríveis com inteligência artificial.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Twitter className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Instagram className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Youtube className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Produto</h4>
            <ul className="space-y-3">
              <li>
                <a href="#recursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Templates
                </a>
              </li>
              <li>
                <a href="#precos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Preços
                </a>
              </li>
              <li>
                <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Demonstração
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Suporte</h4>
            <ul className="space-y-3">
              <li>
                <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="mailto:support@yearrecap.ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de Reembolso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 YearRecap AI. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Feito com ❤️ usando IA
          </p>
        </div>
      </div>
    </footer>
  );
};
