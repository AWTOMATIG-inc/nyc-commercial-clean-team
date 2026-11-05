import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Every /api route needs an admin login unless it is listed here.
const UPLOADED_FILES = /^\/api\/uploads\/.+$/;
const PUBLIC_ROUTES = {
  GET: [UPLOADED_FILES, /^\/api\/auth\/profile$/],
  HEAD: [UPLOADED_FILES],
  POST: [
    /^\/api\/chat$/,
    /^\/api\/contact$/,
    /^\/api\/quote$/,
    /^\/api\/subscriber$/,
    /^\/api\/booking$/,
    /^\/api\/blog\/comment$/,
    /^\/api\/auth\/(login|logout|register)$/,
  ],
};

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const publicRoutes = PUBLIC_ROUTES[request.method] || [];

  if (publicRoutes.some((route) => route.test(pathname))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const admin = token ? await verifyToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
