import { motion } from "framer-motion";
import { 
  Wand2, 
  Music, 
  Type, 
  Layers, 
  Palette, 
  Zap
} from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "Transições IA",
    description: "Transições cinematográficas geradas automaticamente baseadas no contexto."
  },
  {
    icon: Music,
    title: "Música Personalizada",
    description: "Biblioteca royalty-free ou faça upload da sua própria trilha sonora."
  },
  {
    icon: Type,
    title: "5 Templates",
    description: "Fade-in, Bounce, Typewriter, Slide-Up Glow e Rotate & Zoom."
  },
  {
    icon: Layers,
    title: "Efeitos Avançados",
    description: "Partículas, slow-motion e blur cinematográfico no plano VIP."
  },
  {
    icon: Palette,
    title: "Temas IA",
    description: "A IA interpreta seu prompt e ajusta cores, velocidade e estilo."
  },
  {
    icon: Zap,
    title: "Processamento Rápido",
    description: "Vídeos gerados em minutos com nossa infraestrutura otimizada."
  }
];

export const Features = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative" id="recursos">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
            Recursos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Tudo que você precisa
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Ferramentas profissionais de edição acessíveis para todos
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group"
            >
              <div className="h-full p-5 sm:p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300">
                {/* Icon */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-12"
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-border/50 p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent)]" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-1">
                  Prompts Customizados
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  "Crie um vídeo nostálgico com tons quentes focando em viagens..."
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-sm font-medium text-primary">Vídeos até 2min • Export 4K</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
