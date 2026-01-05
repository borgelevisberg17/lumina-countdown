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
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExportFormat, ExportQuality, TransitionStyle } from "@/hooks/useVideoExport";
import { cn } from "@/lib/utils";
import { MusicLibrary, MusicTrack } from "./MusicLibrary";

const TEXT_TEMPLATES = [
  { id: "fade_in", name: "Fade-In", icon: "✨" },
  { id: "bounce", name: "Bounce", icon: "🎾" },
  { id: "typewriter", name: "Typewriter", icon: "⌨️" },
  { id: "slide_up_glow", name: "Slide Glow", icon: "🌟" },
  { id: "rotate_zoom", name: "Rotate Zoom", icon: "🔄" },
];

interface EditorToolsPanelProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  textTemplate: string;
  onTextTemplateChange: (template: string) => void;
  transitionStyle: TransitionStyle;
  onTransitionStyleChange: (style: TransitionStyle) => void;
  exportQuality: ExportQuality;
  onExportQualityChange: (q: ExportQuality) => void;
  exportFormat: ExportFormat;
  onExportFormatChange: (f: ExportFormat) => void;
  videoSpecs: any;
  isProcessing: boolean;
  isGenerating: boolean;
  onProcessPrompt: () => void;
  onGenerateVideo: () => void;
  credits: number;
  photoCount: number;
  plan: string;
  autoCutEnabled: boolean;
  onAutoCutChange: (enabled: boolean) => void;
  autoCCEnabled: boolean;
  onAutoCCChange: (enabled: boolean) => void;
  isAnalyzing: boolean;
  onRunAIAnalysis: () => void;
  aiAnalysisComplete: boolean;
  selectedTrack: MusicTrack | null;
  onSelectTrack: (track: MusicTrack | null) => void;
  musicVolume: number;
  onMusicVolumeChange: (volume: number) => void;
  isMobile?: boolean;
}

export function EditorToolsPanel({
  prompt,
  onPromptChange,
  textTemplate,
  onTextTemplateChange,
  transitionStyle,
  onTransitionStyleChange,
  exportQuality,
  onExportQualityChange,
  exportFormat,
  onExportFormatChange,
  videoSpecs,
  isProcessing,
  isGenerating,
  onProcessPrompt,
  onGenerateVideo,
  credits,
  photoCount,
  plan,
  autoCutEnabled,
  onAutoCutChange,
  autoCCEnabled,
  onAutoCCChange,
  isAnalyzing,
  onRunAIAnalysis,
  aiAnalysisComplete,
  selectedTrack,
  onSelectTrack,
  musicVolume,
  onMusicVolumeChange,
  isMobile = false,
}: EditorToolsPanelProps) {
  const [activeTab, setActiveTab] = useState("ai");
  const [selectedEffect, setSelectedEffect] = useState("Nenhum");

  const estimatedCredits = photoCount <= 10 ? 10 : photoCount <= 20 ? 20 : 40;
  const maxDuration = plan === "free" ? 30 : plan === "pro" ? 60 : 120;

  const effects = ["Nenhum", "Vintage", "Glow", "B&W", "Neon", "Soft"];

  return (
    <div className={cn(
      "bg-card border-border flex flex-col",
      isMobile 
        ? "w-full h-full border-t" 
        : "w-80 border-l h-full"
    )}>
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-border shrink-0">
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className={cn(
          "mx-3 md:mx-4 mt-3 md:mt-4 shrink-0",
          isMobile ? "grid grid-cols-4" : "grid grid-cols-4"
        )}>
          <TabsTrigger value="ai" className="text-xs gap-1">
            <Wand2 className="w-4 h-4" />
            {isMobile && <span className="hidden sm:inline">IA</span>}
          </TabsTrigger>
          <TabsTrigger value="text" className="text-xs gap-1">
            <Type className="w-4 h-4" />
            {isMobile && <span className="hidden sm:inline">Texto</span>}
          </TabsTrigger>
          <TabsTrigger value="audio" className="text-xs gap-1">
            <Music className="w-4 h-4" />
            {isMobile && <span className="hidden sm:inline">Áudio</span>}
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-xs gap-1">
            <Scissors className="w-4 h-4" />
            {isMobile && <span className="hidden sm:inline">Tools</span>}
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="ai" className="p-3 md:p-4 space-y-4 mt-0">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Prompt IA
              </Label>
              <Textarea
                placeholder="Descreva como você quer sua retrospectiva..."
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                rows={isMobile ? 3 : 4}
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
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Duração máx: {maxDuration}s</span>
                <span className="ml-auto">~{estimatedCredits} créditos</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="text" className="p-3 md:p-4 space-y-4 mt-0">
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

          <TabsContent value="audio" className="p-3 md:p-4 mt-0 h-full">
            <MusicLibrary
              selectedTrack={selectedTrack}
              onSelectTrack={onSelectTrack}
              volume={musicVolume}
              onVolumeChange={onMusicVolumeChange}
            />
          </TabsContent>

          <TabsContent value="tools" className="p-3 md:p-4 space-y-4 mt-0">
            {/* AI Analysis Button */}
            {(autoCutEnabled || autoCCEnabled) && !aiAnalysisComplete && (
              <Button
                onClick={onRunAIAnalysis}
                disabled={isAnalyzing || photoCount === 0}
                className="w-full"
                variant="secondary"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Executar Análise IA
                  </>
                )}
              </Button>
            )}

            {aiAnalysisComplete && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-emerald-500">Análise IA concluída</span>
              </div>
            )}

            {/* Auto-Cut */}
            <div className={cn(
              "p-4 rounded-lg border",
              autoCutEnabled 
                ? "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20" 
                : "bg-muted/50 border-border"
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className={cn("w-4 h-4", autoCutEnabled ? "text-primary" : "text-muted-foreground")} />
                  <span className="font-medium text-sm">Auto-Cut IA</span>
                </div>
                <Switch
                  checked={autoCutEnabled}
                  onCheckedChange={onAutoCutChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                IA analisa e seleciona os melhores momentos automaticamente
              </p>
            </div>

            {/* Auto CC */}
            <div className={cn(
              "p-4 rounded-lg border",
              autoCCEnabled 
                ? "bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20" 
                : "bg-muted/50 border-border"
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Captions className={cn("w-4 h-4", autoCCEnabled ? "text-secondary" : "text-muted-foreground")} />
                  <span className="font-medium text-sm">Legendas Auto</span>
                </div>
                <Switch
                  checked={autoCCEnabled}
                  onCheckedChange={onAutoCCChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Gera legendas automaticamente com IA
              </p>
            </div>

            {/* Export + Transitions */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Preview & Exportação</span>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Transição do preview</Label>
                <Select value={transitionStyle} onValueChange={(v) => onTransitionStyleChange(v as TransitionStyle)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Qualidade</Label>
                  <Select value={exportQuality} onValueChange={(v) => onExportQualityChange(v as ExportQuality)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Qualidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                      <SelectItem value="4k">4K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Formato</Label>
                  <Select value={exportFormat} onValueChange={(v) => onExportFormatChange(v as ExportFormat)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="webm">WebM</SelectItem>
                      <SelectItem value="mp4">MP4 (se suportado)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Dica: MP4 depende do suporte do navegador; “Auto” escolhe o melhor disponível.
              </p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Actions */}
      <div className="p-3 md:p-4 border-t border-border space-y-2 shrink-0">
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
