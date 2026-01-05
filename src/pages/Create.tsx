import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan } from "@/hooks/useUserPlan";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVideoExport, ExportFormat, ExportQuality, TransitionStyle } from "@/hooks/useVideoExport";

import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { EditorPreview } from "@/components/editor/EditorPreview";
import { EditorToolsPanel } from "@/components/editor/EditorToolsPanel";
import { EditorTimeline } from "@/components/editor/EditorTimeline";
import { MobileToolbar, MobilePanel } from "@/components/editor/MobileToolbar";
import { MobileMediaPanel } from "@/components/editor/MobileMediaPanel";
import { MusicLibrary, MusicTrack } from "@/components/editor/MusicLibrary";

const DEFAULT_PROMPT =
  "Crie uma retrospectiva alegre do ano com minhas fotos, destacando momentos chave como viagens, amigos e conquistas. Use transições suaves, música uplifting e legendas animadas em branco sobre fundo azul claro.";

async function getBackendFunctionErrorMessage(error: any): Promise<string> {
  const ctx = error?.context;
  if (ctx && typeof ctx.json === "function") {
    const body = await ctx.json().catch(() => null);
    if (body?.required != null && body?.available != null) {
      return `Créditos insuficientes (precisa ${body.required}, você tem ${body.available}).`;
    }
    if (typeof body?.error === "string" && body.error.trim()) return body.error;
  }
  return (error?.message as string) || "Erro inesperado";
}

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  caption: string;
}

interface VideoData {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  storage_path: string | null;
  preview_path: string | null;
  title: string;
  created_at: string;
  error_message: string | null;
  metadata?: any;
}

