import { Link } from "react-router-dom";
import { Sparkles, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">YearRecap</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Transforme memórias em vídeos com IA.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Twitter className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Instagram className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Youtube className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm">Produto</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Recursos", href: "#recursos" },
                { label: "Templates", href: "#templates" },
                { label: "Preços", href: "#precos" },
                { label: "Demo", href: "#demo" }
              ].map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm">Suporte</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Como Funciona", href: "#como-funciona" },
                { label: "FAQ", href: "#" },
                { label: "Contato", href: "mailto:support@yearrecap.ai" }
              ].map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Termos de Serviço", to: "/terms-of-service" },
                { label: "Privacidade", to: "/privacy-policy" },
                { label: "Reembolso", to: "/refund-policy" }
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 sm:pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2026 YearRecap AI. Todos os direitos reservados.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Feito com IA
          </p>
        </div>
      </div>
    </footer>
  );
};
