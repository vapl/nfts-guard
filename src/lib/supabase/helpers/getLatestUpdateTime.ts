import { supabase } from "@/lib/supabase/supabase";

export async function getLatestUpdateTime(
  contractAddress: string
): Promise<string | null> {
  const { data } = await supabase.rpc("get_latest_update_time", {
    contract_addr: contractAddress,
  });

  return data ?? null;
}
