import { NextRequest, NextResponse } from "next/server";

// Redirects .fly.dev traffic to maximenewman.com — single canonical entrypoint
export function middleware(req: NextRequest) {
  if (req.nextUrl.hostname.endsWith(".fly.dev")) {
    const url = req.nextUrl.clone();
    url.hostname = "maximenewman.com";
    url.protocol = "https";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }
}

export const config = {
  matcher: "/:path*",
};
