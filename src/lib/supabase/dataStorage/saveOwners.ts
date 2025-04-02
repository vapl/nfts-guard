import { supabase } from "@/lib/supabase/supabase";
import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";

type FloatFieldKeys = "token_count" | "on_sale_count" | "ownership_percentage";

function isOwnerDifferent(
  a: NFTCollectionOwnerProps,
  b: NFTCollectionOwnerProps
): boolean {
  const floatFields: FloatFieldKeys[] = [
    "token_count",
    "on_sale_count",
    "ownership_percentage",
  ];

  for (const key of floatFields) {
    if (Math.abs((a[key] ?? 0) - (b[key] ?? 0)) > 0.01) return true;
  }

  return a.is_whale !== b.is_whale;
}

export async function saveOwnersToSupabase(owners: NFTCollectionOwnerProps[]) {
  if (!owners.length) return;

  const contractAddress = owners[0].contract_address;

  try {
    const { data: existingOwners, error } = await supabase
      .from("nft_owners")
      .select(
        "wallet, token_count, on_sale_count, ownership_percentage, is_whale"
      )
      .eq("contract_address", contractAddress);

    if (error) {
      console.error("❌ Failed to fetch existing owners:", error);
      return;
    }

    const now = new Date().toISOString();
    const changedOwners = owners
      .filter((newOwner) => {
        const existing = existingOwners.find(
          (o) => o.wallet === newOwner.wallet
        );
        return !existing || isOwnerDifferent(newOwner, existing);
      })
      .map((owner) => ({ ...owner, last_updated: now }));

    if (!changedOwners.length) {
      console.log("✅ No changes detected in owners. Skipping save.");
      return;
    }

    const { error: upsertError } = await supabase
      .from("nft_owners")
      .upsert(changedOwners, {
        onConflict: "wallet,contract_address",
      });

    if (upsertError) {
      console.error("❌ Failed to save changed owners:", upsertError);
    } else {
      console.log(`✅ ${changedOwners.length} owners updated in Supabase.`);
    }
  } catch (err) {
    console.error("🔥 Unexpected error in saveOwnersToSupabase:", err);
  }
}
