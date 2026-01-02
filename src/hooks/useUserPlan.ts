import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type Credits = Database["public"]["Tables"]["credits"]["Row"];

interface UserPlan {
  subscription: Subscription | null;
  credits: Credits | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useUserPlan(): UserPlan {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = async () => {
    if (!user) {
      setSubscription(null);
      setCredits(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const [subResult, creditsResult] = await Promise.all([
      supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("credits").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    setSubscription(subResult.data);
    setCredits(creditsResult.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlan();
  }, [user]);

  return { subscription, credits, loading, refetch: fetchPlan };
}
