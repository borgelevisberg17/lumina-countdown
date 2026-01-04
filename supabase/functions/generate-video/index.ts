import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VideoRequest {
  videoId: string;
  photoIds: string[];
  specs: {
    theme: string;
    colorPalette: string[];
    transitionStyle: string;
    musicMood: string;
    textTemplate: string;
    suggestedDuration: number;
    specialEffects: string[];
  };
  captions: { photoId: string; caption: string }[];
}

serve(async (req) => {
  console.log("Generate-video function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      throw new Error("Server configuration error");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error("Auth error:", authError);
      throw new Error("Invalid authentication");
    }

    console.log("User authenticated:", user.id);

    const body = await req.json();
    const { videoId, photoIds, specs, captions }: VideoRequest = body;

    console.log("Request body:", { videoId, photoCount: photoIds?.length, specs: specs?.theme });

    if (!videoId || !photoIds || !specs) {
      throw new Error("Missing required fields: videoId, photoIds, or specs");
    }

    console.log(`Starting video generation for video ${videoId}`);

    // Update video status to processing
    const { error: updateError } = await supabase
      .from("videos")
      .update({ status: "processing" })
      .eq("id", videoId);

    if (updateError) {
      console.error("Error updating video status:", updateError);
    }

    // Get user's subscription and credits
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    if (subError) {
      console.log("Subscription error (may be new user):", subError.message);
    }

    const { data: credits, error: creditsError } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (creditsError) {
      console.error("Credits error:", creditsError);
    }

    console.log("User subscription:", subscription?.plan, "Credits:", credits?.balance);

    // Calculate credits needed
    const photoCount = photoIds.length;
    const duration = specs.suggestedDuration || 60;
    let creditsNeeded = 10; // Base

    if (photoCount > 10 || duration > 30) {
      creditsNeeded = 20;
    }
    if (photoCount > 20 || duration > 60) {
      creditsNeeded = 40;
    }
    // Extra 30s increments
    if (duration > 60) {
      creditsNeeded += Math.ceil((duration - 60) / 30) * 10;
    }

    console.log("Credits needed:", creditsNeeded);

    // Check credits
    if (!credits || credits.balance < creditsNeeded) {
      console.log("Insufficient credits");
      await supabase
        .from("videos")
        .update({
          status: "failed",
          error_message: "Créditos insuficientes",
        })
        .eq("id", videoId);

      return new Response(
        JSON.stringify({
          error: "Créditos insuficientes",
          required: creditsNeeded,
          available: credits?.balance || 0,
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check plan limits
    const plan = subscription?.plan || "free";
    const maxPhotos = plan === "free" ? 10 : plan === "pro" ? 20 : Infinity;
    const maxDuration = plan === "free" ? 30 : plan === "pro" ? 60 : 120;

    if (photoCount > maxPhotos) {
      console.log("Photo limit exceeded:", photoCount, ">", maxPhotos);
      await supabase
        .from("videos")
        .update({
          status: "failed",
          error_message: `Limite do plano: máximo ${maxPhotos} fotos`,
        })
        .eq("id", videoId);

      return new Response(
        JSON.stringify({ error: `Seu plano permite no máximo ${maxPhotos} fotos.` }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (duration > maxDuration) {
      console.log("Duration limit exceeded:", duration, ">", maxDuration);
      await supabase
        .from("videos")
        .update({
          status: "failed",
          error_message: `Limite do plano: máximo ${maxDuration}s`,
        })
        .eq("id", videoId);

      return new Response(
        JSON.stringify({ error: `Seu plano permite vídeos de até ${maxDuration}s.` }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Deduct credits
    const { error: deductError } = await supabase
      .from("credits")
      .update({ balance: credits.balance - creditsNeeded })
      .eq("user_id", user.id);

    if (deductError) {
      console.error("Error deducting credits:", deductError);
    }

    console.log("Credits deducted");

    // Get photos from storage
    const { data: photos, error: photosError } = await supabase
      .from("photos")
      .select("*")
      .in("id", photoIds);

    if (photosError) {
      console.error("Error fetching photos:", photosError);
    }

    console.log("Photos fetched:", photos?.length);

    // Generate signed URLs for photos
    const photoUrls = await Promise.all(
      (photos || []).map(async (photo) => {
        const { data } = await supabase.storage
          .from("photos")
          .createSignedUrl(photo.storage_path, 3600);
        return { id: photo.id, url: data?.signedUrl, fileName: photo.file_name };
      })
    );

    // Simulate video generation (in production, this would call a video rendering service)
    const videoMetadata = {
      specs,
      photoUrls,
      captions: captions || [],
      generatedAt: new Date().toISOString(),
      creditsUsed: creditsNeeded,
    };

    // Mark as completed
    const { error: completeError } = await supabase
      .from("videos")
      .update({
        status: "completed",
        duration_seconds: duration,
        photo_count: photoCount,
        credits_used: creditsNeeded,
        text_template: specs.textTemplate,
        metadata: videoMetadata,
      })
      .eq("id", videoId);

    if (completeError) {
      console.error("Error completing video:", completeError);
      throw completeError;
    }

    // Insert video_photos records
    if (captions && captions.length > 0) {
      const videoPhotosData = photoIds.map((photoId, index) => ({
        video_id: videoId,
        photo_id: photoId,
        order_index: index,
        caption: captions.find(c => c.photoId === photoId)?.caption || null,
      }));

      const { error: vpError } = await supabase.from("video_photos").insert(videoPhotosData);
      if (vpError) {
        console.error("Error inserting video_photos:", vpError);
      }
    }

    console.log(`Video ${videoId} generation completed successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        videoId,
        creditsUsed: creditsNeeded,
        message: "Video generation completed successfully" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error generating video:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
