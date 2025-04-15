import { saveOwnersToSupabase } from "@/lib/supabase/dataStorage/saveOwners";
import { shouldUpdateOwners } from "@/lib/supabase/shouldUpdateOwners";
import { supabase } from "@/lib/supabase/supabase";
import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";
import reservoirClient from "./reservoir";
import { RISK_RULES } from "../config/riskRulesConfig";
import { getCollectionData } from "./getReservoirCollections";

const R = RISK_RULES.whaleDefinition;

const isWhale = (tokenCount: number, ownerShipPercentage: number): boolean => {
  const { minTokenCount, minOwnershipPercentage } = R;

  return (
    tokenCount >= minTokenCount || ownerShipPercentage >= minOwnershipPercentage
  );
};

// Timeout to avoid too many requests error
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isOwnerDifferent(
  a: NFTCollectionOwnerProps,
  b: NFTCollectionOwnerProps
): boolean {
  const floatFields: (keyof NFTCollectionOwnerProps)[] = [
    "token_count",
    "on_sale_count",
    "ownership_percentage",
  ];
  for (const key of floatFields) {
    const aVal = typeof a[key] === "number" ? (a[key] as number) : 0;
    const bVal = typeof b[key] === "number" ? (b[key] as number) : 0;
    if (Math.abs(aVal - bVal) > 0.01) return true;
  }
  return a.is_whale !== b.is_whale;
}

export async function getNFTCollectionOwners(contractAddress: string) {
  const collectionResponse = await getCollectionData(contractAddress);
  const totalSupply = parseInt(collectionResponse.total_supply || "0", 10);

  const { data: existingOwnersRaw, error: existingError } = await supabase
    .from("nft_owners")
    .select(
      "wallet, token_count, on_sale_count, ownership_percentage, is_whale"
    )
    .eq("contract_address", contractAddress);

  if (existingError) {
    console.error("❌ Failed to fetch existing owners:", existingError);
    return [];
  }

  const noOwnersExist = !existingOwnersRaw || existingOwnersRaw.length === 0;
  const needsUpdate =
    noOwnersExist || (await shouldUpdateOwners(contractAddress));

  if (!needsUpdate) {
    return [];
  }

  const ownerMap = new Map(
    (existingOwnersRaw || []).map((o) => [o.wallet.toLowerCase(), o])
  );

  const allChangedOwners: NFTCollectionOwnerProps[] = [];
  let offset = 0;
  const PAGE_SIZE = 500;
  const MAX_ITERATIONS = 20;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await reservoirClient.get(
      `/owners/v2?contract=${contractAddress}&limit=${PAGE_SIZE}&offset=${offset}`
    );

    const owners = response.data?.owners || [];
    if (!owners.length) break;

    const now = new Date().toISOString();

    const transformedOwners: NFTCollectionOwnerProps[] = owners.map((o) => {
      const tokenCount = Number(o.ownership?.tokenCount ?? 0);
      const onSaleCount = Number(o.ownership?.onSaleCount ?? 0);

      const ownerShipPercentage =
        totalSupply && totalSupply > 0
          ? +((tokenCount / totalSupply) * 100).toFixed(4)
          : 0;

      return {
        wallet: o.address.toLowerCase(),
        token_count: tokenCount,
        on_sale_count: onSaleCount,
        ownership_percentage: ownerShipPercentage,
        is_whale: isWhale(tokenCount, ownerShipPercentage),
        contract_address: contractAddress,
        last_updated: now,
      };
    });

    const filteredOwners = transformedOwners.filter((o) => o.token_count > 0);

    const changedOwners = filteredOwners.filter((newOwner) => {
      const existing = ownerMap.get(newOwner.wallet);
      return !existing || isOwnerDifferent(newOwner, existing);
    });

    allChangedOwners.push(...changedOwners);

    if (owners.length < PAGE_SIZE) break;
    await sleep(500);
    offset += PAGE_SIZE;
  }

  if (allChangedOwners.length > 0) {
    await saveOwnersToSupabase(allChangedOwners);
  } else {
  }

  return allChangedOwners;
}
