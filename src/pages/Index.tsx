import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sparkles, 
  Upload, 
  Wand2, 
  Video, 
  Star, 
  Zap, 
  Crown,
  ArrowRight,
  Play,
  CheckCircle2
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Upload,
      title: "Upload Fácil",
      description: "Arraste e solte suas fotos favoritas do ano"
    },
    {
      icon: Wand2,
      title: "IA Inteligente",
      description: "Prompts personalizados que entendem suas memórias"
    },
    {
      icon: Video,
      title: "Vídeos Incríveis",
      description: "Transições, música e legendas animadas"
    },
    {
      icon: Sparkles,
      title: "5 Templates",
      description: "Escolha o estilo perfeito para suas memórias"
    }
  ];

  const templates = [
    { name: "Fade-In Simples", color: "from-primary to-primary/50" },
    { name: "Bounce Animado", color: "from-celebration-rose to-celebration-purple" },
    { name: "Typewriter", color: "from-celebration-teal to-primary" },
    { name: "Slide-Up Glow", color: "from-celebration-purple to-celebration-blue" },
    { name: "Rotate & Zoom", color: "from-accent to-celebration-gold" }
  ];

  const plans = [
    {
      name: "Free",
      price: "Grátis",
      icon: Star,
      features: ["50 créditos/semana", "Vídeos até 30s", "10 fotos máx", "1 template"],
      color: "border-muted"
    },
    {
      name: "Pro",
      price: "$4.99/semana",
      icon: Zap,
      features: ["200 créditos/semana", "Vídeos até 60s", "20 fotos", "Todos templates"],
      color: "border-primary",
      popular: true
    },
    {
      name: "VIP",
      price: "$9.99/semana",
      icon: Crown,
      features: ["Créditos ilimitados", "Vídeos até 2min", "Fotos ilimitadas", "4K Export"],
      color: "border-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-night-gradient" />
        <div className="absolute inset-0 bg-aurora opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 p-6">
          <div className="container mx-auto flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-8 h-8 text-accent" />
              <span className="font-display text-2xl font-bold text-foreground">YearRecap AI</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Link to="/pricing">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Preços
                </Button>
              </Link>
              {user ? (
                <Link to="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button className="bg-primary hover:bg-primary/90">
                    Começar Grátis
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="text-foreground">Sua </span>
            <span className="text-glow-blue text-primary">Retrospectiva</span>
            <br />
            <span className="text-glow-gold text-accent">2026</span>
            <span className="text-foreground"> em Minutos</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            Transforme suas fotos em vídeos incríveis com IA. 
            Transições cinematográficas, música e legendas animadas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to={user ? "/create" : "/auth"}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 shadow-glow-blue">
                <Play className="w-5 h-5 mr-2" />
                Criar Minha Retrospectiva
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-muted-foreground/30">
                Ver Planos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-center gap-12 mt-16"
          >
            {[
              { value: "50+", label: "Créditos Grátis" },
              { value: "5", label: "Templates" },
              { value: "2min", label: "Vídeos" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-card/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Como Funciona
            </h2>
            <p className="text-xl text-muted-foreground">
              Simples, rápido e poderoso
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Templates de Legenda
            </h2>
            <p className="text-xl text-muted-foreground">
              Escolha o estilo perfeito para suas memórias
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {templates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`px-6 py-3 rounded-full bg-gradient-to-r ${template.color} cursor-pointer`}
              >
                <span className="font-medium text-foreground">{template.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-4 bg-card/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Planos para Todos
            </h2>
            <p className="text-xl text-muted-foreground">
              Comece grátis, upgrade quando quiser
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 bg-card ${plan.color} ${plan.popular ? 'border-2 relative' : ''} h-full`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                      Popular
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${plan.popular ? 'bg-primary/20' : 'bg-muted'} flex items-center justify-center`}>
                      <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground">{plan.name}</h3>
                      <p className="text-lg font-bold text-primary">{plan.price}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/pricing">
              <Button variant="outline" size="lg">
                Ver Todos os Detalhes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto relative z-10 text-center"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Pronto para Criar?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Transforme suas memórias em algo especial. Comece agora com 50 créditos grátis.
          </p>
          <Link to={user ? "/create" : "/auth"}>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 shadow-glow-gold">
              <Sparkles className="w-5 h-5 mr-2" />
              Começar Agora
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="font-display text-xl font-bold text-foreground">YearRecap AI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link to="/terms-of-service" className="hover:text-foreground transition-colors">
                Termos de Serviço
              </Link>
              <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/refund-policy" className="hover:text-foreground transition-colors">
                Política de Reembolso
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 YearRecap AI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
