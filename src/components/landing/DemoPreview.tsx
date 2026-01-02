import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const demoVideos = [
  {
    id: 1,
    title: "Retrospectiva de Viagens",
    description: "Transições suaves com música uplifting",
    thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format",
    duration: "0:45"
  },
  {
    id: 2,
    title: "Momentos em Família",
    description: "Tons quentes com legendas emotivas",
    thumbnail: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format",
    duration: "1:20"
  },
  {
    id: 3,
    title: "Conquistas do Ano",
    description: "Bounce animado com confetes",
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format",
    duration: "0:58"
  }
];

export const DemoPreview = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-24 px-4 relative overflow-hidden" id="demo">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-background" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Demonstração</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-foreground">
            Veja exemplos reais
          </h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Retrospectivas criadas por nossa comunidade de usuários
          </p>
        </motion.div>

        {/* Main Preview */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-3xl overflow-hidden border border-border/50 bg-card shadow-2xl shadow-primary/5"
          >
            {/* Video Thumbnail */}
            <img 
              src={demoVideos[activeVideo].thumbnail}
              alt={demoVideos[activeVideo].title}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

            {/* Play Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-foreground/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-background" />
                ) : (
                  <Play className="w-8 h-8 text-background ml-1" />
                )}
              </div>
            </motion.button>

            {/* Video Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-1">
                    {demoVideos[activeVideo].title}
                  </h3>
                  <p className="text-muted-foreground">
                    {demoVideos[activeVideo].description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-foreground/20 backdrop-blur-sm rounded-full text-sm text-foreground">
                    {demoVideos[activeVideo].duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/30 transition-colors">
                <Volume2 className="w-5 h-5 text-foreground" />
              </button>
              <button className="w-10 h-10 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/30 transition-colors">
                <Maximize2 className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </motion.div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-4 mt-6">
            {demoVideos.map((video, index) => (
              <motion.button
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveVideo(index)}
                className={`relative w-32 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  activeVideo === index 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-border/50 hover:border-primary/50'
                }`}
              >
                <img 
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/40" />
                <span className="absolute bottom-1 right-1 text-xs text-foreground bg-background/60 px-1.5 py-0.5 rounded">
                  {video.duration}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Interface Preview GIF Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            Interface simples e intuitiva
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "1. Upload de Fotos",
                description: "Arraste e solte suas imagens favoritas",
                gradient: "from-primary/20 to-primary/5"
              },
              {
                title: "2. Configure o Vídeo",
                description: "Escolha templates e escreva seu prompt",
                gradient: "from-secondary/20 to-secondary/5"
              },
              {
                title: "3. Gere e Baixe",
                description: "Aguarde a IA processar e faça download",
                gradient: "from-accent/20 to-accent/5"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${step.gradient} border border-border/50 p-6 flex flex-col justify-end relative overflow-hidden`}
              >
                {/* Animated Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-xl bg-foreground/10 border border-foreground/20"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
                  className="absolute top-1/4 right-1/4 w-8 h-8 rounded-full bg-primary/20"
                />

                <div className="relative z-10">
                  <h4 className="font-display text-lg font-semibold text-foreground mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