export default function Create() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { subscription, credits, loading: planLoading, refetch } = useUserPlan();
  const isMobile = useIsMobile();
  const { isExporting, exportProgress, createSlideshow } = useVideoExport();

  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [textTemplate, setTextTemplate] = useState("fade_in");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoSpecs, setVideoSpecs] = useState<any>(null);
  const [lastVideo, setLastVideo] = useState<VideoData | null>(null);

  // New states for enhanced features
  const [autoCutEnabled, setAutoCutEnabled] = useState(false);
  const [autoCCEnabled, setAutoCCEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [musicVolume, setMusicVolume] = useState(70);

  // Preview/export settings
  const [transitionStyle, setTransitionStyle] = useState<TransitionStyle>("fade");
  const [exportQuality, setExportQuality] = useState<ExportQuality>("1080p");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("auto");

  // History
  const [videoHistory, setVideoHistory] = useState<VideoData[]>([]);

  // Mobile panel state
  const [activePanel, setActivePanel] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch last video on mount
  useEffect(() => {
    if (user) {
      fetchLastVideo();
      fetchVideoHistory();
    } else {
      setVideoHistory([]);
      setLastVideo(null);
    }
  }, [user]);

  const fetchLastVideo = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setLastVideo(data as VideoData);
    }
  };

  const fetchVideoHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) return;
    setVideoHistory((data || []) as VideoData[]);
  };

  const plan = subscription?.plan || "free";
  const maxPhotos = plan === "free" ? 10 : plan === "pro" ? 20 : 100;
  const maxDuration = plan === "free" ? 30 : plan === "pro" ? 60 : 120;

  // Auto-sync status while processing/pending
  useEffect(() => {
    if (!user || !lastVideo?.id) return;
    if (lastVideo.status !== "processing" && lastVideo.status !== "pending") return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("videos")
        .select("*")
        .eq("id", lastVideo.id)
        .maybeSingle();

      if (data) {
        setLastVideo(data as VideoData);
        setVideoHistory((prev) => {
          const next = [...prev];
          const idx = next.findIndex((v) => v.id === (data as any).id);
          if (idx >= 0) next[idx] = data as any;
          else next.unshift(data as any);
          return next.slice(0, 10);
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [user, lastVideo?.id, lastVideo?.status]);

  const handleRunAIAnalysis = async () => {
    if (photos.length === 0) {
      toast.error("Adicione pelo menos uma foto");
      return;
    }

    setIsAnalyzing(true);

    try {
      const action = autoCutEnabled && autoCCEnabled ? "analyze-all" : autoCutEnabled ? "auto-cut" : "auto-cc";
      
      const { data, error } = await supabase.functions.invoke("ai-analysis", {
        body: {
          photos: photos.map((p) => ({
            fileName: p.file.name,
            caption: p.caption,
          })),
          action,
          videoContext: prompt || "Retrospectiva do ano",
        },
      });

      if (error) throw error;

      // Apply AI suggestions
      if (data.result) {
        const result = data.result;

        // Reorder photos if auto-cut suggests it
        if (autoCutEnabled && result.suggestedOrder) {
          const reorderedPhotos = result.suggestedOrder
            .filter((idx: number) => idx < photos.length)
            .map((idx: number) => photos[idx]);
          setPhotos(reorderedPhotos);
        }

        // Apply captions if auto-cc is enabled
        if (autoCCEnabled && (result.captions || result.analysis)) {
          const captions = result.captions || result.analysis;
          const updatedPhotos = photos.map((photo, index) => {
            const captionData = captions.find((c: any) => c.photoIndex === index);
            if (captionData && (!photo.caption || photo.caption.trim() === "")) {
              return { ...photo, caption: captionData.caption };
            }
            return photo;
          });
          setPhotos(updatedPhotos);
        }

        setAiAnalysisComplete(true);
        toast.success("Análise IA concluída! Fotos otimizadas.");
      }
    } catch (error: any) {
      console.error("AI analysis error:", error);
      const message = await getBackendFunctionErrorMessage(error);
      toast.error(message || "Erro na análise IA");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProcessPrompt = async () => {
    if (photos.length === 0) {
      toast.error("Adicione pelo menos uma foto");
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("process-prompt", {
        body: {
          prompt: prompt || DEFAULT_PROMPT,
          photoCount: photos.length,
          duration: maxDuration,
        },
      });

      if (error) throw error;

      setVideoSpecs(data.specs);
      toast.success("Prompt processado! Revise as especificações.");
    } catch (error: any) {
      console.error("Error processing prompt:", error);
      const message = await getBackendFunctionErrorMessage(error);
      toast.error(message || "Erro ao processar prompt");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoSpecs) {
      toast.error("Processe o prompt primeiro");
      return;
    }

    setIsGenerating(true);

    try {
      // Upload photos to storage
      const uploadedPhotos = await Promise.all(
        photos.map(async (photo) => {
          const path = `${user!.id}/${crypto.randomUUID()}-${photo.file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("photos")
            .upload(path, photo.file);

          if (uploadError) throw uploadError;

          // Create photo record
          const { data: photoRecord, error: dbError } = await supabase
            .from("photos")
            .insert({
              user_id: user!.id,
              storage_path: path,
              file_name: photo.file.name,
              file_size: photo.file.size,
              mime_type: photo.file.type,
            })
            .select()
            .single();

          if (dbError) throw dbError;

          return { ...photoRecord, caption: photo.caption };
        })
      );

      // Create video record
      const { data: video, error: videoError } = await supabase
        .from("videos")
        .insert({
          user_id: user!.id,
          title: "Minha Retrospectiva 2025",
          prompt: prompt || DEFAULT_PROMPT,
          text_template: textTemplate as any,
          photo_count: photos.length,
        })
        .select()
        .single();

      if (videoError) throw videoError;

      setLastVideo(video as VideoData);

      // Generate video
      const { error } = await supabase.functions.invoke("generate-video", {
        body: {
          videoId: video.id,
          photoIds: uploadedPhotos.map((p) => p.id),
          specs: { 
            ...videoSpecs, 
            textTemplate,
            musicTrack: selectedTrack?.name,
            musicVolume,
          },
          captions: uploadedPhotos.map((p) => ({ photoId: p.id, caption: p.caption })),
        },
      });

      if (error) {
        const message = await getBackendFunctionErrorMessage(error);
        if (message.toLowerCase().includes("crédit")) {
          toast.error(message);
          return;
        }
        throw new Error(message);
      }

      await refetch();
      await fetchLastVideo();
      await fetchVideoHistory();
      toast.success("Render iniciado! Quando concluir, você poderá exportar/baixar.");
    } catch (error: any) {
      console.error("Error generating video:", error);
      toast.error(error.message || "Erro ao gerar vídeo");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportVideo = async (videoId: string) => {
    if (!user) return;

    try {
      // Load ordered photos + captions for this render
      const { data: rows, error } = await supabase
        .from("video_photos")
        .select("order_index, caption, photo:photos(storage_path, file_name)")
        .eq("video_id", videoId)
        .order("order_index", { ascending: true });

      if (error) throw error;

      const signedSlides = await Promise.all(
        (rows || []).map(async (row: any, idx: number) => {
          const storagePath = row?.photo?.storage_path as string | undefined;
          if (!storagePath) return null;

          const { data: signed, error: signedError } = await supabase.storage
            .from("photos")
            .createSignedUrl(storagePath, 60 * 60);

          if (signedError || !signed?.signedUrl) return null;

          return {
            id: `${videoId}-${idx}`,
            imageUrl: signed.signedUrl,
            caption: row?.caption || "",
          };
        })
      );

      const slides = signedSlides.filter(Boolean) as any[];
      if (slides.length === 0) {
        toast.error("Não foi possível carregar as fotos para exportar.");
        return;
      }

      const blob = await createSlideshow(slides, {
        quality: exportQuality,
        format: exportFormat,
        transition: transitionStyle,
      });

      if (!blob) {
        toast.error("Falha ao exportar o vídeo.");
        return;
      }

      const ext = blob.type.includes("mp4") ? "mp4" : "webm";
      const path = `${user.id}/${videoId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(path, blob, { contentType: blob.type, upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from("videos")
        .update({ storage_path: path })
        .eq("id", videoId);

      if (updateError) throw updateError;

      toast.success("Exportação concluída! Download liberado.");
      await fetchLastVideo();
      await fetchVideoHistory();
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error(error?.message || "Erro ao exportar");
    }
  };

  const updatePhotoCaption = (id: string, caption: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  if (authLoading || planLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="w-8 h-8 animate-pulse text-primary" />
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <EditorHeader plan={plan} credits={credits?.balance || 0} />

        {/* Preview - takes most space */}
        <div className="flex-1 min-h-0">
          <EditorPreview
            photos={photos}
            selectedPhotoId={selectedPhotoId}
            lastVideo={lastVideo}
            isGenerating={isGenerating}
            transitionStyle={transitionStyle}
            isExporting={isExporting}
            exportProgress={exportProgress}
            history={videoHistory}
            onSelectHistory={setLastVideo as any}
            onExport={handleExportVideo}
            onRefresh={async () => {
              await fetchLastVideo();
              await fetchVideoHistory();
            }}
          />
        </div>

        {/* Timeline */}
        <EditorTimeline
          photos={photos}
          selectedPhotoId={selectedPhotoId}
          onPhotosChange={setPhotos}
          onPhotoSelect={setSelectedPhotoId}
          duration={maxDuration}
        />

        {/* Bottom Toolbar */}
        <MobileToolbar
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          photoCount={photos.length}
        />

        {/* Mobile Panels */}
        <MobilePanel
          isOpen={activePanel === "media"}
          onClose={() => setActivePanel(null)}
          title="Mídia"
        >
          <MobileMediaPanel
            photos={photos}
            maxPhotos={maxPhotos}
            selectedPhotoId={selectedPhotoId}
            onPhotosChange={setPhotos}
            onPhotoSelect={setSelectedPhotoId}
            onUpdateCaption={updatePhotoCaption}
          />
        </MobilePanel>

        <MobilePanel
          isOpen={activePanel === "audio"}
          onClose={() => setActivePanel(null)}
          title="Música"
        >
          <MusicLibrary
            selectedTrack={selectedTrack}
            onSelectTrack={setSelectedTrack}
            volume={musicVolume}
            onVolumeChange={setMusicVolume}
          />
        </MobilePanel>

        <MobilePanel
          isOpen={activePanel === "ai" || activePanel === "text" || activePanel === "tools"}
          onClose={() => setActivePanel(null)}
          title={activePanel === "ai" ? "IA" : activePanel === "text" ? "Texto" : "Ferramentas"}
        >
          <EditorToolsPanel
            prompt={prompt}
            onPromptChange={setPrompt}
            textTemplate={textTemplate}
            onTextTemplateChange={setTextTemplate}
            transitionStyle={transitionStyle}
            onTransitionStyleChange={setTransitionStyle}
            exportQuality={exportQuality}
            onExportQualityChange={setExportQuality}
            exportFormat={exportFormat}
            onExportFormatChange={setExportFormat}
            videoSpecs={videoSpecs}
            isProcessing={isProcessing}
            isGenerating={isGenerating}
            onProcessPrompt={handleProcessPrompt}
            onGenerateVideo={handleGenerateVideo}
            credits={credits?.balance || 0}
            photoCount={photos.length}
            plan={plan}
            autoCutEnabled={autoCutEnabled}
            onAutoCutChange={setAutoCutEnabled}
            autoCCEnabled={autoCCEnabled}
            onAutoCCChange={setAutoCCEnabled}
            isAnalyzing={isAnalyzing}
            onRunAIAnalysis={handleRunAIAnalysis}
            aiAnalysisComplete={aiAnalysisComplete}
            selectedTrack={selectedTrack}
            onSelectTrack={setSelectedTrack}
            musicVolume={musicVolume}
            onMusicVolumeChange={setMusicVolume}
            isMobile
          />
        </MobilePanel>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <EditorHeader plan={plan} credits={credits?.balance || 0} />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Media */}
        <EditorSidebar
          photos={photos}
          maxPhotos={maxPhotos}
          selectedPhotoId={selectedPhotoId}
          onPhotosChange={setPhotos}
          onPhotoSelect={setSelectedPhotoId}
        />

        {/* Center - Preview + Timeline */}
        <div className="flex-1 flex flex-col min-h-0">
          <EditorPreview
            photos={photos}
            selectedPhotoId={selectedPhotoId}
            lastVideo={lastVideo}
            isGenerating={isGenerating}
            transitionStyle={transitionStyle}
            isExporting={isExporting}
            exportProgress={exportProgress}
            history={videoHistory}
            onSelectHistory={setLastVideo as any}
            onExport={handleExportVideo}
            onRefresh={async () => {
              await fetchLastVideo();
              await fetchVideoHistory();
            }}
          />

          {/* Timeline */}
          <EditorTimeline
            photos={photos}
            selectedPhotoId={selectedPhotoId}
            onPhotosChange={setPhotos}
            onPhotoSelect={setSelectedPhotoId}
            duration={maxDuration}
          />
        </div>

        {/* Right Sidebar - Tools */}
        <EditorToolsPanel
          prompt={prompt}
          onPromptChange={setPrompt}
          textTemplate={textTemplate}
          onTextTemplateChange={setTextTemplate}
          transitionStyle={transitionStyle}
          onTransitionStyleChange={setTransitionStyle}
          exportQuality={exportQuality}
          onExportQualityChange={setExportQuality}
          exportFormat={exportFormat}
          onExportFormatChange={setExportFormat}
          videoSpecs={videoSpecs}
          isProcessing={isProcessing}
          isGenerating={isGenerating}
          onProcessPrompt={handleProcessPrompt}
          onGenerateVideo={handleGenerateVideo}
          credits={credits?.balance || 0}
          photoCount={photos.length}
          plan={plan}
          autoCutEnabled={autoCutEnabled}
          onAutoCutChange={setAutoCutEnabled}
          autoCCEnabled={autoCCEnabled}
          onAutoCCChange={setAutoCCEnabled}
          isAnalyzing={isAnalyzing}
          onRunAIAnalysis={handleRunAIAnalysis}
          aiAnalysisComplete={aiAnalysisComplete}
          selectedTrack={selectedTrack}
          onSelectTrack={setSelectedTrack}
          musicVolume={musicVolume}
          onMusicVolumeChange={setMusicVolume}
        />
      </div>
    </div>
  );
}
