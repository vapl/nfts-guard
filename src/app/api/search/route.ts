// app/api/search/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const response = await fetch(
    `https://api.reservoir.tools/collections/search/v1?prefix=${encodeURIComponent(
      query
    )}&chains=1`,
    {
      headers: {
        "x-api-key": process.env.RESERVOIR_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from Reservoir" },
      { status: 500 }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
