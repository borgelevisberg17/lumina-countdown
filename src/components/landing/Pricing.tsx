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
    color: "muted"
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
    color: "primary"
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
    color: "accent"
  }
];

export const Pricing = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative" id="precos">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="inline-block text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
            Preços
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Escolha seu plano
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm sm:text-base">
            Comece grátis e faça upgrade quando precisar
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-lg shadow-primary/25">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className={`h-full p-5 sm:p-6 rounded-2xl sm:rounded-3xl border ${
                plan.popular 
                  ? 'border-primary bg-card shadow-xl shadow-primary/10' 
                  : 'border-border/50 bg-card'
              }`}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-muted border border-border/50'
                  }`}>
                    <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5 sm:mb-6">
                  <span className="font-display text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button 
                  variant={plan.buttonVariant}
                  className={`w-full py-5 sm:py-6 rounded-full text-sm sm:text-base ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25' 
                      : ''
                  }`}
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

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs sm:text-sm text-muted-foreground mt-8 sm:mt-10"
        >
          Todos os planos incluem processamento via Paddle. Cancele quando quiser.
        </motion.p>
      </div>
    </section>
  );
};
