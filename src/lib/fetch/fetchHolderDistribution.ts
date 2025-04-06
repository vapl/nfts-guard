// src/lib/fetch/fetchHolderDistribution.ts

export async function fetchHolderDistribution(contractAddress: string) {
  try {
    const response = await fetch(
      `/api/holder-distribution?contractAddress=${contractAddress}`
    );
    if (!response.ok) throw new Error("Failed to fetch holder distribution");
    return await response.json();
  } catch (error) {
    console.error("[fetchHolderDistribution]", error);
    return null;
  }
}
