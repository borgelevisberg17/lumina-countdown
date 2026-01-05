import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  UploadCloud,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type VideoStatus = "pending" | "processing" | "completed" | "failed";

type TransitionStyle = "fade" | "slide" | "zoom";

export interface VideoData {
  id: string;
  status: VideoStatus;
  storage_path: string | null;
  preview_path: string | null;
  title: string;
  created_at: string;
  error_message: string | null;
  metadata?: any;
}

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  caption: string;
}

interface EditorPreviewProps {
  photos: UploadedPhoto[];
  selectedPhotoId: string | null;
  lastVideo: VideoData | null;
  isGenerating: boolean;
  transitionStyle: TransitionStyle;
  isExporting: boolean;
  exportProgress: number;
  history: VideoData[];
  onSelectHistory: (video: VideoData) => void;
  onExport: (videoId: string) => void;
  onRefresh: () => void;
}

function getSlideMotion(transition: TransitionStyle) {
  switch (transition) {
    case "slide":
      return {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
      };
    case "zoom":
      return {
        initial: { opacity: 0, scale: 1.06 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
      };
    case "fade":
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
}

export function EditorPreview({
  photos,
  selectedPhotoId,
  lastVideo,
  isGenerating,
  transitionStyle,
  isExporting,
  exportProgress,
  history,
  onSelectHistory,
  onExport,
  onRefresh,
}: EditorPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId);

  const slideshowEnabled = useMemo(() => {
    // If user has a lastVideo object, we keep the preview focused on that state.
    return !lastVideo && photos.length > 0;
  }, [lastVideo, photos.length]);

  // Auto-play slideshow
  useEffect(() => {
    if (!slideshowEnabled || !isPlaying || photos.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying, photos.length, slideshowEnabled]);

  // Signed video URL when completed
  useEffect(() => {
    let cancelled = false;

    async function loadVideoUrl() {
      setVideoUrl(null);
      if (!lastVideo?.storage_path) return;
      if (lastVideo.status !== "completed") return;

      const { data, error } = await supabase.storage
        .from("videos")
        .createSignedUrl(lastVideo.storage_path, 60 * 60);

      if (cancelled) return;

      if (error) {
        console.error("Failed to create signed video URL:", error);
        return;
      }

      setVideoUrl(data?.signedUrl || null);
    }

    loadVideoUrl();

    return () => {
      cancelled = true;
    };
  }, [lastVideo?.id, lastVideo?.status, lastVideo?.storage_path]);

  const handleDownload = async () => {
    if (!lastVideo?.storage_path) {
      toast.error("Este render ainda não tem um arquivo exportado.");
      return;
    }

    const { data, error } = await supabase.storage
      .from("videos")
      .download(lastVideo.storage_path);

    if (error || !data) {
      console.error("Download error:", error);
      toast.error("Falha ao baixar o vídeo.");
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;

    const ext = lastVideo.storage_path.split(".").pop() || "webm";
    a.download = `${(lastVideo.title || "video").trim()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusConfig = (status: VideoStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          label: "Na fila",
          color: "text-muted-foreground",
          bgColor: "bg-muted",
        };
      case "processing":
        return {
          icon: Loader2,
          label: "Processando",
          color: "text-primary",
          bgColor: "bg-primary/10",
        };
      case "completed":
        return {
          icon: CheckCircle2,
          label: "Concluído",
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
        };
      case "failed":
        return {
          icon: AlertCircle,
          label: "Falhou",
          color: "text-destructive",
          bgColor: "bg-destructive/10",
        };
    }
  };

  const slideMotion = getSlideMotion(transitionStyle);

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="relative w-full max-w-3xl aspect-video bg-card rounded-xl overflow-hidden border border-border shadow-2xl">
          {/* Video / Processing */}
          {lastVideo?.status === "completed" ? (
            videoUrl ? (
              <video src={videoUrl} controls className="w-full h-full object-contain" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-6 text-center">
                <UploadCloud className="w-10 h-10 text-primary" />
                <p className="mt-3 text-sm font-medium">Arquivo ainda não exportado</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Clique em "Exportar" para gerar o arquivo final e liberar o download.
                </p>
                {isExporting ? (
                  <div className="w-56 mt-4">
                    <Progress value={exportProgress} />
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Exportando… {exportProgress}%
                    </p>
                  </div>
                ) : (
                  <Button
                    className="mt-4"
                    onClick={() => lastVideo?.id && onExport(lastVideo.id)}
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                )}
              </div>
            )
          ) : lastVideo?.status === "processing" || isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Loader2 className="w-8 h-8 absolute inset-0 m-auto text-primary animate-pulse" />
              </div>
              <p className="mt-6 text-sm font-medium">Renderizando seu vídeo…</p>
              <p className="text-xs text-muted-foreground mt-1">Isso pode levar alguns minutos</p>
              <Progress value={33} className="w-48 mt-4" />
            </div>
          ) : selectedPhoto ? (
            <img src={selectedPhoto.preview} alt="Preview" className="w-full h-full object-contain" />
          ) : photos.length > 0 ? (
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.img
                  key={photos[currentSlide]?.id || currentSlide}
                  src={photos[currentSlide]?.preview}
                  alt={`Slide ${currentSlide + 1}`}
                  className="w-full h-full object-contain"
                  initial={slideMotion.initial}
                  animate={slideMotion.animate}
                  exit={slideMotion.exit}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </AnimatePresence>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === currentSlide ? "bg-primary w-6" : "bg-foreground/30 hover:bg-foreground/50"
                    )}
                    onClick={() => setCurrentSlide(i)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Play className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Adicione fotos para visualizar</p>
            </div>
          )}
        </div>

        {/* Play/Pause control (slideshow) */}
        {slideshowEnabled && photos.length > 1 && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full w-12 h-12"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>
        )}
      </div>

      {/* Status Bar */}
      {lastVideo && (
        <div className="border-t border-border bg-card p-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {(() => {
                const config = getStatusConfig(lastVideo.status);
                const Icon = config.icon;
                return (
                  <>
                    <div className={cn("p-2 rounded-lg shrink-0", config.bgColor)}>
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          config.color,
                          lastVideo.status === "processing" && "animate-spin"
                        )}
                      />
                    </div>
                    <div className="min-w-0">
                      <Badge variant="outline" className={config.color}>
                        {config.label}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {lastVideo.title}
                      </p>
                      {lastVideo.status === "failed" && lastVideo.error_message && (
                        <p className="text-[11px] text-destructive mt-1 line-clamp-2">
                          {lastVideo.error_message}
                        </p>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={onRefresh}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">Histórico</Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[420px]">
                  <SheetHeader>
                    <SheetTitle>Histórico de renders</SheetTitle>
                    <SheetDescription>
                      Selecione um render para visualizar e baixar/exportar.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-4 space-y-2">
                    {(history || []).length === 0 ? (
                      <div className="text-sm text-muted-foreground">Nenhum render ainda.</div>
                    ) : (
                      history.map((v) => (
                        <button
                          key={v.id}
                          className={cn(
                            "w-full text-left p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors",
                            v.id === lastVideo.id && "bg-muted/40"
                          )}
                          onClick={() => onSelectHistory(v)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{v.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(v.created_at).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {v.status}
                            </Badge>
                          </div>
                          {v.status === "failed" && v.error_message && (
                            <p className="text-[11px] text-destructive mt-2 line-clamp-2">
                              {v.error_message}
                            </p>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {lastVideo.status === "completed" && !lastVideo.storage_path && (
                <Button size="sm" onClick={() => onExport(lastVideo.id)} disabled={isExporting}>
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              )}

              {lastVideo.status === "completed" && !!lastVideo.storage_path && (
                <Button size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
