import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] || // Netlify, Vercel
    req.headers.get("x-real-ip") || // Nginx, custom proxy
    "unknown";

  return new NextResponse(ip);
}
