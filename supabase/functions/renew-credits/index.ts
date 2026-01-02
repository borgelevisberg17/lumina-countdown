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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find all credits that need renewal (last_renewal > 7 days ago)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: creditsToRenew, error } = await supabase
      .from("credits")
      .select("id, user_id, weekly_allowance")
      .lt("last_renewal", sevenDaysAgo);

    if (error) {
      throw error;
    }

    console.log(`Found ${creditsToRenew?.length || 0} credits to renew`);

    // Renew each user's credits
    for (const credit of creditsToRenew || []) {
      await supabase
        .from("credits")
        .update({
          balance: credit.weekly_allowance,
          last_renewal: new Date().toISOString(),
        })
        .eq("id", credit.id);

      console.log(`Renewed credits for user ${credit.user_id}: ${credit.weekly_allowance}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        renewed: creditsToRenew?.length || 0 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error renewing credits:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
