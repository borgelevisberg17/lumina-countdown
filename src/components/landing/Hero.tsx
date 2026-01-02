import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, ArrowRight, ChevronDown } from "lucide-react";

interface HeroProps {
  isLoggedIn: boolean;
}

export const Hero = ({ isLoggedIn }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      {/* Floating Orbs */}
      <motion.div 
        animate={{ 
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[15%] w-72 h-72 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          y: [0, 30, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 right-[15%] w-96 h-96 bg-secondary/15 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl"
      />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto text-center max-w-5xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Gerador de Retrospectivas com IA
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-foreground">Transforme suas </span>
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-primary via-celebration-purple to-accent bg-clip-text text-transparent">
            memórias em vídeos
          </span>
          <br className="hidden sm:block" />
          <span className="text-foreground">incríveis</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Faça upload de suas fotos e deixe nossa IA criar vídeos emocionantes com transições cinematográficas, música personalizada e legendas animadas.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to={isLoggedIn ? "/create" : "/auth"}>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium min-w-[200px]"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Começar Grátis
            </Button>
          </Link>
          <Link to="#demo">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 rounded-full border-muted-foreground/30 hover:bg-muted/50 min-w-[200px]"
            >
              Ver Demonstração
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-16"
        >
          {[
            { value: "50+", label: "Créditos Grátis" },
            { value: "5", label: "Templates de Texto" },
            { value: "2min", label: "Vídeos até" },
            { value: "4K", label: "Qualidade Export" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};
