import { useState, useEffect } from "react";
import { Play, Pause, Download, Loader2, CheckCircle2, Clock, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type VideoStatus = "pending" | "processing" | "completed" | "failed";

interface VideoData {
  id: string;
  status: VideoStatus;
  storage_path: string | null;
  preview_path: string | null;
  title: string;
  created_at: string;
  error_message: string | null;
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
  onRefresh: () => void;
}

export function EditorPreview({
  photos,
  selectedPhotoId,
  lastVideo,
  isGenerating,
  onRefresh,
}: EditorPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId);

  // Auto-play slideshow
  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying, photos.length]);

  // Get video URL when completed
  useEffect(() => {
    if (lastVideo?.status === "completed" && lastVideo.storage_path) {
      const { data } = supabase.storage
        .from("videos")
        .getPublicUrl(lastVideo.storage_path);
      
      if (data?.publicUrl) {
        setVideoUrl(data.publicUrl);
      }
    }
  }, [lastVideo]);

  const handleDownload = async () => {
    if (!lastVideo?.storage_path) return;

    const { data, error } = await supabase.storage
      .from("videos")
      .download(lastVideo.storage_path);

    if (error || !data) return;

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lastVideo.title || "video"}.mp4`;
    a.click();
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

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="relative w-full max-w-2xl aspect-video bg-card rounded-xl overflow-hidden border border-border shadow-2xl">
          {/* Show video if completed */}
          {lastVideo?.status === "completed" && videoUrl ? (
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
            />
          ) : lastVideo?.status === "processing" || isGenerating ? (
            /* Processing state */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Loader2 className="w-8 h-8 absolute inset-0 m-auto text-primary animate-pulse" />
              </div>
              <p className="mt-6 text-sm font-medium">Gerando seu vídeo...</p>
              <p className="text-xs text-muted-foreground mt-1">
                Isso pode levar alguns minutos
              </p>
              <Progress value={33} className="w-48 mt-4" />
            </div>
          ) : selectedPhoto ? (
            /* Show selected photo */
            <img
              src={selectedPhoto.preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          ) : photos.length > 0 ? (
            /* Slideshow */
            <div className="relative w-full h-full">
              <img
                src={photos[currentSlide]?.preview}
                alt={`Slide ${currentSlide + 1}`}
                className="w-full h-full object-contain transition-opacity duration-500"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === currentSlide
                        ? "bg-primary w-6"
                        : "bg-foreground/30 hover:bg-foreground/50"
                    )}
                    onClick={() => setCurrentSlide(i)}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Play className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Adicione fotos para visualizar
              </p>
            </div>
          )}
        </div>

        {/* Play/Pause control */}
        {photos.length > 1 && !lastVideo?.status && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full w-12 h-12"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>
        )}
      </div>

      {/* Status Bar */}
      {lastVideo && (
        <div className="border-t border-border bg-card p-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              {(() => {
                const config = getStatusConfig(lastVideo.status);
                const Icon = config.icon;
                return (
                  <>
                    <div className={cn("p-2 rounded-lg", config.bgColor)}>
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          config.color,
                          lastVideo.status === "processing" && "animate-spin"
                        )}
                      />
                    </div>
                    <div>
                      <Badge variant="outline" className={config.color}>
                        {config.label}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lastVideo.title}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onRefresh}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              {lastVideo.status === "completed" && (
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
