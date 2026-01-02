import { motion } from "framer-motion";
import { Play, Pause, Volume2, Maximize2 } from "lucide-react";
import { useState } from "react";

const demoVideos = [
  {
    id: 1,
    title: "Retrospectiva de Viagens",
    description: "Transições suaves com música uplifting",
    thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&q=80",
    duration: "0:45"
  },
  {
    id: 2,
    title: "Momentos em Família",
    description: "Tons quentes com legendas emotivas",
    thumbnail: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&q=80",
    duration: "1:20"
  },
  {
    id: 3,
    title: "Conquistas do Ano",
    description: "Bounce animado com confetes",
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&q=80",
    duration: "0:58"
  }
];

const interfaceSteps = [
  {
    title: "1. Upload de Fotos",
    description: "Arraste e solte suas imagens",
    color: "primary"
  },
  {
    title: "2. Configure",
    description: "Escolha templates e prompt",
    color: "secondary"
  },
  {
    title: "3. Gere e Baixe",
    description: "Aguarde e faça download",
    color: "accent"
  }
];

const colorClasses = {
  primary: "from-primary/15 to-primary/5 border-primary/20",
  secondary: "from-secondary/15 to-secondary/5 border-secondary/20",
  accent: "from-accent/15 to-accent/5 border-accent/20"
};

export const DemoPreview = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="demo">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-background" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="inline-block text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
            Demonstração
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Veja exemplos reais
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm sm:text-base">
            Retrospectivas criadas por nossa comunidade
          </p>
        </motion.div>

        {/* Main Preview */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-border/50 bg-card shadow-2xl shadow-primary/5"
          >
            {/* Video Thumbnail */}
            <img 
              src={demoVideos[activeVideo].thumbnail}
              alt={demoVideos[activeVideo].title}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

            {/* Play Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-foreground/95 backdrop-blur-sm flex items-center justify-center shadow-xl">
                {isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-background" />
                ) : (
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-background ml-1" />
                )}
              </div>
            </motion.button>

            {/* Video Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1">
                    {demoVideos[activeVideo].title}
                  </h3>
                  <p className="text-muted-foreground text-sm hidden sm:block">
                    {demoVideos[activeVideo].description}
                  </p>
                </div>
                <span className="shrink-0 px-3 py-1.5 bg-foreground/20 backdrop-blur-sm rounded-full text-xs sm:text-sm text-foreground">
                  {demoVideos[activeVideo].duration}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
              <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/30 transition-colors">
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              </button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/30 transition-colors">
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              </button>
            </div>
          </motion.div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
            {demoVideos.map((video, index) => (
              <motion.button
                key={video.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                onClick={() => setActiveVideo(index)}
                className={`relative w-20 h-14 sm:w-28 sm:h-16 lg:w-32 lg:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  activeVideo === index 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-border/50 hover:border-primary/40'
                }`}
              >
                <img 
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/30" />
                <span className="absolute bottom-1 right-1 text-[10px] sm:text-xs text-foreground bg-background/60 px-1.5 py-0.5 rounded">
                  {video.duration}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Interface Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20"
        >
          <h3 className="font-display text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-foreground">
            Interface simples e intuitiva
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {interfaceSteps.map((step, index) => {
              const colorClass = colorClasses[step.color as keyof typeof colorClasses];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`aspect-[4/3] rounded-xl sm:rounded-2xl bg-gradient-to-br ${colorClass} border p-5 sm:p-6 flex flex-col justify-end relative overflow-hidden`}
                >
                  {/* Animated Element */}
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                      opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-foreground/5 border border-foreground/10"
                  />

                  <div className="relative z-10">
                    <h4 className="font-display text-base sm:text-lg font-semibold text-foreground mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
