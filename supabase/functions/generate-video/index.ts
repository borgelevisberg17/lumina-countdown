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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    const { videoId, photoIds, specs, captions }: VideoRequest = await req.json();

    console.log(`Starting video generation for video ${videoId}`);

    // Update video status to processing
    await supabase
      .from("videos")
      .update({ status: "processing" })
      .eq("id", videoId);

    // Get user's subscription and credits
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    const { data: credits } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();

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

    // Check credits
    if (!credits || credits.balance < creditsNeeded) {
      await supabase
        .from("videos")
        .update({ 
          status: "failed", 
          error_message: "Insufficient credits" 
        })
        .eq("id", videoId);

      return new Response(
        JSON.stringify({ 
          error: "Insufficient credits", 
          required: creditsNeeded, 
          available: credits?.balance || 0 
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check plan limits
    const plan = subscription?.plan || "free";
    const maxPhotos = plan === "free" ? 10 : plan === "pro" ? 20 : Infinity;
    const maxDuration = plan === "free" ? 30 : plan === "pro" ? 60 : 120;

    if (photoCount > maxPhotos) {
      await supabase
        .from("videos")
        .update({ 
          status: "failed", 
          error_message: `Plan limit: max ${maxPhotos} photos` 
        })
        .eq("id", videoId);

      return new Response(
        JSON.stringify({ error: `Your plan allows max ${maxPhotos} photos` }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (duration > maxDuration) {
      await supabase
        .from("videos")
        .update({ 
          status: "failed", 
          error_message: `Plan limit: max ${maxDuration}s duration` 
        })
        .eq("id", videoId);

      return new Response(
        JSON.stringify({ error: `Your plan allows max ${maxDuration}s videos` }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Deduct credits
    await supabase
      .from("credits")
      .update({ balance: credits.balance - creditsNeeded })
      .eq("user_id", user.id);

    // Get photos from storage
    const { data: photos } = await supabase
      .from("photos")
      .select("*")
      .in("id", photoIds);

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
    // For now, we'll mark it as completed with metadata
    const videoMetadata = {
      specs,
      photoUrls,
      captions,
      generatedAt: new Date().toISOString(),
      creditsUsed: creditsNeeded,
    };

    // In a real implementation, you would:
    // 1. Send photos to a video rendering service (e.g., Remotion, FFmpeg API)
    // 2. Apply transitions based on specs.transitionStyle
    // 3. Add text overlays based on specs.textTemplate
    // 4. Add background music based on specs.musicMood
    // 5. Upload final video to storage
    // 6. Update video record with storage path

    // For demo purposes, mark as completed
    await supabase
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

    // Insert video_photos records
    const videoPhotosData = photoIds.map((photoId, index) => ({
      video_id: videoId,
      photo_id: photoId,
      order_index: index,
      caption: captions.find(c => c.photoId === photoId)?.caption || null,
    }));

    await supabase.from("video_photos").insert(videoPhotosData);

    console.log(`Video ${videoId} generation completed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        videoId,
        creditsUsed: creditsNeeded,
        message: "Video generation started successfully" 
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
