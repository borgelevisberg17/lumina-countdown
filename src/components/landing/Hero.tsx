import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, ArrowRight } from "lucide-react";

interface HeroProps {
  isLoggedIn: boolean;
}

export const Hero = ({ isLoggedIn }: HeroProps) => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.25),transparent)]" />
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Floating Orbs - More subtle */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-[10%] w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-primary/15 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-[10%] w-56 sm:w-72 lg:w-96 h-56 sm:h-72 lg:h-96 bg-secondary/10 rounded-full blur-[120px]"
      />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Gerador de Retrospectivas com IA
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-6 leading-[1.1] tracking-tight"
        >
          <span className="text-foreground">Transforme memórias</span>
          <br />
          <span className="text-gradient">em vídeos incríveis</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4"
        >
          Faça upload de suas fotos e deixe nossa IA criar vídeos com transições cinematográficas, música e legendas animadas.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
        >
          <Link to={isLoggedIn ? "/create" : "/auth"} className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium shadow-glow-primary/50"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current" />
              Começar Grátis
            </Button>
          </Link>
          <a href="#demo" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full border-border hover:bg-muted"
            >
              Ver Demonstração
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-border/50 max-w-2xl mx-auto"
        >
          {[
            { value: "50+", label: "Créditos Grátis" },
            { value: "5", label: "Templates" },
            { value: "2min", label: "Vídeos até" },
            { value: "4K", label: "Qualidade" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-display text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
