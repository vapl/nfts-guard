import { supabase } from "@/lib/supabase/supabase";
import { getClientInfo } from "@/utils/getClientInfo";

/**
 * Returns a verified email linked to user's IP,
 * but only if it is marked as `is_verified` in Supabase.
 */
export const getVerifiedEmail = async (): Promise<string | null> => {
  try {
    const { ip } = await getClientInfo();

    const { data: usage } = await supabase
      .from("scan_usage")
      .select("email")
      .eq("ip_address", ip)
      .maybeSingle();

    const email = usage?.email?.toLowerCase();
    if (!email) return null;

    const { data: subscriber } = await supabase
      .from("subscribers")
      .select("email")
      .eq("email", email)
      .eq("is_verified", true) // ✅ ensure verified
      .maybeSingle();

    return subscriber?.email ?? null;
  } catch (err) {
    console.error("getVerifiedEmail error:", err);
    return null;
  }
};
