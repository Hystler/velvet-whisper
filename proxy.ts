import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-session";

function isAdminDemoEnabled() {
  return process.env.ADMIN_DEMO_ENABLED === "true";
}

function getSafeNextPath(pathname: string) {
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return "/admin";
  }

  return pathname;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const password = process.env.ADMIN_PASSWORD;

  if (!isAdminDemoEnabled() || !password) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = await verifyAdminSessionToken(token, password);

  if (pathname.startsWith("/admin/login")) {
    if (!authenticated) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (authenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", getSafeNextPath(pathname));

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"]
};

