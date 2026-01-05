import { useState } from "react";
import {
  Wand2,
  Type,
  Music,
  Scissors,
  Sparkles,
  Captions,
  Palette,
  Sliders,
  ChevronRight,
  Play,
  Loader2,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TEXT_TEMPLATES = [
  { id: "fade_in", name: "Fade-In", icon: "✨" },
  { id: "bounce", name: "Bounce", icon: "🎾" },
  { id: "typewriter", name: "Typewriter", icon: "⌨️" },
  { id: "slide_up_glow", name: "Slide Glow", icon: "🌟" },
  { id: "rotate_zoom", name: "Rotate Zoom", icon: "🔄" },
];

const MUSIC_MOODS = [
  { id: "uplifting", name: "Uplifting", emoji: "🎉" },
  { id: "emotional", name: "Emocional", emoji: "💫" },
  { id: "energetic", name: "Energético", emoji: "⚡" },
  { id: "calm", name: "Calmo", emoji: "🌊" },
  { id: "cinematic", name: "Cinematográfico", emoji: "🎬" },
];

interface EditorToolsPanelProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  textTemplate: string;
  onTextTemplateChange: (template: string) => void;
  videoSpecs: any;
  isProcessing: boolean;
  isGenerating: boolean;
  onProcessPrompt: () => void;
  onGenerateVideo: () => void;
  credits: number;
  photoCount: number;
  plan: string;
}

export function EditorToolsPanel({
  prompt,
  onPromptChange,
  textTemplate,
  onTextTemplateChange,
  videoSpecs,
  isProcessing,
  isGenerating,
  onProcessPrompt,
  onGenerateVideo,
  credits,
  photoCount,
  plan,
}: EditorToolsPanelProps) {
  const [activeTab, setActiveTab] = useState("ai");
  const [autoCutEnabled, setAutoCutEnabled] = useState(false);
  const [autoCCEnabled, setAutoCCEnabled] = useState(false);
  const [selectedMood, setSelectedMood] = useState("uplifting");

  const estimatedCredits = photoCount <= 10 ? 10 : photoCount <= 20 ? 20 : 40;
  const maxDuration = plan === "free" ? 30 : plan === "pro" ? 60 : 120;

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Ferramentas</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {credits} créditos
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 mx-4 mt-4">
          <TabsTrigger value="ai" className="text-xs">
            <Wand2 className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="text" className="text-xs">
            <Type className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="audio" className="text-xs">
            <Music className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-xs">
            <Scissors className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="ai" className="p-4 space-y-4 mt-0">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Prompt IA
              </Label>
              <Textarea
                placeholder="Descreva como você quer sua retrospectiva..."
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                rows={4}
                className="resize-none text-sm"
              />
            </div>

            {videoSpecs && (
              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                <p className="text-xs font-medium flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  Especificações
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>Tema: {videoSpecs.theme}</div>
                  <div>Transição: {videoSpecs.transitionStyle}</div>
                  <div>Música: {videoSpecs.musicMood}</div>
                  <div>Duração: {videoSpecs.suggestedDuration}s</div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Clock className="w-3 h-3" />
                <span>Duração máx: {maxDuration}s</span>
                <span className="ml-auto">~{estimatedCredits} créditos</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="text" className="p-4 space-y-4 mt-0">
            <Label className="text-xs text-muted-foreground">
              Template de Legenda
            </Label>
            <div className="space-y-2">
              {TEXT_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                    textTemplate === template.id
                      ? "bg-primary/20 ring-1 ring-primary"
                      : "bg-muted/50 hover:bg-muted"
                  )}
                  onClick={() => onTextTemplateChange(template.id)}
                >
                  <span className="text-lg">{template.icon}</span>
                  <span className="text-sm font-medium">{template.name}</span>
                  {textTemplate === template.id && (
                    <ChevronRight className="w-4 h-4 ml-auto text-primary" />
                  )}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audio" className="p-4 space-y-4 mt-0">
            <Label className="text-xs text-muted-foreground">
              Estilo de Música
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {MUSIC_MOODS.map((mood) => (
                <button
                  key={mood.id}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg transition-all",
                    selectedMood === mood.id
                      ? "bg-primary/20 ring-1 ring-primary"
                      : "bg-muted/50 hover:bg-muted"
                  )}
                  onClick={() => setSelectedMood(mood.id)}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs font-medium">{mood.name}</span>
                </button>
              ))}
            </div>

            <div className="pt-4">
              <Label className="text-xs text-muted-foreground mb-3 block">
                Volume da Música
              </Label>
              <Slider defaultValue={[70]} max={100} step={1} />
            </div>
          </TabsContent>

          <TabsContent value="tools" className="p-4 space-y-4 mt-0">
            {/* Auto-Cut */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Auto-Cut IA</span>
                </div>
                <Switch
                  checked={autoCutEnabled}
                  onCheckedChange={setAutoCutEnabled}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                IA analisa e seleciona os melhores momentos automaticamente
              </p>
            </div>

            {/* Auto CC */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Captions className="w-4 h-4 text-secondary" />
                  <span className="font-medium text-sm">Legendas Auto</span>
                </div>
                <Switch
                  checked={autoCCEnabled}
                  onCheckedChange={setAutoCCEnabled}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Gera legendas automaticamente com IA
              </p>
            </div>

            {/* Effects */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-accent" />
                <span className="font-medium text-sm">Efeitos Visuais</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Nenhum", "Vintage", "Glow", "B&W", "Neon", "Soft"].map(
                  (effect) => (
                    <button
                      key={effect}
                      className="p-2 text-xs rounded bg-background hover:bg-muted transition-colors"
                    >
                      {effect}
                    </button>
                  )
                )}
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {!videoSpecs ? (
          <Button
            className="w-full"
            onClick={onProcessPrompt}
            disabled={isProcessing || photoCount === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Analisar com IA
              </>
            )}
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-primary hover:opacity-90"
            onClick={onGenerateVideo}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Gerar Vídeo
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
