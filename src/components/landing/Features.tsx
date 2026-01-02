import { motion } from "framer-motion";
import { 
  Wand2, 
  Music, 
  Type, 
  Layers, 
  Palette, 
  Zap,
  Sparkles,
  Video
} from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "Transições IA",
    description: "Transições cinematográficas geradas automaticamente baseadas no contexto das suas fotos."
  },
  {
    icon: Music,
    title: "Música Personalizada",
    description: "Escolha de biblioteca royalty-free ou faça upload da sua própria trilha sonora."
  },
  {
    icon: Type,
    title: "5 Templates de Texto",
    description: "Fade-in, Bounce, Typewriter, Slide-Up Glow e Rotate & Zoom para suas legendas."
  },
  {
    icon: Layers,
    title: "Efeitos Avançados",
    description: "Partículas, slow-motion, blur cinematográfico e muito mais no plano VIP."
  },
  {
    icon: Palette,
    title: "Temas Personalizados",
    description: "A IA interpreta seu prompt e ajusta cores, velocidade e estilo do vídeo."
  },
  {
    icon: Zap,
    title: "Processamento Rápido",
    description: "Vídeos gerados em minutos graças à nossa infraestrutura otimizada."
  }
];

export const Features = () => {
  return (
    <section className="py-24 px-4 relative" id="recursos">
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
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Recursos</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-foreground">
            Tudo que você precisa
          </h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Ferramentas profissionais de edição acessíveis para todos
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="h-full p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-300">
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-foreground/10 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Prompts Customizados
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    "Faça um vídeo nostálgico com tons quentes focando em viagens..."
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-foreground/10 backdrop-blur-sm flex items-center justify-center">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Vídeos até 2min
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Export em 4K com qualidade profissional
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
