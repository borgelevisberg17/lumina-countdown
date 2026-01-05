import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { photos, action, videoContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "auto-cut") {
      // Auto-Cut: Analyze photos and rank them by quality/interest
      systemPrompt = `Você é um especialista em edição de vídeo e fotografia. Analise as descrições das fotos fornecidas e:
1. Classifique cada foto de 1-10 baseado em:
   - Qualidade visual estimada
   - Interesse emocional (rostos, ação, momentos especiais)
   - Composição e enquadramento
   - Relevância para uma retrospectiva

2. Sugira a ordem ideal das fotos para criar uma narrativa envolvente
3. Identifique as fotos que devem ter mais tempo de exibição (momentos-chave)
4. Identifique fotos redundantes ou de menor qualidade que podem ser removidas

RETORNE UM JSON VÁLIDO com esta estrutura:
{
  "rankings": [
    {"photoIndex": 0, "score": 8, "reason": "Momento especial com família", "suggestedDuration": 4},
    ...
  ],
  "suggestedOrder": [0, 2, 1, 3],
  "highlightPhotos": [0, 3],
  "lowQualityPhotos": [5],
  "narrative": "Começa com momento familiar, transição para viagem..."
}`;

      userPrompt = `Analise estas ${photos.length} fotos para uma retrospectiva de vídeo:
${photos.map((p: any, i: number) => `Foto ${i + 1}: ${p.fileName || "sem nome"} - Legenda: "${p.caption || "sem legenda"}"`).join("\n")}

Contexto do vídeo: ${videoContext || "Retrospectiva do ano"}`;

    } else if (action === "auto-cc") {
      // Auto-CC: Generate captions for photos
      systemPrompt = `Você é um especialista em criar legendas emocionais e envolventes para fotos em vídeos de retrospectiva. 
Para cada foto, crie uma legenda curta (máximo 8 palavras) que:
- Capture a emoção ou momento
- Seja poética mas não clichê
- Varie o estilo entre as fotos
- Use emojis ocasionalmente quando apropriado

RETORNE UM JSON VÁLIDO com esta estrutura:
{
  "captions": [
    {"photoIndex": 0, "caption": "Memórias que ficam no coração 💕", "emotion": "nostalgic"},
    {"photoIndex": 1, "caption": "Aventuras que nos transformam", "emotion": "adventurous"},
    ...
  ],
  "theme": "retrospectiva emocional",
  "suggestedMood": "emotional"
}`;

      userPrompt = `Gere legendas para estas ${photos.length} fotos de uma retrospectiva:
${photos.map((p: any, i: number) => `Foto ${i + 1}: ${p.fileName || "sem nome"} - Descrição atual: "${p.caption || "sem descrição"}"`).join("\n")}

Contexto: ${videoContext || "Retrospectiva do ano - momentos especiais"}`;

    } else if (action === "analyze-all") {
      // Combined analysis for both auto-cut and auto-cc
      systemPrompt = `Você é um especialista em edição de vídeo. Analise as fotos e forneça:
1. Ranking de qualidade/interesse de cada foto (1-10)
2. Ordem sugerida para melhor narrativa
3. Legendas criativas para cada foto (máximo 8 palavras cada)
4. Quais fotos merecem mais tempo de exibição
5. Sugestão de mood musical

RETORNE UM JSON VÁLIDO:
{
  "analysis": [
    {
      "photoIndex": 0,
      "score": 8,
      "caption": "Legenda criativa aqui",
      "suggestedDuration": 3,
      "isHighlight": true
    }
  ],
  "suggestedOrder": [0, 2, 1],
  "suggestedMood": "uplifting",
  "narrative": "Breve descrição da história"
}`;

      userPrompt = `Analise completamente estas ${photos.length} fotos para retrospectiva:
${photos.map((p: any, i: number) => `Foto ${i + 1}: "${p.fileName || "foto"}" - "${p.caption || "sem descrição"}"`).join("\n")}

Contexto: ${videoContext || "Retrospectiva do ano"}`;
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    console.log(`AI Analysis - Action: ${action}, Photos: ${photos.length}`);

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos de IA esgotados. Adicione mais créditos na sua conta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    let content = aiResponse.choices?.[0]?.message?.content || "";

    // Clean markdown code blocks
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return a fallback response
      result = {
        analysis: photos.map((_: any, i: number) => ({
          photoIndex: i,
          score: 7,
          caption: `Momento ${i + 1}`,
          suggestedDuration: 3,
          isHighlight: i === 0,
        })),
        suggestedOrder: photos.map((_: any, i: number) => i),
        suggestedMood: "uplifting",
        narrative: "Sua retrospectiva pessoal",
      };
    }

    console.log(`AI Analysis completed for action: ${action}`);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro na análise de IA" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
