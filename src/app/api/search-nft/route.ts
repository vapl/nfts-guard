/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  // ✅ Check if the query is a valid Ethereum address (e.g. 0x...)
  const isAddress = /^0x[a-fA-F0-9]{40}$/.test(query);

  try {
    const endpoint = isAddress
      ? `https://api.reservoir.tools/collections/v5?id=${query}`
      : `https://api.reservoir.tools/search/collections/v1?q=${encodeURIComponent(
          query
        )}&limit=100`;

    const response = await fetch(endpoint, {
      headers: {
        "x-api-key": process.env.RESERVOIR_API_KEY!,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Reservoir API error: ${response.status}`);
    }

    const data = await response.json();

    // Normalize result for contract address search
    if (isAddress && data?.collections?.length === 0) {
      return NextResponse.json({
        collections: [
          {
            collectionId: query,
            name: "Unknown Collection",
            symbol: "Custom",
            image: null,
          },
        ],
      });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("❌ NFT search failed:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch NFT collections" },
      { status: 500 }
    );
  }
}
