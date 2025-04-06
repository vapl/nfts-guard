import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";
import { HolderDistribution } from "@/types/apiTypes/holderDistribution";

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
