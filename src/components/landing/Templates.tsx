import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const templates = [
  {
    id: "fade_in",
    name: "Fade-In Simples",
    description: "Texto aparece gradualmente com fundo transparente",
    preview: "Olá, Mundo!",
    gradient: "from-primary/20 to-primary/5"
  },
  {
    id: "bounce",
    name: "Bounce Animado",
    description: "Texto \"salta\" para dentro da tela com energia",
    preview: "Festa! 🎉",
    gradient: "from-celebration-rose/20 to-celebration-purple/5"
  },
  {
    id: "typewriter",
    name: "Typewriter Effect",
    description: "Texto \"escrito\" letra por letra",
    preview: "Digitando...",
    isTypewriter: true,
    gradient: "from-celebration-teal/20 to-celebration-teal/5"
  },
  {
    id: "slide_up_glow",
    name: "Slide-Up Glow",
    description: "Texto desliza com brilho neon",
    preview: "Brilho ✨",
    glow: true,
    gradient: "from-secondary/20 to-secondary/5"
  },
  {
    id: "rotate_zoom",
    name: "Rotate & Zoom",
    description: "Texto rotaciona e zoom in com confete",
    preview: "Celebre! 🎊",
    gradient: "from-accent/20 to-accent/5"
  }
];

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export const Templates = () => {
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [key, setKey] = useState(0);

  const handleTemplateClick = (index: number) => {
    setActiveTemplate(index);
    setKey(prev => prev + 1);
  };

  const getAnimationProps = (id: string) => {
    switch(id) {
      case "fade_in":
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 2 } };
      case "bounce":
        return { initial: { scale: 0, y: -50 }, animate: { scale: 1, y: 0 }, transition: { type: "spring" as const, bounce: 0.6 } };
      case "slide_up_glow":
        return { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } };
      case "rotate_zoom":
        return { initial: { scale: 0.5, rotate: -15, opacity: 0 }, animate: { scale: 1, rotate: 0, opacity: 1 }, transition: { duration: 0.8, type: "spring" as const } };
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1 } };
    }
  };

  return (
    <section className="py-24 px-4 relative" id="templates">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Templates</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-foreground">
            5 estilos de legenda
          </h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Clique para ver cada animação em ação
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`relative h-64 md:h-80 rounded-3xl bg-gradient-to-br ${templates[activeTemplate].gradient} border border-border/50 flex items-center justify-center mb-8 overflow-hidden`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            
            {templates[activeTemplate].isTypewriter ? (
              <div key={key} className="relative z-10 font-display text-4xl md:text-6xl font-bold text-foreground">
                <TypewriterText text={templates[activeTemplate].preview} />
              </div>
            ) : (
              <motion.div
                key={key}
                {...getAnimationProps(templates[activeTemplate].id)}
                className={`relative z-10 font-display text-4xl md:text-6xl font-bold text-foreground ${templates[activeTemplate].glow ? 'text-glow-blue' : ''}`}
              >
                {templates[activeTemplate].preview}
              </motion.div>
            )}
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {templates.map((template, index) => (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleTemplateClick(index)}
                className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTemplate === index
                    ? 'bg-foreground text-background shadow-lg'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                {template.name}
              </motion.button>
            ))}
          </div>

          <motion.p
            key={activeTemplate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground mt-6"
          >
            {templates[activeTemplate].description}
          </motion.p>
        </div>
      </div>
    </section>
  );
};
