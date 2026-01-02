import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const templates = [
  {
    id: "fade_in",
    name: "Fade-In",
    description: "Texto aparece gradualmente",
    preview: "Olá, Mundo!",
    color: "primary"
  },
  {
    id: "bounce",
    name: "Bounce",
    description: "Texto salta com energia",
    preview: "Festa! 🎉",
    color: "celebration-rose"
  },
  {
    id: "typewriter",
    name: "Typewriter",
    description: "Escrito letra por letra",
    preview: "Digitando...",
    isTypewriter: true,
    color: "celebration-teal"
  },
  {
    id: "slide_up_glow",
    name: "Slide Glow",
    description: "Desliza com brilho neon",
    preview: "Brilho ✨",
    glow: true,
    color: "secondary"
  },
  {
    id: "rotate_zoom",
    name: "Rotate Zoom",
    description: "Rotaciona e zoom in",
    preview: "Celebre! 🎊",
    color: "accent"
  }
];

const colorMap = {
  primary: "from-primary/20 to-primary/5",
  secondary: "from-secondary/20 to-secondary/5",
  accent: "from-accent/20 to-accent/5",
  "celebration-rose": "from-celebration-rose/20 to-celebration-rose/5",
  "celebration-teal": "from-celebration-teal/20 to-celebration-teal/5"
};

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
    }, 120);
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
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1.5 } };
      case "bounce":
        return { initial: { scale: 0, y: -40 }, animate: { scale: 1, y: 0 }, transition: { type: "spring" as const, bounce: 0.5 } };
      case "slide_up_glow":
        return { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
      case "rotate_zoom":
        return { initial: { scale: 0.6, rotate: -10, opacity: 0 }, animate: { scale: 1, rotate: 0, opacity: 1 }, transition: { duration: 0.6, type: "spring" as const } };
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 } };
    }
  };

  const currentTemplate = templates[activeTemplate];
  const gradientClass = colorMap[currentTemplate.color as keyof typeof colorMap];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative" id="templates">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="inline-block text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
            Templates
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            5 estilos de legenda
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm sm:text-base">
            Clique para ver cada animação em ação
          </p>
        </motion.div>

        {/* Preview Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`relative h-48 sm:h-56 md:h-64 lg:h-72 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${gradientClass} border border-border/50 flex items-center justify-center mb-6 sm:mb-8 overflow-hidden`}
        >
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
          
          {currentTemplate.isTypewriter ? (
            <div key={key} className="relative z-10 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground px-4 text-center">
              <TypewriterText text={currentTemplate.preview} />
            </div>
          ) : (
            <motion.div
              key={key}
              {...getAnimationProps(currentTemplate.id)}
              className={`relative z-10 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground px-4 text-center ${currentTemplate.glow ? 'text-glow-primary' : ''}`}
            >
              {currentTemplate.preview}
            </motion.div>
          )}
        </motion.div>

        {/* Template Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {templates.map((template, index) => (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleTemplateClick(index)}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTemplate === index
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {template.name}
            </motion.button>
          ))}
        </div>

        {/* Description */}
        <motion.p
          key={activeTemplate}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground mt-4 sm:mt-6 text-sm"
        >
          {currentTemplate.description}
        </motion.p>
      </div>
    </section>
  );
};
