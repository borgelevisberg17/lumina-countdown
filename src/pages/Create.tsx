import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan } from "@/hooks/useUserPlan";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { EditorPreview } from "@/components/editor/EditorPreview";
import { EditorToolsPanel } from "@/components/editor/EditorToolsPanel";

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
}

export default function Create() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { subscription, credits, loading: planLoading, refetch } = useUserPlan();

  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [textTemplate, setTextTemplate] = useState("fade_in");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoSpecs, setVideoSpecs] = useState<any>(null);
  const [lastVideo, setLastVideo] = useState<VideoData | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch last video on mount
  useEffect(() => {
    if (user) {
      fetchLastVideo();
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

  const plan = subscription?.plan || "free";
  const maxPhotos = plan === "free" ? 10 : plan === "pro" ? 20 : 100;

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
          duration: plan === "free" ? 30 : plan === "pro" ? 60 : 120,
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
          specs: { ...videoSpecs, textTemplate },
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
      toast.success("Vídeo gerado com sucesso!");
    } catch (error: any) {
      console.error("Error generating video:", error);
      toast.error(error.message || "Erro ao gerar vídeo");
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading || planLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="w-8 h-8 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <EditorHeader plan={plan} credits={credits?.balance || 0} />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Media */}
        <EditorSidebar
          photos={photos}
          maxPhotos={maxPhotos}
          selectedPhotoId={selectedPhotoId}
          onPhotosChange={setPhotos}
          onPhotoSelect={setSelectedPhotoId}
        />

        {/* Center - Preview */}
        <EditorPreview
          photos={photos}
          selectedPhotoId={selectedPhotoId}
          lastVideo={lastVideo}
          isGenerating={isGenerating}
          onRefresh={fetchLastVideo}
        />

        {/* Right Sidebar - Tools */}
        <EditorToolsPanel
          prompt={prompt}
          onPromptChange={setPrompt}
          textTemplate={textTemplate}
          onTextTemplateChange={setTextTemplate}
          videoSpecs={videoSpecs}
          isProcessing={isProcessing}
          isGenerating={isGenerating}
          onProcessPrompt={handleProcessPrompt}
          onGenerateVideo={handleGenerateVideo}
          credits={credits?.balance || 0}
          photoCount={photos.length}
          plan={plan}
        />
      </div>
    </div>
  );
}
