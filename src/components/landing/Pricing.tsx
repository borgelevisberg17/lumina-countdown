import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Zap, Crown, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "Grátis",
    period: "para sempre",
    icon: Star,
    description: "Perfeito para experimentar",
    features: [
      "50 créditos iniciais",
      "20 créditos/semana",
      "Vídeos até 30 segundos",
      "Até 10 fotos por vídeo",
      "1 template de legenda",
      "Transições básicas"
    ],
    buttonText: "Começar Grátis",
    buttonVariant: "outline" as const,
    gradient: "from-muted to-muted/50"
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "/semana",
    icon: Zap,
    description: "Para criadores frequentes",
    features: [
      "200 créditos/semana",
      "Vídeos até 60 segundos",
      "Até 20 fotos por vídeo",
      "Todos os 5 templates",
      "Transições IA avançadas",
      "Música personalizada",
      "Preview em HD",
      "Prompts customizados"
    ],
    buttonText: "Começar Pro",
    buttonVariant: "default" as const,
    popular: true,
    gradient: "from-primary to-primary/50"
  },
  {
    name: "VIP",
    price: "$9.99",
    period: "/semana",
    icon: Crown,
    description: "Para profissionais",
    features: [
      "Créditos ilimitados",
      "Vídeos até 2 minutos",
      "Fotos ilimitadas",
      "Tudo do Pro",
      "Export em 4K",
      "Música gerada por IA",
      "Efeitos avançados",
      "Suporte prioritário"
    ],
    buttonText: "Começar VIP",
    buttonVariant: "outline" as const,
    gradient: "from-accent to-accent/50"
  }
];

export const Pricing = () => {
  return (
    <section className="py-24 px-4 relative" id="precos">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Preços</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-foreground">
            Escolha seu plano
          </h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Comece grátis e faça upgrade quando precisar de mais
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative rounded-3xl ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className={`h-full p-8 rounded-3xl border ${plan.popular ? 'border-primary bg-card shadow-xl shadow-primary/10' : 'border-border/50 bg-background'}`}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} p-0.5`}>
                    <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                      <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button 
                  variant={plan.buttonVariant}
                  className={`w-full py-6 rounded-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  asChild
                >
                  <Link to="/auth">
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          Todos os planos incluem processamento via Paddle. Cancele quando quiser.
        </motion.p>
      </div>
    </section>
  );
};
