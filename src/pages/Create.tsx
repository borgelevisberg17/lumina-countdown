import { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan } from "@/hooks/useUserPlan";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Sparkles, 
  Upload, 
  X, 
  Image as ImageIcon, 
  Wand2,
  ArrowLeft,
  Loader2,
  Play,
  Type
} from "lucide-react";

const TEXT_TEMPLATES = [
  { id: "fade_in", name: "Fade-In Simples", description: "Texto aparece gradualmente, 2s" },
  { id: "bounce", name: "Bounce Animado", description: "Texto 'salta' para a tela" },
  { id: "typewriter", name: "Typewriter Effect", description: "Escrito letra por letra" },
  { id: "slide_up_glow", name: "Slide-Up com Glow", description: "Desliza com brilho neon" },
  { id: "rotate_zoom", name: "Rotate & Zoom", description: "Rotaciona com confete" },
];

const DEFAULT_PROMPT = "Crie uma retrospectiva alegre do ano com minhas fotos, destacando momentos chave como viagens, amigos e conquistas. Use transições suaves, música uplifting e legendas animadas em branco sobre fundo azul claro.";

async function getBackendFunctionErrorMessage(error: any): Promise<string> {
  // supabase-js throws specialized errors for Functions; they include a Response in `context`
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

export default function Create() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { subscription, credits, loading: planLoading, refetch } = useUserPlan();

  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [prompt, setPrompt] = useState("");
  const [textTemplate, setTextTemplate] = useState("fade_in");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoSpecs, setVideoSpecs] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const plan = subscription?.plan || "free";
  const maxPhotos = plan === "free" ? 10 : plan === "pro" ? 20 : 100;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPhotos = acceptedFiles.slice(0, maxPhotos - photos.length).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      caption: "",
    }));

    if (photos.length + acceptedFiles.length > maxPhotos) {
      toast.warning(`Limite de ${maxPhotos} fotos para seu plano`);
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
  }, [photos.length, maxPhotos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const updateCaption = (id: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
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

      // Generate video
      const { data, error } = await supabase.functions.invoke("generate-video", {
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
      toast.success("Vídeo gerado com sucesso!");
      navigate("/dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Criar Retrospectiva</span>
            </div>
          </div>

          <Badge variant="outline">
            {credits?.balance || 0} créditos
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Step 1: Upload Photos */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                Upload de Fotos
              </CardTitle>
              <CardDescription>
                Arraste ou selecione até {maxPhotos} fotos (máx. 20MB cada)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isDragActive
                    ? "Solte as fotos aqui..."
                    : "Arraste fotos aqui ou clique para selecionar"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG, WebP ou GIF
                </p>
              </div>

              {photos.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {photos.length} de {maxPhotos} fotos
                    </span>
                    <Progress value={(photos.length / maxPhotos) * 100} className="w-32 h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.preview}
                          alt={`Foto ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(photo.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <Input
                          placeholder="Legenda..."
                          className="mt-2 text-xs"
                          value={photo.caption}
                          onChange={(e) => updateCaption(photo.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Prompt */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                Prompt Customizado
              </CardTitle>
              <CardDescription>
                Descreva como você quer sua retrospectiva (opcional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={DEFAULT_PROMPT}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco para usar o prompt padrão
              </p>
            </CardContent>
          </Card>

          {/* Step 3: Text Template */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  3
                </div>
                Template de Legenda
              </CardTitle>
              <CardDescription>
                Escolha o estilo de animação para as legendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {TEXT_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                      textTemplate === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setTextTemplate(template.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Type className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Generate */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Pronto para gerar?</h3>
                  <p className="text-sm text-muted-foreground">
                    Custo estimado: {photos.length <= 10 ? 10 : photos.length <= 20 ? 20 : 40} créditos
                  </p>
                </div>

                <div className="flex gap-3">
                  {!videoSpecs ? (
                    <Button
                      onClick={handleProcessPrompt}
                      disabled={isProcessing || photos.length === 0}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Processar Prompt
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleGenerateVideo}
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

              {videoSpecs && (
                <div className="mt-6 p-4 bg-background/50 rounded-lg">
                  <h4 className="font-medium mb-2">Especificações do Vídeo:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Tema: <span className="text-muted-foreground">{videoSpecs.theme}</span></div>
                    <div>Transição: <span className="text-muted-foreground">{videoSpecs.transitionStyle}</span></div>
                    <div>Música: <span className="text-muted-foreground">{videoSpecs.musicMood}</span></div>
                    <div>Duração: <span className="text-muted-foreground">{videoSpecs.suggestedDuration}s</span></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
