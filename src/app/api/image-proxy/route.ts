import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getFallbackSvg(text: string = "Preview"): string {
  const safeText = text.replace(/[^a-zA-Z0-9 _-]/g, "").slice(0, 30);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="50%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#312e81"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#grad)"/>
    <circle cx="400" cy="270" r="55" fill="#6366f1" fill-opacity="0.25"/>
    <circle cx="400" cy="270" r="35" fill="#6366f1" fill-opacity="0.4"/>
    <path d="M380 285 L420 285 L410 255 L390 255 Z" fill="#818cf8"/>
    <text x="400" y="370" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#f8fafc" text-anchor="middle">${safeText}</text>
    <text x="400" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#94a3b8" text-anchor="middle">KnowAboutMe Media</text>
  </svg>`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse(getFallbackSvg("Missing URL"), {
      status: 200,
      headers: { "Content-Type": "image/svg+xml;charset=utf-8" },
    });
  }

  try {
    const parsed = new URL(targetUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return new NextResponse(getFallbackSvg("Invalid URL"), {
        status: 200,
        headers: { "Content-Type": "image/svg+xml;charset=utf-8" },
      });
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      redirect: "follow",
    });

    const contentType = response.headers.get("content-type") || "";

    // If upstream returns non-image (e.g. HTML webpage from Amazon) or error status
    if (!response.ok || !contentType.startsWith("image/")) {
      return new NextResponse(getFallbackSvg("Media Unavailable"), {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml;charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse(getFallbackSvg("Load Error"), {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml;charset=utf-8",
        "Cache-Control": "public, max-age=1800",
      },
    });
  }
}
