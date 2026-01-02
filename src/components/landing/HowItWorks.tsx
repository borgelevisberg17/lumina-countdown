import { motion } from "framer-motion";
import { Upload, Wand2, Sparkles, Download, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Faça Upload",
    description: "Arraste e solte suas fotos favoritas do ano. Suportamos até 20 fotos no plano Pro.",
    color: "from-primary to-primary/50"
  },
  {
    number: "02",
    icon: Wand2,
    title: "Personalize",
    description: "Escolha um template de texto, adicione legendas e escreva um prompt para a IA.",
    color: "from-secondary to-secondary/50"
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Gere com IA",
    description: "Nossa IA processa suas fotos e cria transições, efeitos e música personalizados.",
    color: "from-accent to-accent/50"
  },
  {
    number: "04",
    icon: Download,
    title: "Baixe e Compartilhe",
    description: "Exporte em alta qualidade e compartilhe nas redes sociais ou com amigos.",
    color: "from-celebration-teal to-celebration-teal/50"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden" id="como-funciona">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Como Funciona</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-foreground">
            4 passos simples
          </h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Crie vídeos profissionais em minutos, sem conhecimento técnico
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connector Arrow (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-2 z-10">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
                </div>
              )}

              <div className="h-full p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5">
                {/* Step Number */}
                <span className={`inline-block text-5xl font-display font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-4`}>
                  {step.number}
                </span>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${step.color} p-0.5 mb-4`}>
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-foreground" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
