import { motion } from "framer-motion";
import { Upload, Wand2, Sparkles, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Faça Upload",
    description: "Arraste e solte suas fotos favoritas. Até 20 fotos no plano Pro.",
    color: "primary"
  },
  {
    number: "02",
    icon: Wand2,
    title: "Personalize",
    description: "Escolha um template e escreva um prompt para a IA.",
    color: "secondary"
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Gere com IA",
    description: "Nossa IA cria transições, efeitos e música personalizados.",
    color: "celebration-rose"
  },
  {
    number: "04",
    icon: Download,
    title: "Baixe",
    description: "Exporte em alta qualidade e compartilhe nas redes.",
    color: "celebration-teal"
  }
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    text: "text-primary",
    gradient: "from-primary to-primary/50"
  },
  secondary: {
    bg: "bg-secondary/10",
    border: "border-secondary/20",
    text: "text-secondary",
    gradient: "from-secondary to-secondary/50"
  },
  "celebration-rose": {
    bg: "bg-celebration-rose/10",
    border: "border-celebration-rose/20",
    text: "text-celebration-rose",
    gradient: "from-celebration-rose to-celebration-rose/50"
  },
  "celebration-teal": {
    bg: "bg-celebration-teal/10",
    border: "border-celebration-teal/20",
    text: "text-celebration-teal",
    gradient: "from-celebration-teal to-celebration-teal/50"
  }
};

export const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative" id="como-funciona">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
            Como Funciona
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            4 passos simples
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Crie vídeos profissionais em minutos, sem conhecimento técnico
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, index) => {
            const colors = colorClasses[step.color as keyof typeof colorClasses];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-5 sm:p-6 rounded-2xl bg-card border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  {/* Step Number */}
                  <span className={`inline-block text-4xl sm:text-5xl font-display font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-4`}>
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4`}>
                    <step.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-lg sm:text-xl font-semibold mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
