import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "0.0.0.0";

  return new Response(ip);
}
