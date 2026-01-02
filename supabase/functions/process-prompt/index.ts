import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { prompt, photoCount, duration } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const defaultPrompt = `Crie uma retrospectiva alegre do ano com minhas fotos, destacando momentos chave como viagens, amigos e conquistas. Use transições suaves, música uplifting e legendas animadas em branco sobre fundo azul claro. Duração total: 60 segundos.`;

    const userPrompt = prompt || defaultPrompt;

    const systemPrompt = `Você é um assistente especializado em criar especificações para vídeos de retrospectiva de ano.
Analise o prompt do usuário e retorne um JSON com as seguintes propriedades:
- theme: tema visual (ex: "nostalgic", "vibrant", "elegant", "playful")
- colorPalette: array de 3 cores hex principais
- transitionStyle: tipo de transição (ex: "fade", "zoom", "slide", "wave")
- musicMood: humor da música (ex: "uplifting", "emotional", "energetic", "calm")
- textTemplate: template de legenda (fade_in, bounce, typewriter, slide_up_glow, rotate_zoom)
- suggestedDuration: duração sugerida em segundos
- specialEffects: array de efeitos especiais (ex: ["particles", "glow", "confetti"])

Baseie sua análise no prompt: "${userPrompt}"
Número de fotos: ${photoCount || 10}
Duração desejada: ${duration || 60} segundos`;

    console.log("Processing prompt with AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let videoSpecs;
    try {
      videoSpecs = JSON.parse(content);
    } catch {
      // Default specs if parsing fails
      videoSpecs = {
        theme: "vibrant",
        colorPalette: ["#3B82F6", "#8B5CF6", "#EC4899"],
        transitionStyle: "fade",
        musicMood: "uplifting",
        textTemplate: "fade_in",
        suggestedDuration: 60,
        specialEffects: ["particles", "glow"],
      };
    }

    console.log("Generated video specs:", videoSpecs);

    return new Response(
      JSON.stringify({ specs: videoSpecs, originalPrompt: userPrompt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error processing prompt:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
