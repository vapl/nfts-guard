import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";
import { HolderDistribution } from "@/types/apiTypes/holderDistribution";
import { HolderRiskMetrics } from "@/types/apiTypes/scanSummary";

export function generateHolderDistributionData(
  owners: NFTCollectionOwnerProps[]
): HolderDistribution {
  const result: HolderDistribution = {
    "1": 0,
    "2-5": 0,
    "6-10": 0,
    "11+": 0,
  };

  for (const owner of owners) {
    const count = owner.token_count;
    if (count === 1) result["1"] += 1;
    else if (count >= 2 && count <= 5) result["2-5"] += 1;
    else if (count >= 6 && count <= 10) result["6-10"] += 1;
    else if (count >= 11) result["11+"] += 1;
  }

  return result;
}

export function generateHolderRiskMetrics(
  owners: NFTCollectionOwnerProps[]
): HolderRiskMetrics {
  const totalOwners = owners.length;
  const whales = owners.filter((o) => o.is_whale).length;
  const whalesPercent = totalOwners === 0 ? 0 : (whales / totalOwners) * 100;

  const ownershipTop10 = owners
    .sort((a, b) => b.token_count - a.token_count)
    .slice(0, 10)
    .reduce((sum, o) => sum + o.token_count, 0);

  const totalTokens = owners.reduce((sum, o) => sum + o.token_count, 0);
  const decentralizationScore =
    totalTokens === 0 ? 100 : 100 - (ownershipTop10 / totalTokens) * 100;

  return {
    whalesPercent: parseFloat(whalesPercent.toFixed(2)),
    decentralizationScore: parseFloat(decentralizationScore.toFixed(2)),
  };
}
