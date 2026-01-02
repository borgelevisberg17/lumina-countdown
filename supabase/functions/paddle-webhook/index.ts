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

    const body = await req.json();
    const eventType = body.event_type;

    console.log(`Paddle webhook received: ${eventType}`);

    // Handle different Paddle events
    switch (eventType) {
      case "subscription.created":
      case "subscription.activated": {
        const { customer_id, subscription_id, items, custom_data } = body.data;
        const userId = custom_data?.user_id;
        
        if (!userId) {
          console.error("No user_id in custom_data");
          break;
        }

        // Determine plan from price_id
        const priceId = items?.[0]?.price?.id;
        let plan: "free" | "pro" | "vip" = "free";
        let weeklyCredits = 20;

        if (priceId?.includes("pro")) {
          plan = "pro";
          weeklyCredits = 200;
        } else if (priceId?.includes("vip")) {
          plan = "vip";
          weeklyCredits = 999999; // Unlimited
        }

        // Update subscription
        await supabase
          .from("subscriptions")
          .update({
            plan,
            paddle_subscription_id: subscription_id,
            paddle_customer_id: customer_id,
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("user_id", userId);

        // Update credits
        await supabase
          .from("credits")
          .update({
            weekly_allowance: weeklyCredits,
            balance: weeklyCredits,
            last_renewal: new Date().toISOString(),
          })
          .eq("user_id", userId);

        console.log(`Subscription activated for user ${userId}: ${plan}`);
        break;
      }

      case "subscription.updated": {
        const { subscription_id, items, status } = body.data;

        // Find user by subscription_id
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("paddle_subscription_id", subscription_id)
          .single();

        if (!subscription) {
          console.error("Subscription not found");
          break;
        }

        // Determine plan from price_id
        const priceId = items?.[0]?.price?.id;
        let plan: "free" | "pro" | "vip" = "free";
        let weeklyCredits = 20;

        if (priceId?.includes("pro")) {
          plan = "pro";
          weeklyCredits = 200;
        } else if (priceId?.includes("vip")) {
          plan = "vip";
          weeklyCredits = 999999;
        }

        await supabase
          .from("subscriptions")
          .update({ plan, status })
          .eq("paddle_subscription_id", subscription_id);

        await supabase
          .from("credits")
          .update({ weekly_allowance: weeklyCredits })
          .eq("user_id", subscription.user_id);

        console.log(`Subscription updated for user ${subscription.user_id}`);
        break;
      }

      case "subscription.canceled":
      case "subscription.past_due": {
        const { subscription_id } = body.data;

        await supabase
          .from("subscriptions")
          .update({
            plan: "free",
            status: eventType === "subscription.canceled" ? "canceled" : "past_due",
          })
          .eq("paddle_subscription_id", subscription_id);

        // Find user and reset credits
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("paddle_subscription_id", subscription_id)
          .single();

        if (subscription) {
          await supabase
            .from("credits")
            .update({ weekly_allowance: 20 })
            .eq("user_id", subscription.user_id);
        }

        console.log(`Subscription ${eventType} for ${subscription_id}`);
        break;
      }

      case "subscription.payment_succeeded": {
        const { subscription_id } = body.data;

        // Find subscription and renew credits
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("user_id, plan")
          .eq("paddle_subscription_id", subscription_id)
          .single();

        if (subscription) {
          const weeklyCredits = subscription.plan === "vip" ? 999999 : subscription.plan === "pro" ? 200 : 20;

          await supabase
            .from("credits")
            .update({
              balance: weeklyCredits,
              last_renewal: new Date().toISOString(),
            })
            .eq("user_id", subscription.user_id);

          await supabase
            .from("subscriptions")
            .update({
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq("paddle_subscription_id", subscription_id);

          console.log(`Credits renewed for user ${subscription.user_id}`);
        }
        break;
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Paddle webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
