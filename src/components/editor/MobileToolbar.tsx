import { useState } from "react";
import {
  Image as ImageIcon,
  Wand2,
  Music,
  Scissors,
  Type,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MusicTrack } from "./MusicLibrary";

interface MobileToolbarProps {
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
  photoCount: number;
}

export function MobileToolbar({
  activePanel,
  onPanelChange,
  photoCount,
}: MobileToolbarProps) {
  const tools = [
    { id: "media", icon: ImageIcon, label: "Mídia", badge: photoCount > 0 ? photoCount : undefined },
    { id: "ai", icon: Wand2, label: "IA" },
    { id: "text", icon: Type, label: "Texto" },
    { id: "audio", icon: Music, label: "Áudio" },
    { id: "tools", icon: Scissors, label: "Editar" },
  ];

  return (
    <div className="h-16 bg-card border-t border-border flex items-center justify-around px-2 safe-area-bottom">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activePanel === tool.id;

        return (
          <button
            key={tool.id}
            onClick={() => onPanelChange(isActive ? null : tool.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[56px]",
              isActive
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {tool.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  {tool.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
}

interface MobilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function MobilePanel({ isOpen, onClose, title, children }: MobilePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 bg-card border-t border-border rounded-t-2xl shadow-2xl max-h-[60vh] flex flex-col animate-in slide-in-from-bottom duration-200">
      {/* Handle */}
      <div className="flex items-center justify-center py-2">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
        <h3 className="font-medium">{title}</h3>
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}
