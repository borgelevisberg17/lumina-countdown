import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Instagram, 
  Twitter, 
  Facebook,
  Sparkles,
  ChevronRight,
  Camera,
  Star,
  Music,
  Plane,
  Gift
} from 'lucide-react';

const NewYearCelebration = () => {
  const [count, setCount] = useState(10);
  const [isCelebration, setIsCelebration] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const photoAlbums = [
    { 
      id: 1, 
      title: "Expedição Alpes 2025", 
      description: "O topo do mundo nunca pareceu tão perto. Gratidão por cada passo.",
      likes: "12.4k",
      comments: "842",
      shares: "156",
      platform: <Instagram className="w-4 h-4" />,
      icon: <Plane className="w-12 h-12 text-foreground/30" />,
      gradientClass: "bg-gradient-to-br from-celebration-blue to-celebration-purple",
      rotation: -8,
      delay: 0
    },
    { 
      id: 2, 
      title: "Lançamento Tech", 
      description: "Finalmente revelamos o que estávamos construindo. O futuro chegou!",
      likes: "45.1k",
      comments: "2.1k",
      shares: "8.4k",
      platform: <Twitter className="w-4 h-4" />,
      icon: <Star className="w-12 h-12 text-foreground/30" />,
      gradientClass: "bg-gradient-to-br from-muted to-background",
      rotation: 12,
      delay: 2
    },
    { 
      id: 3, 
      title: "Reunião de Família", 
      description: "Momentos que o tempo não apaga. Domingo de sol e sorrisos.",
      likes: "892",
      comments: "124",
      shares: "12",
      platform: <Facebook className="w-4 h-4" />,
      icon: <Heart className="w-12 h-12 text-foreground/30" />,
      gradientClass: "bg-gradient-to-br from-celebration-teal to-celebration-blue",
      rotation: -5,
      delay: 4
    },
    { 
      id: 4, 
      title: "Noite de Gala", 
      description: "Celebrando as conquistas de um ano intenso e produtivo.",
      likes: "5.6k",
      comments: "310",
      shares: "45",
      platform: <Instagram className="w-4 h-4" />,
      icon: <Gift className="w-12 h-12 text-foreground/30" />,
      gradientClass: "bg-gradient-to-br from-celebration-rose to-celebration-purple",
      rotation: 6,
      delay: 6
    },
    { 
      id: 5, 
      title: "Festival de Verão", 
      description: "A música, as luzes, a energia. Noites inesquecíveis de 2025.",
      likes: "23.8k",
      comments: "1.2k",
      shares: "890",
      platform: <Instagram className="w-4 h-4" />,
      icon: <Music className="w-12 h-12 text-foreground/30" />,
      gradientClass: "bg-gradient-to-br from-celebration-gold to-celebration-rose",
      rotation: -10,
      delay: 8
    }
  ];

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsCelebration(true);
    }
  }, [count]);

  // Fireworks Engine
  useEffect(() => {
    if (!isCelebration || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    interface ParticleType {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      friction: number;
      gravity: number;
      decay: number;
      update: () => void;
      draw: () => void;
    }

    interface RocketType {
      x: number;
      y: number;
      targetY: number;
      speed: number;
      color: string;
      update: () => boolean;
      draw: () => void;
      explode: () => void;
    }

    const particles: ParticleType[] = [];
    const rockets: RocketType[] = [];

    const colors = [
      'hsl(217, 91%, 60%)',  // Blue
      'hsl(280, 65%, 60%)',  // Purple
      'hsl(38, 92%, 60%)',   // Gold
      'hsl(350, 80%, 65%)',  // Rose
      'hsl(174, 72%, 50%)',  // Teal
      'hsl(0, 0%, 100%)',    // White
    ];

    class Rocket implements RocketType {
      x: number;
      y: number;
      targetY: number;
      speed: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height * 0.5);
        this.speed = Math.random() * 4 + 8;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.explode();
          return false;
        }
        return true;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        ctx!.fill();
        
        // Glowing trail
        const gradient = ctx!.createLinearGradient(this.x, this.y, this.x, this.y + 30);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        ctx!.beginPath();
        ctx!.moveTo(this.x, this.y);
        ctx!.lineTo(this.x, this.y + 30);
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 2;
        ctx!.stroke();
      }

      explode() {
        const count = 120 + Math.floor(Math.random() * 60);
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }
    }

    class Particle implements ParticleType {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      friction: number;
      gravity: number;
      decay: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * 12 + 2;
        this.vx = Math.cos(angle) * force;
        this.vy = Math.sin(angle) * force;
        this.alpha = 1;
        this.friction = 0.96;
        this.gravity = 0.12;
        this.decay = Math.random() * 0.015 + 0.005;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        ctx!.save();
        ctx!.globalAlpha = this.alpha;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        ctx!.shadowBlur = 15;
        ctx!.shadowColor = this.color;
        ctx!.fill();
        ctx!.restore();
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 15, 28, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.06) rockets.push(new Rocket());

      for (let i = rockets.length - 1; i >= 0; i--) {
        if (!rockets[i].update()) {
          rockets.splice(i, 1);
        } else {
          rockets[i].draw();
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        } else {
          particles[i].draw();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [isCelebration]);

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden font-display text-foreground flex flex-col items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-night-gradient" />
        <div className="absolute inset-0 bg-aurora animate-aurora opacity-50" style={{ backgroundSize: '400% 400%' }} />
        
        {/* Floating stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-foreground/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Floating Photo Albums */}
      {!isCelebration && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {photoAlbums.map((album, idx) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 400, rotate: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: [400, -800],
                rotate: [album.rotation, album.rotation * 1.5],
                x: Math.sin(idx * 1.5) * 80
              }}
              transition={{ 
                duration: 14, 
                repeat: Infinity, 
                delay: album.delay,
                ease: "linear" 
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2"
              style={{ marginLeft: idx % 2 === 0 ? '-45%' : '35%' }}
            >
              {/* Social Post Card */}
              <div className="w-60 md:w-72 bg-card rounded-xl shadow-2xl overflow-hidden flex flex-col text-card-foreground pointer-events-auto border border-border/20">
                {/* Header */}
                <div className="p-3 flex items-center justify-between border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${album.gradientClass} flex items-center justify-center`}>
                      <Camera className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="text-xs font-bold text-foreground">User_2025</span>
                  </div>
                  <div className="text-muted-foreground">{album.platform}</div>
                </div>
                
                {/* Image Area */}
                <div className={`h-44 w-full ${album.gradientClass} relative flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-background/10" />
                  {album.icon}
                </div>

                {/* Content */}
                <div className="p-4 bg-card">
                  <div className="flex gap-4 mb-3">
                    <Heart className="w-5 h-5 text-celebration-rose fill-celebration-rose" />
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-bold mb-1 text-foreground">{album.likes} curtidas</p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    <span className="font-bold text-foreground mr-1">{album.title}</span>
                    {album.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center text-[10px] text-muted-foreground/70 font-medium">
                    <span>Ver todos os {album.comments} comentários</span>
                    <span>{album.shares} shares</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main UI */}
      <div className="relative z-20 flex flex-col items-center text-center px-6">
        <AnimatePresence mode="wait">
          {!isCelebration ? (
            <motion.div
              key="countdown"
              exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
              className="flex flex-col items-center"
            >
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6 tracking-[0.4em] text-primary font-semibold text-sm uppercase"
              >
                <Sparkles className="inline-block w-4 h-4 mr-2" />
                Sincronizando Memórias
                <Sparkles className="inline-block w-4 h-4 ml-2" />
              </motion.div>
              
              <motion.span 
                key={count}
                initial={{ y: 30, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -30, opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-[10rem] md:text-[16rem] font-black leading-none tracking-tighter text-glow-blue bg-clip-text text-transparent bg-gradient-to-b from-foreground via-primary to-secondary"
              >
                {count}
              </motion.span>
              
              <motion.div 
                className="mt-8 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-primary" />
                <span className="text-muted-foreground text-sm tracking-widest uppercase">2025 → 2026</span>
                <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-primary" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-celebration-gold to-transparent" />
                <span className="text-lg md:text-2xl font-light tracking-[0.5em] text-celebration-gold uppercase">
                  Bem-vindo ao Futuro
                </span>
                <div className="h-[2px] w-16 bg-gradient-to-l from-transparent via-celebration-gold to-transparent" />
              </motion.div>

              <motion.h1 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
                className="text-8xl md:text-[16rem] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-foreground via-celebration-gold to-celebration-rose drop-shadow-2xl"
                style={{
                  textShadow: '0 0 80px hsl(38, 92%, 60%, 0.5), 0 0 120px hsl(350, 80%, 65%, 0.3)'
                }}
              >
                2026
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-12 flex flex-col items-center gap-8"
              >
                <p className="text-muted-foreground tracking-widest text-sm md:text-base max-w-md uppercase font-medium text-center">
                  Novas conexões, novos posts, <br/>a mesma essência.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCount(10);
                    setIsCelebration(false);
                  }}
                  className="group relative px-10 py-4 bg-foreground text-background rounded-full font-bold text-sm tracking-widest uppercase overflow-hidden transition-all hover:pr-14 shadow-glow-gold"
                >
                  <span className="relative z-10">Reiniciar</span>
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="fixed bottom-6 w-full px-10 flex justify-between items-end z-30 pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="h-1 w-12 bg-primary rounded-full" />
          <span className="text-[10px] font-mono text-primary/50 uppercase tracking-tighter">Data Stream: Active</span>
        </div>
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Retrospectiva 2025 © Digital Memories
        </div>
      </div>
    </div>
  );
};

export default NewYearCelebration;